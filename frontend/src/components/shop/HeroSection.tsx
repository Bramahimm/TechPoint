import { useEffect, useState } from "react";
import type { Banner } from "@/services/bannerService";
import { getBanners } from "@/services/bannerService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBanners().then(setBanners);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="px-6 flex overflow-x-auto snap-x snap-mandatory md:px-40">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            className="snap-center flex-shrink-0 max-w-['1000px'] relative cursor-pointer"
            onClick={() => navigate(banner.link)}>
            <img
              src={banner.imageUrl}
              className="object-cover"
              width={680}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
