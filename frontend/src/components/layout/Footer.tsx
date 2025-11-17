import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram } from "lucide-react";


interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Footer () {
  const year = new Date().getFullYear();

  const footerLinks: FooterLink[] = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/produk" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Kontak", href: "/kontak" },
  ];

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook size={18} />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <Instagram size={18} />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: <Twitter size={18} />,
    },
  ];

  return (
    <footer className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo + Info */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-black">TechPoint</h2>
            <p className="text-black text-sm">
              Belanja elektronik lokal, hemat, dan terpercaya.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 text-black text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-blue-600 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-4 text-black">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                title={social.name}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-300 pt-4 text-center text-black text-sm">
          © {year} TechPoint. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
};
