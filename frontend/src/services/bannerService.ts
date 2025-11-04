import Banner1 from "@/assets/images/bannerHero.webp";
import Banner2 from "@/assets/images/bannerHero2.webp";
// src/services/bannerService.ts
export interface Banner {
  id: number;
  imageUrl: string;
  link: string;
}

export const getBanners = async (): Promise<Banner[]> => {
  // Mock data sementara (nanti bisa diganti API)
  return [
    {
      id: 1,
      imageUrl: Banner1,
      link: "/shop",
    },
    {
      id: 2,
      imageUrl: Banner2,
      link: "/shop",
    },
  ];
};
