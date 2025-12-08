// src/components/layout/Navbar.tsx

import { useEffect, useState, useRef } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import Logo from "@/assets/images/Logo_TechPoint.webp";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount] = useState();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    if (!history.includes(search.trim())) {
      setHistory((prev) => [search.trim(), ...prev].slice(0, 5));
    }
    setShowDropdown(false);
  };

  const handleSelect = (term: string) => {
    setSearch(term);
    setShowDropdown(false);
  };

  const handleRemove = (term: string) => {
    setHistory((prev) => prev.filter((item) => item !== term));
  };

  const isLoggedIn = user !== null;

  return (
    <nav className="bg-sky-300 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-48 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="TechPoint" className="h-20 w-auto" />
        </Link>

        {/* Search Form */}
        <div className="relative w-full max-w-md mx-6">
          <form onSubmit={handleSearch}>
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Cari produk, merek, atau kategori..."
              className="w-full border border-blue-500 rounded-full px-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition">
              Cari
            </button>
          </form>

          {showDropdown && history.length > 0 && (
            <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full z-10">
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <span className="text-gray-500 text-sm">Riwayat Pencarian</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-blue-500 hover:underline">
                  Hapus Semua
                </button>
              </div>
              <ul>
                {history.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <span onClick={() => handleSelect(item)}>{item}</span>
                    <FaTimes
                      onClick={() => handleRemove(item)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative cursor-pointer hover:scale-110 transition">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="relative">
              {/* CONTAINER UTAMA — hover di sini semua aman */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowUserMenu(true)}>
                <FaUserCircle size={26} className="text-white drop-shadow" />
                <span className="hidden md:inline text-white font-semibold drop-shadow">
                  Hi, {user?.nama?.split(" ")[0] || "User"}
                </span>
              </div>

            
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                  onMouseLeave={() => setShowUserMenu(false)}>
                  <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <p className="font-bold text-lg">{user?.nama}</p>
                    <p className="text-sm opacity-90">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition">
                      Profile Saya
                    </Link>
                    <Link
                      to="/seller"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition">
                      Toko Saya
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition">
                      Pesanan Saya
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 font-semibold transition">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-orange-700 font-semibold px-8 py-2 rounded-xl transition-colors duration-200 hover:text-orange-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
