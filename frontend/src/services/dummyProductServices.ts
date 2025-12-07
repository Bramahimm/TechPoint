import Produk1 from "@/assets/images/product1.webp";
import Produk2 from "@/assets/images/product2.webp";
import Produk3 from "@/assets/images/product3.webp";
import Produk4 from "@/assets/images/product4.webp";
import Produk5 from "@/assets/images/product5.webp";
import Produk6 from "@/assets/images/product6.webp";
import api from "./api";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
}


export const getFeaturedProducts = async (): Promise<Product[]> => {
  return [
    {
      id: 1,
      name: "Iphone 17 Pro Max",
      price: 1200000,
      imageUrl: Produk1,
      rating: 4.7,
    },
    {
      id: 2,
      name: "Casan Type-C",
      price: 185000,
      imageUrl: Produk2,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Samsung 20 Ultra",
      price: 210000,
      imageUrl: Produk3,
      rating: 4.6,
    },
    {
      id: 4,
      name: "Laptop Asus Loq",
      price: 160000,
      imageUrl: Produk4,
      rating: 4.8,
    },
    {
      id: 5,
      name: "Sweater Rajut Dingin",
      price: 160000,
      imageUrl: Produk5,
      rating: 4.3,
    },
    {
      id: 6,
      name: "Sweater Rajut Dingin",
      price: 160000,
      imageUrl: Produk6,
      rating: 4.3,
    },
  ];
};
