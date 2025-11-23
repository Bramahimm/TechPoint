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
  const { user, isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount] = useState(2);
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

          {/* User */}
          {isAuthenticated && user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                <FaUserCircle size={22} />
                <span className="hidden md:inline text-sm font-medium">
                  {user.name}
                </span>
              </div>

              {showUserMenu && (
                <div className="absolute right-0 w-40 bg-white border rounded shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100">
                    Profile Saya
                  </Link>
                  <Link
                    to="/sellet/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100">
                    Toko Saya
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100">
                    Pesanan Saya
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white psx-4 py-2 rounded-full hover:bg-blue-600 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
