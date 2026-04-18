import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, Edit, Images } from "lucide-react";
import { SortableGrid } from "@/components/admin/SortableGrid";

type PortfolioItem = { id: string; title: string; category: string; image_url: string; display_order: number };

const categories = ["Bridal", "Party", "Engagement", "Photoshoot", "Other"];

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [category, setCategory] = useState("Bridal");
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("portfolio_items").select("*").order("display_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadOne = async (file: File, order: number, title: string, cat: string) => {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { error } = await supabase.storage.from("portfolio-images").upload(path, file);
    if (error) throw error;
    const url = supabase.storage.from("portfolio-images").getPublicUrl(path).data.publicUrl;
    await supabase.from("portfolio_items").insert({ title, category: cat, image_url: url, display_order: order });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setBulkProgress({ done: 0, total: files.length });
    let success = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        await uploadOne(files[i], items.length + i, files[i].name.replace(/\.[^.]+$/, ""), category);
        success++;
      } catch (err) {
        console.error(err);
      }
      setBulkProgress({ done: i + 1, total: files.length });
    }
    setUploading(false);
    setBulkProgress(null);
    fetchItems();
    toast({ title: `Uploaded ${success}/${files.length} images` });
    e.target.value = "";
  };

  const deleteItem = async (item: PortfolioItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const fileName = item.image_url.split("/").pop();
    if (fileName) await supabase.storage.from("portfolio-images").remove([fileName]);
    await supabase.from("portfolio_items").delete().eq("id", item.id);
    fetchItems();
    toast({ title: "Deleted" });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await supabase.from("portfolio_items").update({ title: editing.title, category: editing.category }).eq("id", editing.id);
    setEditing(null);
    fetchItems();
    toast({ title: "Updated" });
  };

  const handleReorder = async (reordered: PortfolioItem[]) => {
    setItems(reordered);
    await Promise.all(reordered.map((it) => supabase.from("portfolio_items").update({ display_order: it.display_order }).eq("id", it.id)));
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Portfolio Management</h2>

      <div className="flex flex-wrap gap-3 mb-6 items-end p-4 rounded-lg border border-border bg-card">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Default Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Images className="w-4 h-4" /> {uploading ? `Uploading ${bulkProgress?.done}/${bulkProgress?.total}...` : "Bulk Upload Images"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleBulkUpload} disabled={uploading} />
        </label>
        <p className="text-xs text-muted-foreground">Tip: drag the handle on each card to reorder.</p>
      </div>

      <SortableGrid
        items={items}
        onReorder={handleReorder}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        renderItem={(item, handle) => (
          <div className="group relative rounded-lg overflow-hidden border border-border bg-card">
            <div className="absolute top-2 left-2 z-10 bg-card/90 backdrop-blur rounded">{handle}</div>
            <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing(item)}><Edit className="w-3.5 h-3.5" /></Button>
              <Button size="sm" variant="destructive" onClick={() => deleteItem(item)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
            <div className="p-2 text-xs text-muted-foreground truncate">{item.category} — {item.title}</div>
          </div>
        )}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Portfolio Item</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <img src={editing.image_url} alt="" className="w-full aspect-video object-cover rounded-lg" />
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
