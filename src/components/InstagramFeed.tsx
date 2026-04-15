import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";

const instaPosts = [
  { id: 1, gradient: "from-pink-300 via-rose-300 to-amber-200", likes: 234, comments: 18, caption: "Bridal Glow ✨" },
  { id: 2, gradient: "from-amber-200 via-orange-200 to-rose-300", likes: 189, comments: 12, caption: "Engagement Ready 💍" },
  { id: 3, gradient: "from-rose-200 via-pink-200 to-purple-200", likes: 312, comments: 24, caption: "Party Vibes 🎉" },
  { id: 4, gradient: "from-purple-200 via-pink-300 to-rose-200", likes: 276, comments: 20, caption: "Soft Glam Look 🌸" },
  { id: 5, gradient: "from-amber-100 via-rose-200 to-pink-300", likes: 198, comments: 15, caption: "HD Makeup Magic 💄" },
  { id: 6, gradient: "from-rose-300 via-amber-200 to-orange-200", likes: 421, comments: 32, caption: "Wedding Season 💒" },
];

export default function InstagramFeed() {
  const { ref, isVisible } = useScrollAnimation();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center">
              <Instagram size={20} className="text-white" />
            </div>
            <span className="text-primary font-medium tracking-widest uppercase text-sm">@anjanimakeovers</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Follow the <span className="text-primary italic">Glam</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Peek behind the scenes and see our latest transformations on Instagram
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {instaPosts.map((post, index) => (
            <a
              key={post.id}
              href="https://instagram.com/anjanimakeovers"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Gradient placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`} />

              {/* Hover overlay */}
              <div
                className={`absolute inset-0 bg-foreground/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  hoveredId === post.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center gap-5 text-background">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <Heart size={18} className="fill-current" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <MessageCircle size={18} className="fill-current" /> {post.comments}
                  </span>
                </div>
                <p className="text-background/90 text-sm font-medium">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-10 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="https://instagram.com/anjanimakeovers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300"
          >
            <Instagram size={18} />
            Follow on Instagram
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
