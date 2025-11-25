// src/components/layout/MainLayout.tsx
import React from "react";
// Asumsi Navbar dan Footer ada di path yang benar
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Komponen Layout utama yang membungkus konten halaman.
 * Digunakan untuk menyediakan struktur Navbar, Footer, dan wrapper dasar.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Struktur Layout Sederhana */}

      {/* Header/Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Konten Halaman */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
