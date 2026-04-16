import { useAdmin } from "@/hooks/useAdmin";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, CalendarCheck, Image, Instagram, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Bookings", path: "/admin", icon: CalendarCheck },
  { label: "Portfolio", path: "/admin/portfolio", icon: Image },
  { label: "Before & After", path: "/admin/before-after", icon: LayoutDashboard },
  { label: "Instagram", path: "/admin/instagram", icon: Instagram },
  { label: "Contact", path: "/admin/contact", icon: Phone },
];

export default function AdminDashboard() {
  const { loading } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif text-lg font-bold text-foreground">Anjani <span className="text-primary">Admin</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
          <Link to="/" className="block mt-2 text-xs text-center text-muted-foreground hover:text-primary">← Back to website</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
