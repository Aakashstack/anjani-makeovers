import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

type BAItem = { id: string; title: string; before_image_url: string; after_image_url: string; display_order: number };

export default function AdminBeforeAfter() {
  const [items, setItems] = useState<BAItem[]>([]);
  const [title, setTitle] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("before_after_items").select("*").order("display_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const uploadFile = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
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
    const bName = item.before_image_url.split("/").pop();
    const aName = item.after_image_url.split("/").pop();
    if (bName) await supabase.storage.from("before-after-images").remove([bName]);
    if (aName) await supabase.storage.from("before-after-images").remove([aName]);
    await supabase.from("before_after_items").delete().eq("id", item.id);
    fetchItems();
    toast({ title: "Deleted" });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Before & After Management</h2>

      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div>
          <label className="text-sm text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wedding Look" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Before Image</label>
          <Input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">After Image</label>
          <Input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files?.[0] || null)} />
        </div>
        <Button onClick={handleAdd} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Add Pair"}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
            <img src={item.before_image_url} alt="Before" className="w-24 h-24 object-cover rounded" />
            <span className="text-muted-foreground text-sm">→</span>
            <img src={item.after_image_url} alt="After" className="w-24 h-24 object-cover rounded" />
            <span className="flex-1 text-sm font-medium text-foreground">{item.title}</span>
            <Button size="sm" variant="ghost" onClick={() => deleteItem(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
