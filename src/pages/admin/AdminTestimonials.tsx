import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trash2, Check, X } from "lucide-react";

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

  const filtered = items.filter((t) =>
    filter === "all" ? true : filter === "approved" ? t.approved : !t.approved
  );

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-2 text-foreground">Customer Reviews</h2>
      <p className="text-sm text-muted-foreground mb-6">Approve reviews to publish them on the homepage testimonials section.</p>

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
                  {t.approved ? (
                    <Badge variant="secondary">Published</Badge>
                  ) : (
                    <Badge>Pending</Badge>
                  )}
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
    </div>
  );
}
