import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

type InstaPost = { id: string; image_url: string; caption: string; likes: number; comments: number; link: string; display_order: number };

export default function AdminInstagram() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [caption, setCaption] = useState("");
  const [likes, setLikes] = useState("0");
  const [comments, setComments] = useState("0");
  const [link, setLink] = useState("https://instagram.com/anjanimakeovers");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data } = await supabase.from("instagram_posts").select("*").order("display_order");
    if (data) setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    await supabase.storage.from("instagram-images").upload(path, file);
    const { data: urlData } = supabase.storage.from("instagram-images").getPublicUrl(path);
    await supabase.from("instagram_posts").insert({
      image_url: urlData.publicUrl, caption, likes: parseInt(likes) || 0,
      comments: parseInt(comments) || 0, link, display_order: posts.length,
    });
    setCaption(""); setLikes("0"); setComments("0");
    fetchPosts();
    setUploading(false);
    toast({ title: "Post added!" });
  };

  const deletePost = async (post: InstaPost) => {
    const fileName = post.image_url.split("/").pop();
    if (fileName) await supabase.storage.from("instagram-images").remove([fileName]);
    await supabase.from("instagram_posts").delete().eq("id", post.id);
    fetchPosts();
    toast({ title: "Deleted" });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Instagram Feed Management</h2>

      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div><label className="text-sm text-muted-foreground">Caption</label><Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" /></div>
        <div><label className="text-sm text-muted-foreground">Likes</label><Input type="number" value={likes} onChange={(e) => setLikes(e.target.value)} /></div>
        <div><label className="text-sm text-muted-foreground">Comments</label><Input type="number" value={comments} onChange={(e) => setComments(e.target.value)} /></div>
        <div><label className="text-sm text-muted-foreground">Link</label><Input value={link} onChange={(e) => setLink(e.target.value)} /></div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Post"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="group relative rounded-lg overflow-hidden border border-border">
            <img src={post.image_url} alt={post.caption} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="destructive" onClick={() => deletePost(post)}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
            </div>
            <div className="p-2 text-xs text-muted-foreground">{post.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
