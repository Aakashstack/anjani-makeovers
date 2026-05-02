import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

type Brand = { id: string; name: string; display_order: number };

export default function AdminBrands() {
  const [items, setItems] = useState<Brand[]>([]);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();

  const fetchAll = async () => {
    const { data } = await supabase.from("brands").select("*").order("display_order");
    if (data) setItems(data as Brand[]);
  };
  useEffect(() => { fetchAll(); }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const { data } = await supabase.from("brands").insert({ name: newName.trim(), display_order: items.length }).select().single();
    if (data) { setItems([...items, data as Brand]); setNewName(""); toast({ title: "Brand added" }); }
  };

  const remove = async (id: string) => {
    await supabase.from("brands").delete().eq("id", id);
    setItems(items.filter((b) => b.id !== id));
  };

  const rename = async (id: string, name: string) => {
    setItems(items.map((b) => b.id === id ? { ...b, name } : b));
  };

  const saveRename = async (b: Brand) => {
    await supabase.from("brands").update({ name: b.name }).eq("id", b.id);
    toast({ title: "Saved" });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-1">Brands Carousel</h2>
      <p className="text-sm text-muted-foreground mb-6">The scrolling list of brand names below the hero.</p>

      <div className="flex gap-2 mb-6">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New brand name" onKeyDown={(e) => e.key === "Enter" && add()} />
        <Button onClick={add}><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>

      <div className="space-y-2">
        {items.map((b) => (
          <div key={b.id} className="flex gap-2 items-center rounded-lg border border-border bg-card p-3">
            <Input value={b.name} onChange={(e) => rename(b.id, e.target.value)} onBlur={() => saveRename(b)} />
            <Button size="sm" variant="ghost" onClick={() => remove(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
