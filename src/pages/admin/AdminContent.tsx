import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Plus } from "lucide-react";

type Hero = { badge: string; headline: string; subheadline: string; cta_primary: string; cta_secondary: string };
type About = { label: string; title: string; paragraph_1: string; paragraph_2: string; image_url: string };
type Stat = { value: number; suffix: string; label: string };
type Highlight = { id: string; label: string; icon: string; display_order: number };

export default function AdminContent() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [about, setAbout] = useState<About | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const defaultHero: Hero = {
    badge: "Professional Makeup Artist",
    headline: "Enhancing Your Natural Beauty",
    subheadline: "Transform your look with expert makeup artistry. From bridal glam to editorial perfection, every face tells a beautiful story.",
    cta_primary: "View Portfolio",
    cta_secondary: "Book Appointment",
  };
  const defaultAbout: About = {
    label: "About Me",
    title: "Meet Anjani",
    paragraph_1: "With over 5 years of professional experience, I specialize in creating flawless, stunning looks that enhance your natural beauty.",
    paragraph_2: "Trained in HD, airbrush, and traditional techniques, I stay updated with the latest trends.",
    image_url: "",
  };
  const defaultStats: Stat[] = [
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 500, suffix: "+", label: "Happy Clients" },
    { value: 200, suffix: "+", label: "Weddings" },
    { value: 5, suffix: ".0", label: "Rating" },
  ];

  const fetchAll = async () => {
    const [content, hl] = await Promise.all([
      supabase.from("site_content").select("*").in("key", ["hero", "about", "stats"]),
      supabase.from("about_highlights").select("*").order("display_order"),
    ]);
    const rows = content.data || [];
    const heroRow = rows.find((r: any) => r.key === "hero")?.value as any;
    const aboutRow = rows.find((r: any) => r.key === "about")?.value as any;
    const statsRow = rows.find((r: any) => r.key === "stats")?.value as any;
    // Merge with defaults so missing/legacy fields are filled in
    setHero({ ...defaultHero, ...(heroRow || {}) });
    setAbout({ ...defaultAbout, ...(aboutRow || {}) });
    setStats(Array.isArray(statsRow) && statsRow.length > 0 && typeof statsRow[0]?.value === "number" ? statsRow : defaultStats);
    setHighlights(hl.data || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const uploadAboutPhoto = async (file: File) => {
    setUploadingPhoto(true);
    const path = `about-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("about-images").upload(path, file);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); setUploadingPhoto(false); return; }
    const url = supabase.storage.from("about-images").getPublicUrl(path).data.publicUrl;
    setAbout((a) => a ? { ...a, image_url: url } : a);
    setUploadingPhoto(false);
    toast({ title: "Photo uploaded — remember to Save!" });
  };

  const saveAll = async () => {
    setSaving(true);
    // Use upsert so legacy/missing rows get created with the right shape
    const results = await Promise.all([
      hero ? supabase.from("site_content").upsert({ key: "hero", value: hero as any }, { onConflict: "key" }) : null,
      about ? supabase.from("site_content").upsert({ key: "about", value: about as any }, { onConflict: "key" }) : null,
      supabase.from("site_content").upsert({ key: "stats", value: stats as any }, { onConflict: "key" }),
    ]);
    setSaving(false);
    const err = results.find((r) => r && (r as any).error)?.["error" as any];
    if (err) {
      toast({ title: "Save failed", description: (err as any).message, variant: "destructive" });
    } else {
      toast({ title: "Homepage content saved!" });
    }
  };

  const addHighlight = async () => {
    const { data } = await supabase.from("about_highlights").insert({ label: "New highlight", icon: "Star", display_order: highlights.length }).select().single();
    if (data) setHighlights([...highlights, data]);
  };

  const updateHighlight = async (id: string, updates: Partial<Highlight>) => {
    setHighlights(highlights.map((h) => h.id === id ? { ...h, ...updates } : h));
  };

  const saveHighlight = async (h: Highlight) => {
    await supabase.from("about_highlights").update({ label: h.label, icon: h.icon }).eq("id", h.id);
    toast({ title: "Highlight saved" });
  };

  const deleteHighlight = async (id: string) => {
    await supabase.from("about_highlights").delete().eq("id", id);
    setHighlights(highlights.filter((h) => h.id !== id));
  };

  if (!hero || !about) return <div className="text-muted-foreground">Loading content…</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">Homepage Content</h2>
        <Button onClick={saveAll} disabled={saving}>{saving ? "Saving..." : "Save All Changes"}</Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">Hero Section</h3>
        <div>
          <label className="text-sm font-medium block mb-1">Badge</label>
          <Input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Headline</label>
          <Input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Subheadline</label>
          <Textarea value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Primary CTA</label>
            <Input value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Secondary CTA</label>
            <Input value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">About Section</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Eyebrow Label</label>
            <Input value={about.label} onChange={(e) => setAbout({ ...about, label: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Title</label>
            <Input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Paragraph 1</label>
          <Textarea value={about.paragraph_1} onChange={(e) => setAbout({ ...about, paragraph_1: e.target.value })} rows={3} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Paragraph 2</label>
          <Textarea value={about.paragraph_2} onChange={(e) => setAbout({ ...about, paragraph_2: e.target.value })} rows={3} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Artist Photo</label>
          <div className="flex items-center gap-4">
            {about.image_url ? (
              <img src={about.image_url} alt="" className="w-24 h-32 object-cover rounded-lg border border-border" />
            ) : (
              <div className="w-24 h-32 rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">No photo</div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted text-sm font-medium">
              <Upload className="w-4 h-4" /> {uploadingPhoto ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAboutPhoto(f); }} disabled={uploadingPhoto} />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">About Highlights</h3>
        <div className="space-y-2">
          {highlights.map((h) => (
            <div key={h.id} className="flex gap-2 items-center">
              <Input value={h.icon} onChange={(e) => updateHighlight(h.id, { icon: e.target.value })} placeholder="Icon (Star, Award, Heart, Users)" className="w-48" />
              <Input value={h.label} onChange={(e) => updateHighlight(h.id, { label: e.target.value })} placeholder="Label" />
              <Button size="sm" variant="outline" onClick={() => saveHighlight(h)}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => deleteHighlight(h.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={addHighlight}><Plus className="w-4 h-4 mr-1" /> Add highlight</Button>
        <p className="text-xs text-muted-foreground">Icon names: <code>Star</code>, <code>Award</code>, <code>Heart</code>, <code>Users</code>, <code>Sparkles</code></p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">Stats Counter</h3>
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input type="number" value={s.value} onChange={(e) => { const c = [...stats]; c[i] = { ...c[i], value: parseInt(e.target.value) || 0 }; setStats(c); }} className="w-24" />
              <Input value={s.suffix} onChange={(e) => { const c = [...stats]; c[i] = { ...c[i], suffix: e.target.value }; setStats(c); }} className="w-20" placeholder="+" />
              <Input value={s.label} onChange={(e) => { const c = [...stats]; c[i] = { ...c[i], label: e.target.value }; setStats(c); }} placeholder="Label" />
              <Button size="sm" variant="ghost" onClick={() => setStats(stats.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={() => setStats([...stats, { value: 0, suffix: "+", label: "New stat" }])}><Plus className="w-4 h-4 mr-1" /> Add stat</Button>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={saveAll} disabled={saving} className="shadow-lg">{saving ? "Saving..." : "Save All Changes"}</Button>
      </div>
    </div>
  );
}
