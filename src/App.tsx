import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Booking from "./pages/Booking.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminPortfolio from "./pages/admin/AdminPortfolio.tsx";
import AdminBeforeAfter from "./pages/admin/AdminBeforeAfter.tsx";
import AdminInstagram from "./pages/admin/AdminInstagram.tsx";
import AdminContact from "./pages/admin/AdminContact.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminBookings />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="before-after" element={<AdminBeforeAfter />} />
            <Route path="instagram" element={<AdminInstagram />} />
            <Route path="contact" element={<AdminContact />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
