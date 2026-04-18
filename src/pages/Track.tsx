import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarCheck, Clock, MessageCircle, Star, Phone, ArrowRight, Search } from "lucide-react";

type Booking = {
  id: string;
  name: string;
  service: string;
  date: string | null;
  status: string;
  admin_notes: string | null;
  alternative_slots: string[] | null;
  created_at: string;
  tracking_token?: string;
};

const statusInfo: Record<string, { label: string; color: string; description: string }> = {
  new: { label: "Received", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", description: "We've got your request and will confirm shortly." },
  pending: { label: "Pending Confirmation", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", description: "Awaiting confirmation from Anjani." },
  confirmed: { label: "Confirmed ✨", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", description: "Your slot is locked in! We can't wait to see you." },
  rescheduled: { label: "Reschedule Suggested", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", description: "We've suggested alternative slots — please pick one and message us on WhatsApp." },
  completed: { label: "Completed 💖", color: "bg-purple-500/10 text-purple-600 border-purple-500/20", description: "Hope you loved your look! We'd love your feedback." },
  cancelled: { label: "Cancelled", color: "bg-rose-500/10 text-rose-600 border-rose-500/20", description: "This booking was cancelled." },
};

export default function Track() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_booking_by_token", { _token: token });
      if (error || !data || (Array.isArray(data) && data.length === 0)) {
        toast({ title: "Booking not found", description: "Check your link or use phone + code lookup below.", variant: "destructive" });
        setBooking(null);
      } else {
        setBooking((Array.isArray(data) ? data[0] : data) as Booking);
      }
      setLoading(false);
    })();
  }, [token, toast]);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    const { data, error } = await supabase.rpc("lookup_booking", { _phone: phone.trim(), _code: code.trim().toLowerCase() });
    setSearching(false);
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      toast({ title: "No booking found", description: "Double-check your phone number and 6-character code.", variant: "destructive" });
      return;
    }
    const b = Array.isArray(data) ? data[0] : data;
    navigate(`/track/${b.tracking_token}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <span className="text-primary font-medium tracking-widest uppercase text-sm">Booking Status</span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold mt-2 text-foreground">Track Your <span className="text-primary italic">Appointment</span></h1>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-12">Loading…</div>
          ) : booking ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm text-muted-foreground">Hi {booking.name}!</p>
                  <h2 className="font-serif text-xl font-bold text-foreground mt-1">{booking.service}</h2>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusInfo[booking.status]?.color || "bg-secondary"}`}>
                  {statusInfo[booking.status]?.label || booking.status}
                </span>
              </div>

              <p className="text-sm text-foreground/80">{statusInfo[booking.status]?.description}</p>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> Event date</div>
                  <div className="font-medium text-foreground">{booking.date || "To be confirmed"}</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Requested on</div>
                  <div className="font-medium text-foreground">{new Date(booking.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              {booking.alternative_slots && booking.alternative_slots.length > 0 && (
                <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">📅 Suggested alternative slots:</p>
                  <ul className="space-y-1.5">
                    {booking.alternative_slots.map((s, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {s}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">Reply to us on WhatsApp with your preferred slot.</p>
                </div>
              )}

              {booking.admin_notes && (
                <div className="rounded-lg bg-muted/50 border border-border p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">A note from Anjani:</p>
                  <p className="text-sm text-foreground/80">{booking.admin_notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                </a>
                {booking.status === "completed" && booking.tracking_token && (
                  <Link to={`/feedback/${booking.tracking_token}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <Star className="w-4 h-4" /> Leave feedback
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Find your booking</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your phone number and the 6-character code we sent you.</p>
              <form onSubmit={lookup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone number</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Booking code</label>
                  <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required placeholder="ABC123" maxLength={6} className="uppercase tracking-widest" />
                </div>
                <Button type="submit" disabled={searching} className="w-full">
                  <Search className="w-4 h-4 mr-2" /> {searching ? "Searching…" : "Find my booking"}
                  <ArrowRight className="w-4 h-4 ml-2" />
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
