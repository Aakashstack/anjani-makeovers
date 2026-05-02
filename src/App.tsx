import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Booking from "./pages/Booking.tsx";
import Track from "./pages/Track.tsx";
import Feedback from "./pages/Feedback.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminPortfolio from "./pages/admin/AdminPortfolio.tsx";
import AdminBeforeAfter from "./pages/admin/AdminBeforeAfter.tsx";
import AdminInstagram from "./pages/admin/AdminInstagram.tsx";
import AdminContact from "./pages/admin/AdminContact.tsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.tsx";
import AdminHero from "./pages/admin/AdminHero.tsx";
import AdminAbout from "./pages/admin/AdminAbout.tsx";
import AdminServicesPage from "./pages/admin/AdminServices.tsx";
import AdminBrands from "./pages/admin/AdminBrands.tsx";
import AdminStats from "./pages/admin/AdminStats.tsx";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings.tsx";

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
          <Route path="/track" element={<Track />} />
          <Route path="/track/:token" element={<Track />} />
          <Route path="/feedback/:token" element={<Feedback />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="before-after" element={<AdminBeforeAfter />} />
            <Route path="instagram" element={<AdminInstagram />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="settings" element={<AdminSiteSettings />} />
            <Route path="contact" element={<AdminContact />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
