import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, Image, Instagram, Phone, LogOut, FileText, Star, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
  { label: "Portfolio", path: "/admin/portfolio", icon: Image },
  { label: "Before & After", path: "/admin/before-after", icon: Layers },
  { label: "Instagram", path: "/admin/instagram", icon: Instagram },
  { label: "Reviews", path: "/admin/testimonials", icon: Star },
  { label: "Homepage Content", path: "/admin/content", icon: FileText },
  { label: "Contact Info", path: "/admin/contact", icon: Phone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="px-2 py-3">
          {collapsed ? (
            <div className="font-serif text-lg font-bold text-sidebar-foreground text-center">A</div>
          ) : (
            <h1 className="font-serif text-base font-bold text-sidebar-foreground">
              Anjani <span className="text-primary">Admin</span>
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Manage</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path, item.end)}
                    tooltip={item.label}
                  >
                    <NavLink to={item.path} end={item.end}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
        {!collapsed && (
          <NavLink to="/" className="block text-xs text-center text-muted-foreground hover:text-primary py-1">
            ← Back to website
          </NavLink>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
