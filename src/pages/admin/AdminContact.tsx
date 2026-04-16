import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

type ContactItem = { id: string; key: string; value: string; icon: string; link: string | null };

const defaultContacts = [
  { key: "phone", value: "+91 98765 43210", icon: "phone", link: "tel:+919876543210" },
  { key: "email", value: "info@anjanimakeovers.com", icon: "mail", link: "mailto:info@anjanimakeovers.com" },
  { key: "instagram", value: "@anjanimakeovers", icon: "instagram", link: "https://instagram.com/anjanimakeovers" },
  { key: "location", value: "Mumbai, Maharashtra, India", icon: "map-pin", link: "https://maps.google.com" },
];

export default function AdminContact() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchContacts = async () => {
    const { data } = await supabase.from("contact_info").select("*");
    if (data && data.length > 0) {
      setContacts(data);
    } else {
      // Seed defaults
      for (const c of defaultContacts) {
        await supabase.from("contact_info").insert(c);
      }
      const { data: seeded } = await supabase.from("contact_info").select("*");
      if (seeded) setContacts(seeded);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateField = (id: string, field: keyof ContactItem, value: string) => {
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const c of contacts) {
      await supabase.from("contact_info").update({ value: c.value, link: c.link }).eq("id", c.id);
    }
    setSaving(false);
    toast({ title: "Contact info saved!" });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Contact Information</h2>
      <div className="space-y-4 max-w-lg">
        {contacts.map((c) => (
          <div key={c.id} className="p-4 rounded-lg border border-border space-y-2">
            <label className="text-sm font-medium text-foreground capitalize">{c.key}</label>
            <Input value={c.value} onChange={(e) => updateField(c.id, "value", e.target.value)} placeholder="Value" />
            <Input value={c.link || ""} onChange={(e) => updateField(c.id, "link", e.target.value)} placeholder="Link (optional)" />
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>
    </div>
  );
}
