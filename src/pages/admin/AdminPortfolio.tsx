import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

type PortfolioItem = { id: string; title: string; category: string; image_url: string; display_order: number };

const categories = ["Bridal", "Party", "Engagement", "Photoshoot", "Other"];

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Bridal");
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("portfolio_items").select("*").order("display_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("portfolio-images").upload(path, file);
    if (uploadError) { toast({ title: "Upload failed", variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(path);
    await supabase.from("portfolio_items").insert({ title, category, image_url: urlData.publicUrl, display_order: items.length });
    setTitle("");
    fetchItems();
    setUploading(false);
    toast({ title: "Image added!" });
  };

  const deleteItem = async (item: PortfolioItem) => {
    const fileName = item.image_url.split("/").pop();
    if (fileName) await supabase.storage.from("portfolio-images").remove([fileName]);
    await supabase.from("portfolio_items").delete().eq("id", item.id);
    fetchItems();
    toast({ title: "Deleted" });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Portfolio Management</h2>

      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div>
          <label className="text-sm text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bridal Look" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative rounded-lg overflow-hidden border border-border">
            <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="destructive" onClick={() => deleteItem(item)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
            <div className="p-2 text-xs text-muted-foreground">{item.category} — {item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
