import Navbar from "@/components/Navbar";
import PortfolioSection from "@/components/PortfolioSection";
import BeforeAfter from "@/components/BeforeAfter";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Portfolio() {
  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      <PortfolioSection />
      <BeforeAfter />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
