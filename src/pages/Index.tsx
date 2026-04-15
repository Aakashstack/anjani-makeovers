import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import BeforeAfter from "@/components/BeforeAfter";
import StatsCounter from "@/components/StatsCounter";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstagramFeed from "@/components/InstagramFeed";
import BookingSection from "@/components/BookingSection";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BrandsCarousel />
      <AboutSection />
      <StatsCounter />
      <ServicesSection />
      <PortfolioSection />
      <BeforeAfter />
      <TestimonialsSection />
      <InstagramFeed />
      <BookingSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
