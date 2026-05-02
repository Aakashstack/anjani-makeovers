import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

const fallback = ["MAC", "Lakmé", "Bobbi Brown", "Charlotte Tilbury", "Huda Beauty"];

export default function BrandsCarousel() {
  const { ref, isVisible } = useScrollAnimation();
  const [brands, setBrands] = useState<string[]>(fallback);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("brands").select("name").order("display_order");
      if (data && data.length > 0) setBrands(data.map((b: any) => b.name));
    })();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background border-y border-border/50" ref={ref}>
      <div
        className={`text-center mb-10 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-primary font-medium tracking-widest uppercase text-sm">Trusted Brands We Use</span>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          className={`flex animate-scroll-left transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{ width: "max-content" }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center justify-center px-8 md:px-12 py-4 shrink-0 group cursor-default">
              <span className="font-serif text-xl md:text-2xl font-semibold text-muted-foreground/40 group-hover:text-primary transition-colors duration-500 whitespace-nowrap tracking-wide">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
