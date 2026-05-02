import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Crown, PartyPopper, Heart, Camera, ArrowRight, Clock, IndianRupee, Sparkles, Star, Flower, Gem, Brush, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = { Crown, PartyPopper, Heart, Camera, Sparkles, Star, Flower, Gem, Brush };

type Service = { id: string; icon: string; title: string; description: string; price: string; duration: string };

export default function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("services").select("id,icon,title,description,price,duration").order("display_order");
      if (data) setServices(data as Service[]);
    })();
  }, []);

  return (
    <section id="services" className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span
            className={`text-primary font-medium tracking-widest uppercase text-sm transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            What I Offer
          </span>
          <h2
            className={`font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            My <span className="text-primary italic">Services</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Sparkles;
            return (
              <div
                key={s.id}
                className={`group relative bg-card rounded-2xl border border-border/50 p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
              >
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon size={24} className="text-primary" />
                </div>

                <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.description}</p>

                <div className="space-y-2 mb-5">
                  {s.price && (
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee size={14} className="text-primary" />
                      <span className="text-foreground font-medium">{s.price}</span>
                    </div>
                  )}
                  {s.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-primary" />
                      <span className="text-muted-foreground">{s.duration}</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/book"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                  Book Now <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
