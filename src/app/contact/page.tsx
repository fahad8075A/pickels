"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setResponseMsg("Thank you! Your message has been sent. Our kitchen team will respond within 24 hours.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setResponseMsg(data.error || "Failed to submit message. Please try again.");
      }
    } catch {
      setStatus("error");
      setResponseMsg("Something went wrong. Please check your connection and try again.");
    }
  };

  return (
    <div className="py-16 bg-[#FFF9EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#174E37]">
            WE WOULD LOVE TO HEAR FROM YOU
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-[#163D2D]">
            Get In Touch With Zezty Pickles
          </h1>
          <p className="text-sm sm:text-base text-[#68786B]">
            Have a question regarding bulk orders, custom batches, or your delivery? Reach out to our family team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Card (5 Columns) */}
          <div className="lg:col-span-5 bg-[#F8F1DF] p-8 rounded-3xl border border-[#E9E2CE] space-y-8">
            <h2 className="font-serif font-bold text-2xl text-[#163D2D]">
              Customer Care & Kitchen
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E9E2CE] flex items-center justify-center text-[#174E37] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#163D2D]">Email Us</h3>
                  <p className="text-xs text-[#68786B] mt-0.5">hello@zeztypickles.com</p>
                  <p className="text-xs text-[#68786B]">orders@zeztypickles.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E9E2CE] flex items-center justify-center text-[#174E37] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#163D2D]">Call / WhatsApp Support</h3>
                  <p className="text-xs text-[#68786B] mt-0.5">+91 98765 43210</p>
                  <p className="text-xs text-[#68786B]">+91 11 4567 8900</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E9E2CE] flex items-center justify-center text-[#174E37] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#163D2D]">Artisanal Kitchen Studio</h3>
                  <p className="text-xs text-[#68786B] mt-0.5 leading-relaxed">
                    Plot 18, Spice Garden Enclave, Sector 34, Gurugram, Haryana - 122001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E9E2CE] flex items-center justify-center text-[#174E37] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#163D2D]">Support Hours</h3>
                  <p className="text-xs text-[#68786B] mt-0.5">
                    Monday to Saturday: 9:00 AM – 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E2CE] shadow-sm">
            <h2 className="font-serif font-bold text-2xl text-[#163D2D] mb-6">
              Send Us a Message
            </h2>

            {status === "success" && (
              <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{responseMsg}</span>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{responseMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. priya@example.com"
                    className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Bulk order inquiry"
                    className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#163D2D] block mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-2.5 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-3.5 bg-[#174E37] text-[#FFF9EC] rounded-full font-semibold text-sm hover:bg-[#0B4A32] shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{status === "loading" ? "Sending..." : "Submit Message"}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
