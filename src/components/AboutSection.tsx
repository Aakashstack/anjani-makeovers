import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Award, Heart, Star, Users, Sparkles, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = { Award, Heart, Star, Users, Sparkles };

const defaultAbout = {
  label: "About Me",
  title: "Meet Anjani",
  paragraph_1: "With over 5 years of professional experience, I specialize in creating flawless, stunning looks that enhance your natural beauty. From dreamy bridal looks to glamorous party makeovers, every brushstroke is crafted with passion and precision.",
  paragraph_2: "Trained in HD, airbrush, and traditional techniques, I stay updated with the latest trends to offer you the most sophisticated and personalized makeup experience.",
  image_url: "",
};

const defaultHighlights = [
  { id: "1", label: "Certified Artist", icon: "Award" },
  { id: "2", label: "5+ Years Experience", icon: "Star" },
  { id: "3", label: "500+ Happy Clients", icon: "Users" },
  { id: "4", label: "Passion for Beauty", icon: "Heart" },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [about, setAbout] = useState(defaultAbout);
  const [highlights, setHighlights] = useState(defaultHighlights);

  useEffect(() => {
    (async () => {
      const [c, h] = await Promise.all([
        supabase.from("site_content").select("value").eq("key", "about").maybeSingle(),
        supabase.from("about_highlights").select("id,label,icon,display_order").order("display_order"),
      ]);
      if (c.data?.value) setAbout({ ...defaultAbout, ...(c.data.value as any) });
      if (h.data && h.data.length > 0) setHighlights(h.data as any);
    })();
  }, []);

  // Split title to italicize the last word
  const titleParts = about.title.split(" ");
  const titleHead = titleParts.slice(0, -1).join(" ");
  const titleTail = titleParts[titleParts.length - 1];

  return (
    <section id="about" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-pink via-accent to-nude overflow-hidden shadow-2xl">
                {about.image_url ? (
                  <img src={about.image_url} alt={about.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Heart size={48} className="text-primary/40" />
                      </div>
                      <p className="font-serif text-lg italic text-muted-foreground">Artist Photo</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/30 rounded-2xl -z-10" />
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">{about.label}</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-foreground">
              {titleHead && <>{titleHead} </>}<span className="text-primary italic">{titleTail}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{about.paragraph_1}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">{about.paragraph_2}</p>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h, i) => {
                const Icon = iconMap[h.icon] || Star;
                return (
                  <div
                    key={h.id}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50 transition-all duration-500 hover:shadow-md hover:-translate-y-1 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${0.5 + i * 0.15}s` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{h.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
