import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Heart, CheckCircle2 } from "lucide-react";

export default function Feedback() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!token) { setValid(false); return; }
    (async () => {
      const { data, error } = await supabase.rpc("get_booking_by_token", { _token: token });
      const b = Array.isArray(data) ? data[0] : data;
      if (error || !b) { setValid(false); return; }
      setValid(true);
      setName(b.name);
    })();
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast({ title: "Please pick a rating ✨", variant: "destructive" }); return; }
    setSubmitting(true);
    const { error } = await supabase.rpc("submit_feedback", { _token: token!, _rating: rating, _comment: comment });
    setSubmitting(false);
    if (error) { toast({ title: "Failed to submit", description: error.message, variant: "destructive" }); return; }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-xl">
          {valid === false ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Invalid feedback link</h1>
              <p className="text-muted-foreground mb-6">This link is invalid or expired.</p>
              <Link to="/"><Button variant="outline">Back to home</Button></Link>
            </div>
          ) : submitted ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Thank you {name}! 💖</h1>
              <p className="text-muted-foreground">Your review will be published once approved. We so appreciate it.</p>
              <Link to="/"><Button>Back to home</Button></Link>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">How was your experience{name ? `, ${name}` : ""}?</h1>
                <p className="text-muted-foreground text-sm mt-2">Your feedback helps us — and helps future brides find us 💕</p>
              </div>

              <form onSubmit={submit} className="space-y-6">
                <div className="text-center">
                  <label className="text-sm font-medium text-foreground block mb-3">Tap a star</label>
                  <div className="flex justify-center gap-1.5" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            n <= (hover || rating) ? "fill-primary text-primary" : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Tell us more (optional)</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love? Anything we could improve?"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting || valid === null}>
                  {submitting ? "Sending..." : "Submit Review"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
