"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing! Check your inbox for 10% off.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <footer className="bg-[#063D29] text-[#FFF9EC] pt-16 pb-10 border-t border-[#0B4A32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#174E37]/60">
          
          {/* Brand Info (2 columns on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#174E37] text-[#F5B82E] flex items-center justify-center border border-[#F5B82E]/30">
                <svg
                  className="w-6 h-6 fill-current text-[#F5B82E]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 2 1.5 3.5 3 3.5 4 0 7-7 12-9Z" />
                </svg>
              </div>
              <span className="font-serif font-black text-2xl tracking-tight text-[#FFF9EC]">
                Zezty Pickles
              </span>
            </Link>
            <p className="text-sm text-[#EFF1DC]/80 max-w-sm leading-relaxed">
              Traditional Indian pickles made with love, for your everyday moments. Handcrafted in small batches with cold-pressed oils and pure heritage spices.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#0B4A32] flex items-center justify-center text-[#FFF9EC] hover:bg-[#F5B82E] hover:text-[#063D29] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#0B4A32] flex items-center justify-center text-[#FFF9EC] hover:bg-[#F5B82E] hover:text-[#063D29] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#0B4A32] flex items-center justify-center text-[#FFF9EC] hover:bg-[#F5B82E] hover:text-[#063D29] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#F5B82E]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#EFF1DC]/80">
              <li>
                <Link href="/" className="hover:text-[#F5B82E] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F5B82E] transition-colors">
                  Our Pickles
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-[#F5B82E] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/ingredients" className="hover:text-[#F5B82E] transition-colors">
                  Ingredients
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5B82E] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#F5B82E]">Customer Care</h4>
            <ul className="space-y-2 text-sm text-[#EFF1DC]/80">
              <li>
                <Link href="/shipping-policy" className="hover:text-[#F5B82E] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#F5B82E] transition-colors">
                  Return & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F5B82E] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#F5B82E] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-xs text-[#EFF1DC]/40 hover:text-[#F5B82E] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#F5B82E]">Stay In Touch</h4>
            <p className="text-xs text-[#EFF1DC]/80">
              Subscribe for exclusive seasonal pickle batches, discounts, and traditional recipes.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 bg-[#0B4A32] border border-[#174E37] rounded-full text-xs text-[#FFF9EC] placeholder-[#EFF1DC]/50 focus:outline-none focus:ring-2 focus:ring-[#F5B82E] pr-10"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#F5B82E] text-[#063D29] rounded-full flex items-center justify-center hover:bg-yellow-400 disabled:opacity-50 transition-colors"
                  aria-label="Submit newsletter subscription"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {status === "success" && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{message}</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-1.5 text-xs text-red-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{message}</span>
                </div>
              )}

              <p className="text-[10px] text-[#EFF1DC]/50">
                We value your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EFF1DC]/60 gap-4">
          <p>© {new Date().getFullYear()} Zezty Pickles. All rights reserved.</p>
          <div className="flex items-center space-x-4 font-serif text-[#F5B82E]/90 italic">
            <span>Good Food.</span>
            <span>Happy Moments.</span>
            <span>Zezty Pickles.</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-[#FFF9EC]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#FFF9EC]">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
