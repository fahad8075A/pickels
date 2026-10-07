"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, User as UserIcon, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const pathname = usePathname();
  const { openCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Pickles", href: "/products" },
    { label: "Our Story", href: "/our-story" },
    { label: "Ingredients", href: "/ingredients" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#0B4A32] text-[#FFF9EC] py-2 px-4 text-xs font-medium tracking-wide text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
        <span>കേരളത്തിന്റെ തനത് രുചി • Amma&apos;s Handcrafted Kerala Pickles • അമ്മയുടെ കൈപ്പുണ്യം • Free Delivery on Orders Over ₹499</span>
        <Sparkles className="w-3.5 h-3.5 text-[#F5B82E]" />
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FFF9EC]/95 backdrop-blur-md border-b border-[#E9E2CE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-[#174E37] text-[#F5B82E] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              {/* Botanical Leaf SVG */}
              <svg
                className="w-6 h-6 fill-current text-[#F5B82E]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 2 1.5 3.5 3 3.5 4 0 7-7 12-9Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-2xl tracking-tight text-[#163D2D] leading-none group-hover:text-[#174E37] transition-colors">
                Zezty Pickles
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#174E37] mt-0.5">
                അമ്മയുടെ കൈപ്പുണ്യം • Amma&apos;s Recipe
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? "text-[#174E37] font-semibold"
                      : "text-[#163D2D]/80 hover:text-[#174E37]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#174E37] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#163D2D] hover:text-[#174E37] hover:bg-[#EFF1DC]/60 rounded-full transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 text-[#163D2D] hover:text-[#174E37] hover:bg-[#EFF1DC]/60 rounded-full transition-colors hidden sm:flex"
              aria-label="Account profile"
            >
              <UserIcon className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#163D2D] hover:text-[#174E37] hover:bg-[#EFF1DC]/60 rounded-full transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F5B82E] text-[#163D2D] font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Shop Now CTA */}
            <Link
              href="/products"
              className="hidden lg:inline-flex items-center px-5 py-2.5 bg-[#174E37] text-[#FFF9EC] text-sm font-semibold rounded-full shadow-sm hover:bg-[#0B4A32] active:scale-95 transition-all"
            >
              Shop Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#163D2D] hover:text-[#174E37] rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#E9E2CE] bg-[#F8F1DF] px-4 py-3 sm:px-8">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for mango pickle, garlic, spices..."
                className="flex-1 px-4 py-2 bg-white border border-[#E9E2CE] rounded-full text-sm text-[#163D2D] focus:outline-none focus:ring-2 focus:ring-[#174E37]"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#174E37] text-[#FFF9EC] rounded-full text-sm font-semibold hover:bg-[#0B4A32] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-3 py-2 text-[#68786B] hover:text-[#163D2D] text-sm"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E9E2CE] bg-[#FFF9EC] px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-2 border-b border-[#E9E2CE]/50 ${
                      isActive ? "text-[#174E37] font-bold" : "text-[#163D2D]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-2 border-b border-[#E9E2CE]/50 text-[#163D2D]"
              >
                My Account
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-2 border-b border-[#E9E2CE]/50 text-[#163D2D]"
              >
                Track Order
              </Link>
            </nav>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 bg-[#174E37] text-[#FFF9EC] rounded-full text-center font-semibold text-sm shadow-md"
            >
              Shop All Pickles
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
