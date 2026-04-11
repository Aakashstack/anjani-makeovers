import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Services() {
  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      <ServicesSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
