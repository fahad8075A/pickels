"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  const handlePrefill = (role: "admin" | "customer") => {
    if (role === "admin") {
      setEmail("admin@zeztypickles.com");
      setPassword("AdminPassword123!");
    } else {
      setEmail("customer@example.com");
      setPassword("Customer123!");
    }
  };

  return (
    <div className="py-20 bg-[#FFF9EC] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4 space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-lg">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#EFF1DC] text-[#174E37] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-black text-[#163D2D]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#68786B]">
            Sign in to your Zezty Pickles customer account
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#163D2D] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#68786B] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#163D2D] block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#68786B] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo login shortcuts */}
        <div className="pt-4 border-t border-[#E9E2CE] space-y-2">
          <p className="text-[11px] text-center font-bold text-[#68786B] uppercase tracking-wider">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePrefill("admin")}
              className="p-2 border border-[#E9E2CE] rounded-lg bg-[#EFF1DC] text-[#174E37] font-semibold hover:bg-[#E9E2CE] transition-colors"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={() => handlePrefill("customer")}
              className="p-2 border border-[#E9E2CE] rounded-lg bg-[#EFF1DC] text-[#174E37] font-semibold hover:bg-[#E9E2CE] transition-colors"
            >
              Fill Customer
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#68786B]">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-[#174E37] hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
