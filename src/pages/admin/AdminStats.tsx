import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

type Stat = { value: number; suffix: string; label: string };

const defaults: Stat[] = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 200, suffix: "+", label: "Weddings" },
  { value: 5, suffix: ".0", label: "Rating" },
];

export default function AdminStats() {
  const [stats, setStats] = useState<Stat[]>(defaults);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("value").eq("key", "stats").maybeSingle();
      if (data?.value && Array.isArray(data.value)) setStats(data.value as Stat[]);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ key: "stats", value: stats as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Stats saved!" });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Stats Counter</h2>
          <p className="text-sm text-muted-foreground">The numbers that animate up below the About section.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
      </div>

      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex gap-2 items-center rounded-lg border border-border bg-card p-3">
            <Input type="number" value={s.value} onChange={(e) => { const c = [...stats]; c[i] = { ...c[i], value: parseInt(e.target.value) || 0 }; setStats(c); }} className="w-24" />
            <Input value={s.suffix} onChange={(e) => { const c = [...stats]; c[i] = { ...c[i], suffix: e.target.value }; setStats(c); }} className="w-20" placeholder="+" />
            <Input value={s.label} onChange={(e) => { const c = [...stats]; c[i] = { ...c[i], label: e.target.value }; setStats(c); }} placeholder="Label" />
            <Button size="sm" variant="ghost" onClick={() => setStats(stats.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" className="mt-3" onClick={() => setStats([...stats, { value: 0, suffix: "+", label: "New stat" }])}>
        <Plus className="w-4 h-4 mr-1" /> Add stat
      </Button>
    </div>
  );
}
