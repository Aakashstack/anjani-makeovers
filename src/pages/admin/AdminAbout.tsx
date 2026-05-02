import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Plus } from "lucide-react";

type About = { label: string; title: string; paragraph_1: string; paragraph_2: string; image_url: string };
type Highlight = { id: string; label: string; icon: string; display_order: number };

const defaults: About = {
  label: "About Me",
  title: "Meet Anjani",
  paragraph_1: "With over 5 years of professional experience, I specialize in creating flawless, stunning looks that enhance your natural beauty.",
  paragraph_2: "Trained in HD, airbrush, and traditional techniques, I stay updated with the latest trends.",
  image_url: "",
};

const ICONS = ["Star", "Award", "Heart", "Users", "Sparkles"];

export default function AdminAbout() {
  const [about, setAbout] = useState<About>(defaults);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchAll = async () => {
    const [c, h] = await Promise.all([
      supabase.from("site_content").select("value").eq("key", "about").maybeSingle(),
      supabase.from("about_highlights").select("*").order("display_order"),
    ]);
    if (c.data?.value) setAbout({ ...defaults, ...(c.data.value as any) });
    if (h.data) setHighlights(h.data as Highlight[]);
  };

  useEffect(() => { fetchAll(); }, []);

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const path = `about-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("about-images").upload(path, file);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); setUploading(false); return; }
    const url = supabase.storage.from("about-images").getPublicUrl(path).data.publicUrl;
    setAbout((a) => ({ ...a, image_url: url }));
    setUploading(false);
    toast({ title: "Photo uploaded — remember to Save!" });
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: "about", value: about as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "About section saved!" });
  };

  const addHighlight = async () => {
    const { data } = await supabase.from("about_highlights").insert({ label: "New highlight", icon: "Star", display_order: highlights.length }).select().single();
    if (data) setHighlights([...highlights, data as Highlight]);
  };

  const saveHighlight = async (h: Highlight) => {
    await supabase.from("about_highlights").update({ label: h.label, icon: h.icon }).eq("id", h.id);
    toast({ title: "Highlight saved" });
  };

  const deleteHighlight = async (id: string) => {
    await supabase.from("about_highlights").delete().eq("id", id);
    setHighlights(highlights.filter((h) => h.id !== id));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">About / Artist Info</h2>
          <p className="text-sm text-muted-foreground">Your photo, story, and the highlight badges.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Eyebrow label</label>
            <Input value={about.label} onChange={(e) => setAbout({ ...about, label: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Title (last word goes gold)</label>
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
          <label className="text-sm font-medium block mb-2">Artist photo</label>
          <div className="flex items-center gap-4">
            {about.image_url ? (
              <img src={about.image_url} alt="" className="w-24 h-32 object-cover rounded-lg border border-border" />
            ) : (
              <div className="w-24 h-32 rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">No photo</div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted text-sm font-medium">
              <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} disabled={uploading} />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">Highlight badges</h3>
        <div className="space-y-2">
          {highlights.map((h) => (
            <div key={h.id} className="flex gap-2 items-center">
              <select
                value={h.icon}
                onChange={(e) => setHighlights(highlights.map((x) => x.id === h.id ? { ...x, icon: e.target.value } : x))}
                className="px-3 py-2 rounded-md border border-border bg-background text-sm w-36"
              >
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <Input value={h.label} onChange={(e) => setHighlights(highlights.map((x) => x.id === h.id ? { ...x, label: e.target.value } : x))} placeholder="Label" />
              <Button size="sm" variant="outline" onClick={() => saveHighlight(h)}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => deleteHighlight(h.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={addHighlight}><Plus className="w-4 h-4 mr-1" /> Add highlight</Button>
      </section>
    </div>
  );
}
