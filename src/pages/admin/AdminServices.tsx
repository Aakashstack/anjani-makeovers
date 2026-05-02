import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";

type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  display_order: number;
};

const ICON_OPTIONS = ["Crown", "PartyPopper", "Heart", "Camera", "Sparkles", "Star", "Flower", "Gem", "Brush"];

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    const { data } = await supabase.from("services").select("*").order("display_order");
    if (data) setItems(data as Service[]);
  };

  useEffect(() => { fetchAll(); }, []);

  const update = (id: string, patch: Partial<Service>) =>
    setItems(items.map((s) => s.id === id ? { ...s, ...patch } : s));

  const saveOne = async (s: Service) => {
    setSavingId(s.id);
    const { error } = await supabase.from("services").update({
      icon: s.icon, title: s.title, description: s.description, price: s.price, duration: s.duration,
    }).eq("id", s.id);
    setSavingId(null);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: `"${s.title}" saved` });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await supabase.from("services").delete().eq("id", id);
    setItems(items.filter((s) => s.id !== id));
    toast({ title: "Service deleted" });
  };

  const add = async () => {
    const { data } = await supabase.from("services").insert({
      icon: "Sparkles", title: "New Service", description: "", price: "", duration: "", display_order: items.length,
    }).select().single();
    if (data) setItems([...items, data as Service]);
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    await Promise.all(next.map((s, i) => supabase.from("services").update({ display_order: i }).eq("id", s.id)));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Services</h2>
          <p className="text-sm text-muted-foreground">These show on the homepage and the Services page.</p>
        </div>
        <Button onClick={add}><Plus className="w-4 h-4 mr-1" /> Add Service</Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No services yet. Click "Add Service".</p>
      ) : (
        <div className="space-y-4">
          {items.map((s, idx) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(idx, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Icon</label>
                    <select
                      value={s.icon}
                      onChange={(e) => update(s.id, { icon: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                    >
                      {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground block mb-1">Title</label>
                    <Input value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Description</label>
                <Textarea value={s.description} onChange={(e) => update(s.id, { description: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Price</label>
                  <Input value={s.price} onChange={(e) => update(s.id, { price: e.target.value })} placeholder="₹15,000 – ₹35,000" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Duration</label>
                  <Input value={s.duration} onChange={(e) => update(s.id, { duration: e.target.value })} placeholder="3–4 hours" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                <Button size="sm" onClick={() => saveOne(s)} disabled={savingId === s.id}>
                  <Save className="w-4 h-4 mr-1" /> {savingId === s.id ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
