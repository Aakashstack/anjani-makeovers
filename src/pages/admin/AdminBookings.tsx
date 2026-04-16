import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

type Booking = {
  id: string; name: string; phone: string; email: string | null;
  date: string | null; service: string; message: string | null;
  status: string; created_at: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
    toast({ title: `Booking marked as ${status}` });
  };

  const deleteBooking = async (id: string) => {
    await supabase.from("bookings").delete().eq("id", id);
    fetchBookings();
    toast({ title: "Booking deleted" });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Booking Requests</h2>
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>{b.phone}</TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell>{b.date || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === "new" ? "default" : b.status === "confirmed" ? "secondary" : "outline"}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {b.status === "new" && <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "confirmed")}>Confirm</Button>}
                    {b.status === "confirmed" && <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "completed")}>Complete</Button>}
                    <Button size="sm" variant="ghost" onClick={() => deleteBooking(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
