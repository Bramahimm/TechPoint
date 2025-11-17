import HeroSection from "@/components/shop/HeroSection";
import ProductShowcase from "@/features/shop/ProductShowcase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      <Footer/>
    </>
  );
}
