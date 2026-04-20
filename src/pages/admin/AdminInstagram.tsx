import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit, Instagram } from "lucide-react";
import { SortableGrid } from "@/components/admin/SortableGrid";

type InstaPost = {
  id: string;
  image_url: string | null;
  caption: string;
  likes: number;
  comments: number;
  link: string;
  embed_url: string | null;
  display_order: number;
};

export default function AdminInstagram() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [editing, setEditing] = useState<InstaPost | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data } = await supabase.from("instagram_posts").select("*").order("display_order");
    if (data) setPosts(data as InstaPost[]);
  };

  useEffect(() => { fetchPosts(); }, []);

  // Convert any IG URL → clean embed URL (strip query/hash, ensure /embed suffix)
  const toEmbed = (url: string) => {
    const cleaned = url.split("?")[0].split("#")[0].replace(/\/$/, "");
    return cleaned.endsWith("/embed") ? cleaned : `${cleaned}/embed`;
  };

  const isValidIgUrl = (url: string) => /instagram\.com\/(p|reel|tv)\//.test(url);

  const handleAdd = async () => {
    if (!isValidIgUrl(link)) {
      toast({ title: "Invalid Instagram URL", description: "Paste a post or reel link from Instagram.", variant: "destructive" });
      return;
    }
    await supabase.from("instagram_posts").insert({
      link,
      embed_url: toEmbed(link),
      caption,
      display_order: posts.length,
    });
    setLink(""); setCaption("");
    fetchPosts();
    toast({ title: "Post added!" });
  };

  const deletePost = async (post: InstaPost) => {
    if (!confirm("Delete this post?")) return;
    if (post.image_url) {
      const fileName = post.image_url.split("/").pop();
      if (fileName) await supabase.storage.from("instagram-images").remove([fileName]);
    }
    await supabase.from("instagram_posts").delete().eq("id", post.id);
    fetchPosts();
    toast({ title: "Deleted" });
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (editing.link && !isValidIgUrl(editing.link)) {
      toast({ title: "Invalid Instagram URL", variant: "destructive" });
      return;
    }
    await supabase.from("instagram_posts").update({
      caption: editing.caption,
      link: editing.link,
      embed_url: editing.link ? toEmbed(editing.link) : null,
    }).eq("id", editing.id);
    setEditing(null);
    fetchPosts();
    toast({ title: "Updated" });
  };

  const handleReorder = async (reordered: InstaPost[]) => {
    setPosts(reordered);
    await Promise.all(reordered.map((it) => supabase.from("instagram_posts").update({ display_order: it.display_order }).eq("id", it.id)));
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-2 text-foreground">Instagram Feed</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Paste any Instagram post or reel URL — the embed will render automatically on your homepage.
      </p>

      <div className="flex flex-wrap gap-3 mb-8 items-end p-4 rounded-lg border border-border bg-card">
        <div className="flex-1 min-w-[280px]">
          <label className="text-sm text-muted-foreground block mb-1">Instagram URL</label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.instagram.com/p/XXXXX/ or /reel/XXXXX/"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-muted-foreground block mb-1">Caption (optional)</label>
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Bridal Glow ✨" />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Post
        </Button>
      </div>

      <SortableGrid
        items={posts}
        onReorder={handleReorder}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        renderItem={(post, handle) => (
          <div className="rounded-lg overflow-hidden border border-border bg-card">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
              {handle}
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                <Instagram className="w-3 h-3" /> View
              </a>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(post)}><Edit className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deletePost(post)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            </div>
            {post.embed_url ? (
              <iframe
                src={post.embed_url}
                className="w-full aspect-square border-0"
                loading="lazy"
                allowTransparency
              />
            ) : post.image_url ? (
              <img src={post.image_url} alt={post.caption} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-muted flex items-center justify-center text-xs text-muted-foreground">No preview</div>
            )}
            {post.caption && <div className="p-2 text-xs text-muted-foreground truncate">{post.caption}</div>}
          </div>
        )}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Instagram Post</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Instagram URL</label>
                <Input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Caption</label>
                <Input value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
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
