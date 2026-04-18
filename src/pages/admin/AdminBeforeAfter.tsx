import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, Edit } from "lucide-react";
import { SortableGrid } from "@/components/admin/SortableGrid";

type BAItem = { id: string; title: string; before_image_url: string; after_image_url: string; display_order: number };

export default function AdminBeforeAfter() {
  const [items, setItems] = useState<BAItem[]>([]);
  const [title, setTitle] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<BAItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBefore, setEditBefore] = useState<File | null>(null);
  const [editAfter, setEditAfter] = useState<File | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("before_after_items").select("*").order("display_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadFile = async (file: File) => {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    await supabase.storage.from("before-after-images").upload(path, file);
    return supabase.storage.from("before-after-images").getPublicUrl(path).data.publicUrl;
  };

  const handleAdd = async () => {
    if (!beforeFile || !afterFile) { toast({ title: "Please select both images", variant: "destructive" }); return; }
    setUploading(true);
    const beforeUrl = await uploadFile(beforeFile);
    const afterUrl = await uploadFile(afterFile);
    await supabase.from("before_after_items").insert({ title, before_image_url: beforeUrl, after_image_url: afterUrl, display_order: items.length });
    setTitle(""); setBeforeFile(null); setAfterFile(null);
    fetchItems();
    setUploading(false);
    toast({ title: "Before/After added!" });
  };

  const deleteItem = async (item: BAItem) => {
    if (!confirm("Delete this pair?")) return;
    const bName = item.before_image_url.split("/").pop();
    const aName = item.after_image_url.split("/").pop();
    if (bName) await supabase.storage.from("before-after-images").remove([bName]);
    if (aName) await supabase.storage.from("before-after-images").remove([aName]);
    await supabase.from("before_after_items").delete().eq("id", item.id);
    fetchItems();
    toast({ title: "Deleted" });
  };

  const openEdit = (item: BAItem) => {
    setEditing(item);
    setEditTitle(item.title);
    setEditBefore(null);
    setEditAfter(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setUploading(true);
    const updates: any = { title: editTitle };
    if (editBefore) updates.before_image_url = await uploadFile(editBefore);
    if (editAfter) updates.after_image_url = await uploadFile(editAfter);
    await supabase.from("before_after_items").update(updates).eq("id", editing.id);
    setEditing(null);
    setUploading(false);
    fetchItems();
    toast({ title: "Updated" });
  };

  const handleReorder = async (reordered: BAItem[]) => {
    setItems(reordered);
    await Promise.all(reordered.map((it) => supabase.from("before_after_items").update({ display_order: it.display_order }).eq("id", it.id)));
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Before & After Management</h2>

      <div className="flex flex-wrap gap-4 mb-8 items-end p-4 rounded-lg border border-border bg-card">
        <div>
          <label className="text-sm text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wedding Look" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Before</label>
          <Input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">After</label>
          <Input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files?.[0] || null)} />
        </div>
        <Button onClick={handleAdd} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Add Pair"}
        </Button>
      </div>

      <SortableGrid
        items={items}
        onReorder={handleReorder}
        className="space-y-3"
        renderItem={(item, handle) => (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            {handle}
            <img src={item.before_image_url} alt="Before" className="w-20 h-20 object-cover rounded" />
            <span className="text-muted-foreground text-xs">→</span>
            <img src={item.after_image_url} alt="After" className="w-20 h-20 object-cover rounded" />
            <span className="flex-1 text-sm font-medium text-foreground">{item.title || "Untitled"}</span>
            <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Edit className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => deleteItem(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        )}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Before/After</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Current Before</label>
                  <img src={editing.before_image_url} className="w-full aspect-square object-cover rounded mb-2" />
                  <Input type="file" accept="image/*" onChange={(e) => setEditBefore(e.target.files?.[0] || null)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Current After</label>
                  <img src={editing.after_image_url} className="w-full aspect-square object-cover rounded mb-2" />
                  <Input type="file" accept="image/*" onChange={(e) => setEditAfter(e.target.files?.[0] || null)} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={uploading}>{uploading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
