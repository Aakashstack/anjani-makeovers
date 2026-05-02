import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Star, Trash2, Check, X, Plus } from "lucide-react";

type Testimonial = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  service: string | null;
  approved: boolean;
  created_at: string;
};

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ customer_name: "", rating: 5, comment: "", service: "", approved: true });
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as Testimonial[]);
  };

  useEffect(() => { fetch(); }, []);

  const setApproved = async (id: string, approved: boolean) => {
    await supabase.from("testimonials").update({ approved }).eq("id", id);
    fetch();
    toast({ title: approved ? "Approved & published" : "Hidden" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    fetch();
    toast({ title: "Deleted" });
  };

  const createOwn = async () => {
    if (!form.customer_name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const { error } = await supabase.from("testimonials").insert({
      customer_name: form.customer_name.trim(),
      rating: form.rating,
      comment: form.comment.trim(),
      service: form.service.trim() || null,
      approved: form.approved,
    });
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Testimonial added" });
    setCreating(false);
    setForm({ customer_name: "", rating: 5, comment: "", service: "", approved: true });
    fetch();
  };

  const filtered = items.filter((t) =>
    filter === "all" ? true : filter === "approved" ? t.approved : !t.approved
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-serif font-bold text-foreground">Customer Reviews</h2>
        <Button onClick={() => setCreating(true)}><Plus className="w-4 h-4 mr-1" /> Add Testimonial</Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Customers submit reviews via the feedback link after their booking is completed. Approve them to publish on the homepage.
        You can also write your own (e.g. for older clients) using "Add Testimonial".
      </p>

      <div className="flex gap-2 mb-6">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"
            }`}
          >
            {f} ({items.filter((t) => f === "all" ? true : f === "approved" ? t.approved : !t.approved).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No reviews here.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-medium text-foreground">{t.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{t.service || "—"} · {new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.approved ? <Badge variant="secondary">Published</Badge> : <Badge>Pending</Badge>}
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-foreground/80 italic mb-4">"{t.comment || "(no comment)"}"</p>
              <div className="flex gap-2">
                {!t.approved ? (
                  <Button size="sm" onClick={() => setApproved(t.id, true)}>
                    <Check className="w-4 h-4 mr-1" /> Approve & Publish
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setApproved(t.id, false)}>
                    <X className="w-4 h-4 mr-1" /> Unpublish
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => remove(t.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1">Customer name</label>
              <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Service (optional)</label>
              <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="e.g. Bridal Makeup" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                    <Star className={`w-6 h-6 ${n <= form.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Comment</label>
              <Textarea rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} />
              Publish immediately
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={createOwn}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
