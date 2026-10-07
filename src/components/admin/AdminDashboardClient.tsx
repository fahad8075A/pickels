"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Trash2,
  Edit3,
  Layers,
  Tag,
  Mail,
  Save,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  Building2,
  CreditCard,
  QrCode,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialStats: {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalRevenue: number;
    pendingOrders: number;
    lowStockCount: number;
  };
  initialOrders: any[];
  initialProducts: any[];
  categories: any[];
  initialCms: {
    hero: any;
    story: any;
    promo: any;
  };
  initialCoupons: any[];
  initialMessages: any[];
  initialPaymentSettings?: any;
}

export default function AdminDashboardClient({
  initialStats,
  initialOrders,
  initialProducts,
  categories,
  initialCms,
  initialCoupons,
  initialMessages,
  initialPaymentSettings,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "inventory" | "cms" | "coupons" | "messages" | "payments"
  >("overview");

  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [paymentSettings, setPaymentSettings] = useState(
    initialPaymentSettings || {
      upiId: "zeztypickles@okaxis",
      accountHolderName: "Zezty Pickles Handcrafted Foods",
      accountNumber: "50200084729184",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      accountType: "Current Account",
      branch: "MG Road, Kochi, Kerala",
      instructions:
        "Scan the QR code or transfer to our direct bank account below. Enter your 12-digit UTR/UPI reference number to immediately confirm your order.",
      razorpayKeyId: "rzp_test_mock_key",
      razorpayEnabled: true,
      directBankEnabled: true,
      codEnabled: true,
    }
  );
  const [cmsHero, setCmsHero] = useState({
    heading: initialCms.hero?.heading || "A Little Tang, A Lot of Tradition.",
    eyebrow: initialCms.hero?.eyebrow || "തനത് കേരള അച്ചാറുകൾ • AMMA'S TRADITIONAL KERALA PICKLES",
    malayalamText: initialCms.hero?.malayalamText || "അമ്മയുടെ സ്നേഹവും കൈപ്പുണ്യവും നിറഞ്ഞ തനത് നാടൻ രുചി.",
    description: initialCms.hero?.description || "Handcrafted Kerala pickles prepared with Amma's traditional recipes...",
  });
  const [cmsStory, setCmsStory] = useState({
    heading: initialCms.story?.heading || "From Our Kitchen to Your Table",
    eyebrow: initialCms.story?.eyebrow || "OUR STORY • അമ്മയുടെ കൈപ്പുണ്യം",
    malayalamHeading: initialCms.story?.malayalamHeading || "നാടിന്റെ രുചി, വീട്ടിലെ സ്നേഹം",
    description: initialCms.story?.description || "At Zezty Pickles, every jar begins with a memory...",
  });

  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(50);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  interface WeightVariantItem {
    weight: string;
    price: number;
    originalPrice?: number;
  }

  // Product form modal state (Create & Edit)
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("/images/products/mango-pickle.jpg");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const initialProductState = {
    name: "",
    malayalamName: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    sku: "",
    categoryId: categories[0]?.id || "",
    price: 130,
    originalPrice: 160,
    stock: 50,
    weight: "250g",
    ingredients: "Spices, Cold-Pressed Oil, Salt",
    image: "/images/products/mango-pickle.jpg",
  };

  const [newProductData, setNewProductData] = useState(initialProductState);
  const [productVariants, setProductVariants] = useState<WeightVariantItem[]>([
    { weight: "250g", price: 130, originalPrice: 160 },
    { weight: "500g", price: 260, originalPrice: 300 },
  ]);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setNewProductData(initialProductState);
    setProductVariants([
      { weight: "250g", price: 130, originalPrice: 160 },
      { weight: "500g", price: 260, originalPrice: 300 },
    ]);
    setImagePreviewUrl("/images/products/mango-pickle.jpg");
    setSelectedImageFile(null);
    setShowNewProductModal(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingProductId(p.id);
    let parsedVariants: WeightVariantItem[] = [];
    if (p.weightVariants) {
      try {
        parsedVariants = typeof p.weightVariants === "string" ? JSON.parse(p.weightVariants) : p.weightVariants;
      } catch {}
    }
    if (!parsedVariants || parsedVariants.length === 0) {
      parsedVariants = [{ weight: p.weight || "250g", price: p.price, originalPrice: p.originalPrice || undefined }];
    }
    setProductVariants(parsedVariants);
    setNewProductData({
      name: p.name || "",
      malayalamName: p.malayalamName || "",
      slug: p.slug || "",
      shortDescription: p.shortDescription || "",
      fullDescription: p.fullDescription || p.shortDescription || "",
      sku: p.sku || "",
      categoryId: p.categoryId || categories[0]?.id || "",
      price: p.price || 130,
      originalPrice: p.originalPrice || 160,
      stock: p.stock ?? 50,
      weight: p.weight || "250g",
      ingredients: p.ingredients || "Spices, Cold-Pressed Oil, Salt",
      image: p.image || "/images/products/mango-pickle.jpg",
    });
    setImagePreviewUrl(p.image || "/images/products/mango-pickle.jpg");
    setSelectedImageFile(null);
    setShowNewProductModal(true);
  };

  const handleAddVariant = (weight = "250g", price = 130) => {
    setProductVariants((prev) => [
      ...prev,
      { weight, price, originalPrice: Math.round(price * 1.25) },
    ]);
  };

  const handleUpdateVariant = (index: number, field: "weight" | "price" | "originalPrice", value: any) => {
    setProductVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (index: number) => {
    setProductVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
      setNewProductData((prev) => ({ ...prev, image: preview }));
    }
  };

  const handleSelectPresetImage = (presetUrl: string) => {
    setSelectedImageFile(null);
    setImagePreviewUrl(presetUrl);
    setNewProductData((prev) => ({ ...prev, image: presetUrl }));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoadingAction(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        setMessage({ text: `Order updated to ${newStatus}`, type: "success" });
      } else {
        setMessage({ text: data.error || "Update failed", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error updating order", type: "error" });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleConfirmBankPayment = async (orderId: string) => {
    setLoadingAction(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentStatus: "PAID",
          status: "CONFIRMED",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: "PAID", status: "CONFIRMED" } : o
          )
        );
        setMessage({
          text: "Direct Bank transfer verified & marked as PAID!",
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Update failed", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error confirming payment", type: "error" });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("payments");
    try {
      const res = await fetch("/api/admin/settings/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentSettings),
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentSettings(data.settings);
        setMessage({
          text: "Merchant Bank details & Gateway settings updated successfully!",
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Failed to update settings", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error saving payment settings", type: "error" });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    setLoadingAction(productId);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock: newStock }),
      });
      if (res.ok) {
        setProducts(products.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)));
        setMessage({ text: "Inventory stock updated successfully", type: "success" });
      }
    } catch {
      setMessage({ text: "Failed to update stock", type: "error" });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveCmsSection = async (section: "hero" | "story") => {
    setLoadingAction(section);
    try {
      const dataToSave = section === "hero" ? cmsHero : cmsStory;
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: dataToSave }),
      });
      if (res.ok) {
        setMessage({ text: `${section.toUpperCase()} content saved & published to website!`, type: "success" });
      } else {
        setMessage({ text: "Failed to update CMS section", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error saving CMS", type: "error" });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "coupon",
          data: {
            code: newCouponCode,
            discountType: "FIXED",
            discountValue: newCouponDiscount,
            minOrderAmount: 299,
          },
        }),
      });
      if (res.ok) {
        setCoupons([
          {
            id: `cp-${Date.now()}`,
            code: newCouponCode.toUpperCase(),
            discountType: "FIXED",
            discountValue: newCouponDiscount,
            minOrderAmount: 299,
            isActive: true,
          },
          ...coupons,
        ]);
        setNewCouponCode("");
        setMessage({ text: `Coupon ${newCouponCode.toUpperCase()} activated!`, type: "success" });
      }
    } catch {
      setMessage({ text: "Error creating coupon", type: "error" });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = newProductData.image;

      // If user selected a file from device, upload it first
      if (selectedImageFile) {
        setIsUploadingImage(true);
        try {
          const formData = new FormData();
          formData.append("file", selectedImageFile);
          const uploadRes = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.url) {
            finalImageUrl = uploadData.url;
          }
        } catch (uploadErr) {
          console.warn("Upload failed, falling back to existing image URL:", uploadErr);
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Sync base weight & price from the first variant if variants exist
      const effectiveWeight = productVariants[0]?.weight || newProductData.weight || "250g";
      const effectivePrice = productVariants[0]?.price || newProductData.price || 130;
      const effectiveOriginalPrice = productVariants[0]?.originalPrice || newProductData.originalPrice;

      const payload = {
        ...newProductData,
        image: finalImageUrl,
        weight: effectiveWeight,
        price: effectivePrice,
        originalPrice: effectiveOriginalPrice,
        weightVariants: productVariants,
      };

      if (editingProductId) {
        // Edit existing product
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProductId, ...payload }),
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(products.map((p) => (p.id === editingProductId ? data.product : p)));
          setShowNewProductModal(false);
          setSelectedImageFile(null);
          setEditingProductId(null);
          setMessage({ text: `Pickle "${data.product.name}" updated successfully!`, type: "success" });
        } else {
          setMessage({ text: data.error || "Failed to update product", type: "error" });
        }
      } else {
        // Create new product
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setProducts([data.product, ...products]);
          setShowNewProductModal(false);
          setSelectedImageFile(null);
          setMessage({ text: "New pickle product added with gram variants!", type: "success" });
        } else {
          setMessage({ text: data.error || "Product creation failed", type: "error" });
        }
      }
    } catch {
      setMessage({ text: "Error saving product", type: "error" });
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from the store catalog?`)) return;
    setLoadingAction(productId);
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        setMessage({ text: `Product "${productName}" removed from catalog`, type: "success" });
      } else {
        setMessage({ text: "Failed to delete product", type: "error" });
      }
    } catch {
      setMessage({ text: "Error deleting product", type: "error" });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast message */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2 text-sm shadow transition-all ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E9E2CE] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "products"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "inventory"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Stock & Inventory
        </button>
        <button
          onClick={() => setActiveTab("cms")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "cms"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Website CMS</span>
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "coupons"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons ({coupons.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "messages"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Customer Inquiries</span>
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "payments"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Bank & Payment Gateway</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E9E2CE] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-[#68786B] font-semibold uppercase">Total Revenue</p>
                <h3 className="font-serif font-black text-3xl text-[#163D2D] mt-1">
                  ₹{initialStats.totalRevenue}
                </h3>
                <p className="text-[11px] text-emerald-700 mt-1">From confirmed orders</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E9E2CE] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-[#68786B] font-semibold uppercase">Total Orders</p>
                <h3 className="font-serif font-black text-3xl text-[#163D2D] mt-1">
                  {orders.length}
                </h3>
                <p className="text-[11px] text-[#68786B] mt-1">{initialStats.pendingOrders} pending</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E9E2CE] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-[#68786B] font-semibold uppercase">Active Customers</p>
                <h3 className="font-serif font-black text-3xl text-[#163D2D] mt-1">
                  {initialStats.totalCustomers}
                </h3>
                <p className="text-[11px] text-[#68786B] mt-1">Registered patrons</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E9E2CE] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-[#68786B] font-semibold uppercase">Low Stock Alerts</p>
                <h3 className="font-serif font-black text-3xl text-[#163D2D] mt-1">
                  {products.filter((p) => p.stock <= 20).length}
                </h3>
                <p className="text-[11px] text-red-600 mt-1">Products ≤ 20 jars</p>
              </div>
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#163D2D]">
              Recent Customer Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E2CE] text-[#68786B]">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Fulfillment</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 font-mono font-bold text-[#163D2D]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-[#68786B]">
                        {order.user?.name || order.guestName || "Guest"}
                      </td>
                      <td className="py-3 font-serif font-bold text-[#163D2D]">
                        ₹{order.total}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF1DC] text-[#174E37]">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 bg-[#FFF9EC] border border-[#E9E2CE] rounded text-[11px] font-semibold"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Full Table */}
      {activeTab === "orders" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E2CE]">
            <h3 className="font-serif font-bold text-xl text-[#163D2D]">
              All Orders Management
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E9E2CE] text-[#68786B]">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment & Bank UTR</th>
                  <th className="pb-3">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3 font-mono font-bold text-[#163D2D]">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 text-[#68786B]">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 text-[#68786B] max-w-xs truncate">
                      {o.shippingAddress}
                    </td>
                    <td className="py-3 text-[#163D2D]">
                      {o.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(", ")}
                    </td>
                    <td className="py-3 font-serif font-bold text-[#163D2D]">
                      ₹{o.total}
                    </td>
                    <td className="py-3 space-y-1">
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.paymentMethod === "DIRECT_BANK"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.paymentMethod === "RAZORPAY"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-[#EFF1DC] text-[#174E37]"
                          }`}
                        >
                          {o.paymentMethod === "DIRECT_BANK"
                            ? "Direct Bank / UPI"
                            : o.paymentMethod === "RAZORPAY"
                            ? "Razorpay Gateway"
                            : "COD"}
                        </span>
                      </div>
                      {o.razorpayPaymentId && (
                        <p className="text-[10px] font-mono text-[#163D2D] bg-[#FFF9EC] px-1.5 py-0.5 rounded border border-[#E9E2CE] inline-block">
                          {o.razorpayPaymentId}
                        </p>
                      )}
                      <div>
                        {o.paymentStatus === "PAID" ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> PAID
                          </span>
                        ) : o.paymentMethod === "DIRECT_BANK" ? (
                          <button
                            type="button"
                            onClick={() => handleConfirmBankPayment(o.id)}
                            disabled={loadingAction === o.id}
                            className="px-2 py-1 bg-[#174E37] text-white rounded-lg text-[10px] font-bold hover:bg-[#0B4A32] shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Confirm Paid
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-bold">
                            {o.paymentStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 bg-[#FFF9EC] border border-[#E9E2CE] rounded text-[11px] font-semibold"
                      >
                        <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Products Catalog Manager */}
      {activeTab === "products" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E2CE]">
            <h3 className="font-serif font-bold text-xl text-[#163D2D]">
              Products Catalog
            </h3>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Pickle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              let variantsList: any[] = [];
              if (p.weightVariants) {
                try {
                  variantsList = typeof p.weightVariants === "string" ? JSON.parse(p.weightVariants) : p.weightVariants;
                } catch {}
              }

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-[#E9E2CE] bg-[#FFF9EC]/40 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white border border-[#E9E2CE]">
                      <Image src={p.image} alt={p.name} fill unoptimized className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#163D2D]">{p.name}</h4>
                      <p className="text-xs text-[#68786B] font-mono">SKU: {p.sku}</p>
                      <p className="font-serif font-bold text-lg text-[#174E37] mt-1">₹{p.price}</p>
                      <p className="text-xs text-[#68786B]">In Stock: <strong>{p.stock}</strong> jars</p>

                      {/* Display Gram Variants */}
                      {variantsList && variantsList.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-[#E9E2CE]/70">
                          <span className="text-[10px] uppercase font-bold text-[#68786B] block mb-1">
                            Available Grams:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {variantsList.map((v: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[#EFF1DC] text-[#174E37] border border-[#E9E2CE] rounded-md text-[10px] font-bold"
                              >
                                {v.weight}: ₹{v.price}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="pt-3 border-t border-[#E9E2CE] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(p)}
                      className="flex-1 py-2 px-3 bg-[#174E37] text-[#FFF9EC] rounded-xl text-xs font-bold hover:bg-[#0B4A32] shadow-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Product
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      disabled={loadingAction === p.id}
                      className="py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition disabled:opacity-50"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Stock & Inventory Management */}
      {activeTab === "inventory" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#163D2D]">
            Live Inventory Quantities
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E9E2CE] text-[#68786B]">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Current Stock</th>
                  <th className="pb-3">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 font-bold text-[#163D2D]">{p.name}</td>
                    <td className="py-3 font-mono text-[#68786B]">{p.sku}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.stock <= 20
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {p.stock} Units
                      </span>
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stock + 25)}
                        className="px-2 py-1 bg-[#EFF1DC] text-[#174E37] rounded font-bold hover:bg-[#E9E2CE]"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, p.stock + 50)}
                        className="px-2 py-1 bg-[#EFF1DC] text-[#174E37] rounded font-bold hover:bg-[#E9E2CE]"
                      >
                        +50
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Live Website CMS Editor */}
      {activeTab === "cms" && (
        <div className="space-y-8">
          {/* Hero Section Editor */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E2CE] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#163D2D] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F5B82E]" />
                <span>Homepage Hero Banner CMS</span>
              </h3>
              <button
                onClick={() => handleSaveCmsSection("hero")}
                disabled={loadingAction === "hero"}
                className="px-5 py-2 bg-[#174E37] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" /> Save Hero
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Hero Main Heading (English)</label>
                <input
                  type="text"
                  value={cmsHero.heading}
                  onChange={(e) => setCmsHero({ ...cmsHero, heading: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Eyebrow / Badge Text</label>
                <input
                  type="text"
                  value={cmsHero.eyebrow}
                  onChange={(e) => setCmsHero({ ...cmsHero, eyebrow: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold block mb-1">Supporting Malayalam Text</label>
                <input
                  type="text"
                  value={cmsHero.malayalamText}
                  onChange={(e) => setCmsHero({ ...cmsHero, malayalamText: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold block mb-1">Description Paragraph</label>
                <textarea
                  rows={2}
                  value={cmsHero.description}
                  onChange={(e) => setCmsHero({ ...cmsHero, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Story Section Editor */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E2CE] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#163D2D]">
                Our Story & Heritage CMS
              </h3>
              <button
                onClick={() => handleSaveCmsSection("story")}
                disabled={loadingAction === "story"}
                className="px-5 py-2 bg-[#174E37] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" /> Save Story
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Story Main Heading</label>
                <input
                  type="text"
                  value={cmsStory.heading}
                  onChange={(e) => setCmsStory({ ...cmsStory, heading: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Malayalam Heritage Tagline</label>
                <input
                  type="text"
                  value={cmsStory.malayalamHeading}
                  onChange={(e) => setCmsStory({ ...cmsStory, malayalamHeading: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold block mb-1">Story Body Paragraph</label>
                <textarea
                  rows={3}
                  value={cmsStory.description}
                  onChange={(e) => setCmsStory({ ...cmsStory, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Coupons Management */}
      {activeTab === "coupons" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E2CE]">
            <h3 className="font-serif font-bold text-xl text-[#163D2D]">
              Promotional Coupons
            </h3>
          </div>

          {/* Create Coupon Form */}
          <form onSubmit={handleCreateCoupon} className="flex flex-wrap items-end gap-3 text-xs bg-[#FFF9EC] p-4 rounded-2xl border border-[#E9E2CE]">
            <div>
              <label className="font-bold block mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. KERALA20"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="p-2.5 bg-white border rounded-xl font-mono uppercase"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Discount (₹)</label>
              <input
                type="number"
                required
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                className="p-2.5 bg-white border rounded-xl w-24"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#174E37] text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </form>

          {/* Coupons Table */}
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E2CE] text-[#68786B]">
                <th className="pb-3">Code</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-mono font-bold text-[#163D2D]">{c.code}</td>
                  <td className="py-3 font-semibold text-[#174E37]">₹{c.discountValue} OFF</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 7: Customer Inquiries */}
      {activeTab === "messages" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#163D2D]">
            Customer Inquiries & Messages
          </h3>
          <div className="space-y-3">
            {initialMessages && initialMessages.length > 0 ? (
              initialMessages.map((msg: any) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-[#FFF9EC]/60 border border-[#E9E2CE] space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-[#163D2D]">
                    <span>{msg.name} ({msg.email})</span>
                    <span className="text-[#68786B] font-normal">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-[#174E37]">{msg.subject}</p>
                  <p className="text-[#68786B]">{msg.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#68786B] italic">No customer inquiries yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 8: Bank Account & Payment Settings */}
      {activeTab === "payments" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E2CE] shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9E2CE] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#EFF1DC] text-[#174E37] text-xs font-bold rounded-full">
                  DIRECT BANK SETTLEMENT
                </span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#163D2D] mt-1">
                Bank Account & Payment Gateways
              </h3>
              <p className="text-xs text-[#68786B]">
                Enter your real bank account details. Customers can transfer directly to this account via UPI/IMPS with 0% gateway deductions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Direct Transfer Active
              </span>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#FFF9EC] p-6 rounded-2xl border border-[#E9E2CE] space-y-4">
              <span className="text-xs font-bold text-[#174E37] uppercase tracking-wider block">
                Current Live Bank Card (Visible on Checkout)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E9E2CE]">
                  <span className="text-[#68786B] block">Bank Name</span>
                  <span className="font-bold text-sm text-[#163D2D]">
                    {paymentSettings.bankName || "Not configured"}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E9E2CE]">
                  <span className="text-[#68786B] block">Account Holder</span>
                  <span className="font-bold text-sm text-[#163D2D]">
                    {paymentSettings.accountHolderName || "Not configured"}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E9E2CE]">
                  <span className="text-[#68786B] block">Account Number</span>
                  <span className="font-mono font-bold text-sm text-[#163D2D]">
                    {paymentSettings.accountNumber || "Not configured"}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E9E2CE]">
                  <span className="text-[#68786B] block">IFSC Code</span>
                  <span className="font-mono font-bold text-sm text-[#163D2D]">
                    {paymentSettings.ifscCode || "Not configured"}
                  </span>
                </div>
                <div className="sm:col-span-2 p-3 bg-white rounded-xl border border-[#E9E2CE]">
                  <span className="text-[#68786B] block">Merchant UPI ID (GPay, PhonePe, Paytm, BHIM)</span>
                  <span className="font-mono font-bold text-sm text-[#174E37]">
                    {paymentSettings.upiId || "Not configured"}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic QR Preview */}
            <div className="bg-[#FFF9EC] p-6 rounded-2xl border border-[#E9E2CE] flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-bold text-[#174E37] uppercase tracking-wider">
                Live UPI QR Preview
              </span>
              <div className="w-32 h-32 bg-white p-2 rounded-xl border border-[#E9E2CE] shadow-sm flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    `upi://pay?pa=${paymentSettings.upiId}&pn=${paymentSettings.accountHolderName}&cu=INR`
                  )}&color=163D2D`}
                  alt="UPI QR Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-[#68786B]">
                QR code generated dynamically for customer totals at checkout.
              </p>
            </div>
          </div>

          {/* Settings Edit Form */}
          <form onSubmit={handleSavePaymentSettings} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  required
                  value={paymentSettings.bankName}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, bankName: e.target.value })
                  }
                  placeholder="e.g. HDFC Bank / State Bank of India / Federal Bank"
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>

              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  Bank Branch Location *
                </label>
                <input
                  type="text"
                  required
                  value={paymentSettings.branch}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, branch: e.target.value })
                  }
                  placeholder="e.g. MG Road, Kochi, Kerala"
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>

              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  required
                  value={paymentSettings.accountHolderName}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      accountHolderName: e.target.value,
                    })
                  }
                  placeholder="e.g. Zezty Pickles Handcrafted Foods"
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>

              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={paymentSettings.accountNumber}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })
                  }
                  placeholder="e.g. 50200084729184"
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm font-mono text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>

              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  required
                  value={paymentSettings.ifscCode}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      ifscCode: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. HDFC0001234"
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm font-mono text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>

              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  Account Type
                </label>
                <select
                  value={paymentSettings.accountType}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, accountType: e.target.value })
                  }
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                >
                  <option value="Current Account">Current Account (Business)</option>
                  <option value="Savings Account">Savings Account (Personal)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#163D2D] block mb-1">
                  Merchant UPI ID (for GPay, PhonePe, Paytm, CRED) *
                </label>
                <input
                  type="text"
                  required
                  value={paymentSettings.upiId}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, upiId: e.target.value })
                  }
                  placeholder="e.g. zeztypickles@okaxis or yourname@upi"
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm font-mono text-[#174E37] focus:ring-1 focus:ring-[#174E37]"
                />
                <p className="text-[11px] text-[#68786B] mt-1">
                  * Funds sent to this UPI ID settle directly into your bank account immediately.
                </p>
              </div>

              <div>
                <label className="font-bold text-[#163D2D] block mb-1">
                  Razorpay Key ID (For Online Cards / Gateway)
                </label>
                <input
                  type="text"
                  value={paymentSettings.razorpayKeyId}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })
                  }
                  placeholder="rzp_test_... or rzp_live_..."
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm font-mono text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-bold text-[#163D2D] block mb-1">
                  Customer Transfer Instructions (Shown at Checkout)
                </label>
                <textarea
                  rows={2}
                  value={paymentSettings.instructions}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      instructions: e.target.value,
                    })
                  }
                  placeholder="e.g. Scan QR or transfer to bank account above. Enter your 12-digit UTR number to instantly clear order."
                  className="w-full p-3 bg-[#FFF9EC] border border-[#E9E2CE] rounded-xl text-sm text-[#163D2D] focus:ring-1 focus:ring-[#174E37]"
                />
              </div>
            </div>

            {/* Gateways Active Toggles */}
            <div className="p-4 bg-[#FFF9EC] rounded-2xl border border-[#E9E2CE] flex flex-wrap items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#163D2D]">
                <input
                  type="checkbox"
                  checked={paymentSettings.directBankEnabled}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      directBankEnabled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-[#174E37] rounded"
                />
                <span>Enable Direct Bank Transfer & UPI</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#163D2D]">
                <input
                  type="checkbox"
                  checked={paymentSettings.razorpayEnabled}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      razorpayEnabled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-[#174E37] rounded"
                />
                <span>Enable Razorpay Payment Gateway</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#163D2D]">
                <input
                  type="checkbox"
                  checked={paymentSettings.codEnabled}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      codEnabled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-[#174E37] rounded"
                />
                <span>Enable Cash on Delivery (COD)</span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loadingAction === "payments"}
                className="px-8 py-3 bg-[#174E37] text-white font-bold rounded-full shadow-lg hover:bg-[#0B4A32] flex items-center gap-2 text-sm transition"
              >
                <Save className="w-4 h-4" />
                <span>
                  {loadingAction === "payments"
                    ? "Saving Bank Details..."
                    : "Save Bank & Payment Settings"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Product Modal with Photo Upload from Computer / Device */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E9E2CE] shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#E9E2CE] pb-3">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#163D2D]">
                  {editingProductId ? "Edit Pickle Product" : "Add New Pickle Product"}
                </h3>
                <p className="text-xs text-[#68786B]">
                  {editingProductId
                    ? "Update product details, gram weight options, and live pricing"
                    : "Upload pickle photo from your device, configure gram variants and pricing"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewProductModal(false)}
                className="text-[#68786B] hover:text-[#163D2D] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Product Photo Upload Section */}
              <div className="space-y-2 p-4 bg-[#FFF9EC] rounded-2xl border border-[#E9E2CE]">
                <label className="font-bold text-[#163D2D] block">
                  Product Photo / Image
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white border-2 border-[#174E37]/30 shadow-md flex-shrink-0">
                    <Image
                      src={imagePreviewUrl}
                      alt="Product preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2 flex-1 w-full">
                    <label
                      htmlFor="pickle-photo-input"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174E37] text-white rounded-full font-bold cursor-pointer hover:bg-[#0B4A32] transition-colors shadow-sm text-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Device</span>
                    </label>
                    <input
                      id="pickle-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-[#68786B]">
                      {selectedImageFile
                        ? `Selected: ${selectedImageFile.name}`
                        : "Supports JPG, PNG, WEBP from your phone or PC"}
                    </p>

                    {/* Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] text-[#68786B] block mb-1 font-semibold uppercase">Or Choose Preset Jar:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectPresetImage("/images/products/mango-pickle.jpg")}
                          className="px-2.5 py-1 bg-white border border-[#E9E2CE] rounded-lg text-[10px] font-semibold text-[#163D2D] hover:bg-[#EFF1DC]"
                        >
                          Mango Pickle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPresetImage("/images/products/garlic-pickle.jpg")}
                          className="px-2.5 py-1 bg-white border border-[#E9E2CE] rounded-lg text-[10px] font-semibold text-[#163D2D] hover:bg-[#EFF1DC]"
                        >
                          Garlic Pickle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPresetImage("/images/products/mixed-veg-pickle.jpg")}
                          className="px-2.5 py-1 bg-white border border-[#E9E2CE] rounded-lg text-[10px] font-semibold text-[#163D2D] hover:bg-[#EFF1DC]"
                        >
                          Mixed Veg
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPresetImage("/images/banners/pickle-bowl-story.jpg")}
                          className="px-2.5 py-1 bg-white border border-[#E9E2CE] rounded-lg text-[10px] font-semibold text-[#163D2D] hover:bg-[#EFF1DC]"
                        >
                          Bharani Bowl
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Malayalam Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Product Title (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cut Mango Pickle"
                    value={newProductData.name}
                    onChange={(e) =>
                      setNewProductData({
                        ...newProductData,
                        name: e.target.value,
                        slug: editingProductId ? newProductData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      })
                    }
                    className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Malayalam Name</label>
                  <input
                    type="text"
                    placeholder="e.g. കണ്ണിമാങ്ങ അച്ചാർ"
                    value={newProductData.malayalamName}
                    onChange={(e) => setNewProductData({ ...newProductData, malayalamName: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                  />
                </div>
              </div>

              {/* Slug & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={newProductData.slug}
                    onChange={(e) => setNewProductData({ ...newProductData, slug: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="ZP-NEW-350"
                    value={newProductData.sku}
                    onChange={(e) => setNewProductData({ ...newProductData, sku: e.target.value })}
                    className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              {/* Base Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Total Stock (Jars)</label>
                  <input
                    type="number"
                    required
                    value={newProductData.stock}
                    onChange={(e) => setNewProductData({ ...newProductData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Default Net Weight</label>
                  <input
                    type="text"
                    value={newProductData.weight}
                    onChange={(e) => setNewProductData({ ...newProductData, weight: e.target.value })}
                    placeholder="e.g. 250g or 350g"
                    className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                  />
                </div>
              </div>

              {/* WEIGHT / GRAM OPTIONS SECTION (e.g. 250g - 130, 500g - 260) */}
              <div className="p-4 bg-[#EFF1DC]/60 rounded-2xl border-2 border-[#174E37]/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E2CE] pb-2">
                  <div>
                    <label className="font-bold text-sm text-[#163D2D] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F5B82E]" />
                      <span>Different Grams & Pricing (Size Variants)</span>
                    </label>
                    <p className="text-[11px] text-[#68786B]">
                      Add sizes like 250g - ₹130, 500g - ₹260, 1kg - ₹500 for customer selection.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddVariant("250g", 130)}
                    className="px-3 py-1 bg-[#174E37] text-white rounded-full text-[11px] font-bold hover:bg-[#0B4A32] flex items-center gap-1 shadow-sm w-fit"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size
                  </button>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-[#68786B] font-semibold">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleAddVariant("250g", 130)}
                    className="px-2 py-0.5 bg-white border border-[#E9E2CE] hover:border-[#174E37] rounded font-semibold text-[#163D2D]"
                  >
                    + 250g (₹130)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant("500g", 260)}
                    className="px-2 py-0.5 bg-white border border-[#E9E2CE] hover:border-[#174E37] rounded font-semibold text-[#163D2D]"
                  >
                    + 500g (₹260)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant("1kg", 500)}
                    className="px-2 py-0.5 bg-white border border-[#E9E2CE] hover:border-[#174E37] rounded font-semibold text-[#163D2D]"
                  >
                    + 1kg (₹500)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariant("350g", 199)}
                    className="px-2 py-0.5 bg-white border border-[#E9E2CE] hover:border-[#174E37] rounded font-semibold text-[#163D2D]"
                  >
                    + 350g (₹199)
                  </button>
                </div>

                {/* Variants Rows */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {productVariants.length === 0 ? (
                    <p className="text-center py-3 text-xs text-[#68786B] italic">
                      No custom weight options added yet. Default single size will be used.
                    </p>
                  ) : (
                    productVariants.map((variant, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#E9E2CE] shadow-sm"
                      >
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-[#68786B] block">Weight / Gram</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 250g"
                            value={variant.weight}
                            onChange={(e) => handleUpdateVariant(idx, "weight", e.target.value)}
                            className="w-full p-1.5 bg-[#FFF9EC] border rounded-lg text-xs font-bold text-[#163D2D]"
                          />
                        </div>
                        <div className="w-24">
                          <label className="text-[10px] font-bold text-[#68786B] block">Price (₹)</label>
                          <input
                            type="number"
                            required
                            placeholder="130"
                            value={variant.price}
                            onChange={(e) => handleUpdateVariant(idx, "price", Number(e.target.value))}
                            className="w-full p-1.5 bg-[#FFF9EC] border rounded-lg text-xs font-bold text-[#174E37]"
                          />
                        </div>
                        <div className="w-24">
                          <label className="text-[10px] font-bold text-[#68786B] block">MRP (₹)</label>
                          <input
                            type="number"
                            placeholder="160"
                            value={variant.originalPrice || ""}
                            onChange={(e) => handleUpdateVariant(idx, "originalPrice", Number(e.target.value))}
                            className="w-full p-1.5 bg-[#FFF9EC] border rounded-lg text-xs text-[#68786B]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="p-1.5 mt-3.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="font-bold block mb-1">Ingredients</label>
                <input
                  type="text"
                  value={newProductData.ingredients}
                  onChange={(e) => setNewProductData({ ...newProductData, ingredients: e.target.value })}
                  placeholder="e.g. Fresh Mangoes, Cold-Pressed Mustard Oil, Handcrafted Spices, Salt"
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-bold block mb-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={newProductData.shortDescription}
                  onChange={(e) => setNewProductData({ ...newProductData, shortDescription: e.target.value })}
                  className="w-full p-2.5 bg-[#FFF9EC] border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E9E2CE]">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="px-5 py-2.5 rounded-full border text-[#68786B] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-7 py-2.5 rounded-full bg-[#174E37] text-white font-bold hover:bg-[#0B4A32] shadow-md flex items-center gap-1.5 text-xs"
                >
                  {isUploadingImage
                    ? "Uploading Photo..."
                    : editingProductId
                    ? "Update Pickle Product"
                    : "Save Pickle Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
