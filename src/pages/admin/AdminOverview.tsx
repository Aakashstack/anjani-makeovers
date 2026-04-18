import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { CalendarCheck, Image, Star, MessageSquare, ArrowRight, TrendingUp } from "lucide-react";

interface Stats {
  totalBookings: number;
  newBookings: number;
  pendingBookings: number;
  completedBookings: number;
  portfolioCount: number;
  testimonialsCount: number;
  pendingTestimonials: number;
}

interface RecentBooking {
  id: string;
  name: string;
  service: string;
  status: string;
  created_at: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);

  useEffect(() => {
    (async () => {
      const [bookingsRes, portfolioRes, testimonialsRes, recentRes] = await Promise.all([
        supabase.from("bookings").select("status"),
        supabase.from("portfolio_items").select("id"),
        supabase.from("testimonials").select("approved"),
        supabase.from("bookings").select("id,name,service,status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      const b = bookingsRes.data || [];
      const t = testimonialsRes.data || [];
      setStats({
        totalBookings: b.length,
        newBookings: b.filter((x: any) => x.status === "new" || x.status === "pending").length,
        pendingBookings: b.filter((x: any) => x.status === "confirmed").length,
        completedBookings: b.filter((x: any) => x.status === "completed").length,
        portfolioCount: (portfolioRes.data || []).length,
        testimonialsCount: t.length,
        pendingTestimonials: t.filter((x: any) => !x.approved).length,
      });
      setRecent((recentRes.data as RecentBooking[]) || []);
    })();
  }, []);

  if (!stats) return <div className="text-muted-foreground">Loading dashboard…</div>;

  const cards = [
    { label: "New Requests", value: stats.newBookings, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", link: "/admin/bookings" },
    { label: "Confirmed", value: stats.pendingBookings, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10", link: "/admin/bookings" },
    { label: "Portfolio Items", value: stats.portfolioCount, icon: Image, color: "text-amber-600", bg: "bg-amber-500/10", link: "/admin/portfolio" },
    { label: "Pending Reviews", value: stats.pendingTestimonials, icon: Star, color: "text-rose-600", bg: "bg-rose-500/10", link: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.link} className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all">
            <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.color} flex items-center justify-center mb-4`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-serif font-bold text-foreground">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              {c.label}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.service}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground capitalize">{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
