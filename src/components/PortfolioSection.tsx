import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Lightbox from "./Lightbox";
import { Eye } from "lucide-react";

const categories = ["All", "Bridal", "Party", "HD", "Engagement"];

const portfolioItems = [
  { id: 1, category: "Bridal", gradient: "from-pink to-nude" },
  { id: 2, category: "Party", gradient: "from-primary/20 to-accent" },
  { id: 3, category: "HD", gradient: "from-gold-light/30 to-pink" },
  { id: 4, category: "Engagement", gradient: "from-accent to-secondary" },
  { id: 5, category: "Bridal", gradient: "from-nude to-pink-dark" },
  { id: 6, category: "Party", gradient: "from-pink-dark to-primary/20" },
  { id: 7, category: "HD", gradient: "from-secondary to-nude" },
  { id: 8, category: "Engagement", gradient: "from-primary/10 to-pink" },
];

export default function PortfolioSection() {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const filtered = filter === "All" ? portfolioItems : portfolioItems.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">My Work</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Portfolio <span className="text-primary italic">Gallery</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
              onClick={() => setLightboxIndex(i)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-lg text-foreground/30 italic">{item.category}</span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-75">
                  <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                    <Eye size={20} className="text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
