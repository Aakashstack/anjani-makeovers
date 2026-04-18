import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Instagram, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  link: string;
  embed_url: string | null;
  image_url: string | null;
  caption: string;
};

export default function InstagramFeed() {
  const { ref, isVisible } = useScrollAnimation();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("instagram_posts")
        .select("id,link,embed_url,image_url,caption")
        .order("display_order")
        .limit(6);
      if (data) setPosts(data as Post[]);
    })();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
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

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No posts yet — check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`rounded-2xl overflow-hidden bg-card border border-border shadow-sm transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {post.embed_url ? (
                  <iframe
                    src={post.embed_url}
                    className="w-full aspect-square border-0"
                    loading="lazy"
                    allowTransparency
                    allow="encrypted-media"
                  />
                ) : post.image_url ? (
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={post.image_url} alt={post.caption} className="w-full aspect-square object-cover" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className={`text-center mt-10 transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
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
