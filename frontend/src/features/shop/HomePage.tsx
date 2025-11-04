import HeroSection from "@/components/shop/HeroSection";
import ProductShowcase from "./ProductShowcase";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProductShowcase />
    </>
  );
}
