import Navbar from "@/components/Navbar";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Booking() {
  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      <BookingSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
