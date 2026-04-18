import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Copy, ExternalLink, Plus, X } from "lucide-react";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string | null;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
  tracking_token: string;
  admin_notes: string | null;
  alternative_slots: string[] | null;
};

const statusColors: Record<string, string> = {
  new: "default",
  pending: "default",
  confirmed: "secondary",
  rescheduled: "outline",
  completed: "secondary",
  cancelled: "destructive",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [altSlots, setAltSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data as Booking[]);
  };

  useEffect(() => { fetchBookings(); }, []);

  const openEdit = (b: Booking) => {
    setEditing(b);
    setAltSlots(b.alternative_slots || []);
    setNotes(b.admin_notes || "");
    setDate(b.date || "");
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
    toast({ title: `Marked as ${status}` });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await supabase.from("bookings").update({
      admin_notes: notes || null,
      alternative_slots: altSlots.length ? altSlots : null,
      date: date || null,
    }).eq("id", editing.id);
    setEditing(null);
    fetchBookings();
    toast({ title: "Booking updated" });
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    fetchBookings();
    toast({ title: "Booking deleted" });
  };

  const copyTrackingLink = (token: string) => {
    const url = `${window.location.origin}/track/${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Tracking link copied!", description: url });
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const statuses = ["all", "new", "confirmed", "rescheduled", "completed", "cancelled"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">Booking Requests</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"
            }`}
          >
            {s} {s !== "all" && `(${bookings.filter((b) => b.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No bookings.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm">{b.phone}</TableCell>
                  <TableCell className="text-sm">{b.service}</TableCell>
                  <TableCell className="text-sm">{b.date || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={(statusColors[b.status] as any) || "default"} className="capitalize">{b.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => copyTrackingLink(b.tracking_token)} title="Copy tracking link">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(b)} title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteBooking(b.id)} title="Delete">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Booking — {editing?.name}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Phone:</span> {editing.phone}</div>
                <div><span className="text-muted-foreground">Email:</span> {editing.email || "—"}</div>
                <div><span className="text-muted-foreground">Service:</span> {editing.service}</div>
                <div><span className="text-muted-foreground">Booking code:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{editing.tracking_token.slice(-6).toUpperCase()}</code></div>
              </div>
              {editing.message && (
                <div className="p-3 rounded-lg bg-muted text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Customer message:</div>
                  {editing.message}
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-1.5 block">Confirmed Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Alternative Slots (offer to customer)</label>
                <div className="flex gap-2 mb-2">
                  <Input placeholder="e.g. 2026-04-22 4pm" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} />
                  <Button type="button" size="sm" onClick={() => { if (newSlot) { setAltSlots([...altSlots, newSlot]); setNewSlot(""); } }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {altSlots.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs">
                      {s}
                      <button onClick={() => setAltSlots(altSlots.filter((_, idx) => idx !== i))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Admin Notes</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes…" rows={3} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => updateStatus(editing.id, "confirmed")}>Confirm</Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(editing.id, "rescheduled")}>Reschedule</Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(editing.id, "completed")}>Complete</Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(editing.id, "cancelled")}>Cancel Booking</Button>
                <a
                  href={`${window.location.origin}/track/${editing.tracking_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-border hover:bg-muted ml-auto"
                >
                  <ExternalLink className="w-3 h-3" /> Open tracking page
                </a>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Close</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
