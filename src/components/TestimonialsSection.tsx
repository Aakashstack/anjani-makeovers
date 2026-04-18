import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = { id: string; customer_name: string; rating: number; comment: string; service: string | null };

const fallback: Testimonial[] = [
  { id: "f1", customer_name: "Priya Sharma", rating: 5, service: "Bridal Makeup", comment: "Anjani made me feel like an absolute queen on my wedding day! The makeup was flawless." },
  { id: "f2", customer_name: "Neha Gupta", rating: 5, service: "Engagement", comment: "Perfectly understood my vision. Subtle yet glamorous. Highly recommended!" },
];

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(fallback);
  const [current, setCurrent] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id,customer_name,rating,comment,service")
        .eq("approved", true)
        .order("display_order")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setItems(data as Testimonial[]);
    })();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const t = items[current];
  if (!t) return null;

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Testimonials</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Client <span className="text-primary italic">Love</span>
          </h2>
        </div>

        <div className={`max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="relative bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-lg">
            <Quote size={48} className="text-primary/10 absolute top-6 left-6" />

            <div className="text-center relative z-10">
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 font-serif italic">
                "{t.comment}"
              </p>

              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink to-primary/20 mx-auto mb-3 flex items-center justify-center">
                  <span className="font-serif text-xl font-bold text-primary">{t.customer_name[0]}</span>
                </div>
                <p className="font-semibold text-foreground">{t.customer_name}</p>
                {t.service && <p className="text-sm text-muted-foreground">{t.service}</p>}
              </div>
            </div>

            {items.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrent((p) => (p - 1 + items.length) % items.length)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                >
                  <ChevronLeft size={18} className="text-muted-foreground" />
                </button>
                <div className="flex gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i === current ? "bg-primary w-6" : "bg-border hover:bg-primary/40"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrent((p) => (p + 1) % items.length)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
                >
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
