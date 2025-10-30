"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { HiMenu, HiX } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BsTelephoneInbound } from "react-icons/bs";

export default function Navbar() {
  const [role, setRole] = useState(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // ✅ Load role & cart, listen for updates
  useEffect(() => {
    const loadRole = () => {
      const savedRole = (Cookies.get("role") || "guest").trim().toLowerCase();
      setRole(savedRole);
    };

    loadRole(); // initial load
    window.addEventListener("roleChanged", loadRole);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(savedCart.length);

    const handleCartUpdate = (e) => setCartCount(e.detail);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("roleChanged", loadRole);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setRole("guest");
    window.dispatchEvent(new Event("roleChanged")); // update Navbar immediately
    router.push("/login");
  };

  const menuLinks = {
    admin: [
      { name: "Dashboard", href: "/admin" },
      { name: "Add Product", href: "/admin/addproduct" },
      { name: "Orders", href: "/admin/orders" },
      { name: "Confirmed", href: "/admin/confirmed" },
      { name: "Delivered", href: "/admin/delivery" },
      { name: "Canceled", href: "/admin/canceled" },
    ],
    user: [{ name: "Products", href: "/" }],
    guest: [{ name: "Products", href: "/" }],
  };

  if (role === undefined) {
    return (
      <nav className="bg-[#a2e7ca] shadow-md px-4 py-3">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </nav>
    );
  }

  const links =
    role === "admin"
      ? menuLinks.admin
      : role === "user"
      ? menuLinks.user
      : menuLinks.guest;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-green-500 shadow-md relative z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <div className="p-2 rounded-xl bg-gradient-to-r from-[#e94d10] via-[#14eb6e] to-[#258963] shadow-md group-hover:scale-105 transition-transform duration-300">
            <BsTelephoneInbound className="text-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#e94d10] via-[#8bf172] to-[#e44b24] bg-clip-text text-transparent">
              Hello
            </span>{" "}
            <span className="bg-gradient-to-r from-[#e94d10] via-[#14eb6e] to-[#92e2c4] bg-clip-text text-transparent">
              Bajar
            </span>
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <Link href="/cart" className="relative text-2xl">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-700"
              >
                {link.name}
              </Link>
            ))}
            {role === "guest" ? (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-4 w-56 bg-gray-50 shadow-lg rounded-xl border border-gray-200 p-3 space-y-3 text-black"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-center border border-gray-300 rounded-lg py-2 hover:bg-blue-50 hover:text-blue-700 transition"
            >
              {link.name}
            </Link>
          ))}

          {role !== "guest" ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full border border-red-400 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center border border-blue-400 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}
