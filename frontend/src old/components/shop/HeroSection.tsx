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
    <section className="relative flex justify-center w-full overflow-hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 md:px-40 scrollbar-hide">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            className="snap-center flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] max-w-[1000px] relative cursor-pointer"
            onClick={() => navigate(banner.link)}>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
              <img
                src={banner.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
              {/* Optional overlay content */}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
