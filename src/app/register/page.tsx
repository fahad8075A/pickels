"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-[#FFF9EC] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4 space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-lg">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#EFF1DC] text-[#174E37] rounded-full flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-black text-[#163D2D]">
            Create Account
          </h1>
          <p className="text-xs text-[#68786B]">
            Join Zezty Pickles for exclusive discounts & easy tracking
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#163D2D] block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#68786B] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#163D2D] block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#68786B] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#163D2D] block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#68786B] absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#163D2D] block mb-1">
              Password * (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#68786B] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#68786B]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#174E37] hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
