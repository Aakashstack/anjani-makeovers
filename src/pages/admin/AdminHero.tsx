import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Hero = { badge: string; headline: string; subheadline: string; cta_primary: string; cta_secondary: string };

const defaults: Hero = {
  badge: "Professional Makeup Artist",
  headline: "Enhancing Your Natural Beauty",
  subheadline: "Transform your look with expert makeup artistry. From bridal glam to editorial perfection, every face tells a beautiful story.",
  cta_primary: "View Portfolio",
  cta_secondary: "Book Appointment",
};

export default function AdminHero() {
  const [hero, setHero] = useState<Hero>(defaults);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("value").eq("key", "hero").maybeSingle();
      if (data?.value) setHero({ ...defaults, ...(data.value as any) });
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: "hero", value: hero as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Hero section saved!" });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Hero Section</h2>
          <p className="text-sm text-muted-foreground">The big banner at the top of your homepage.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Badge (small pill above the headline)</label>
          <Input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Headline</label>
          <Input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
          <p className="text-xs text-muted-foreground mt-1">The last word will appear in gold italic.</p>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Subheadline</label>
          <Textarea value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Primary button</label>
            <Input value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Secondary button</label>
            <Input value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
