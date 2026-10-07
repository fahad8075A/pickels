"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  Clock,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  RefreshCw,
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
}

export default function AdminDashboardClient({
  initialStats,
  initialOrders,
  initialProducts,
  categories,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "inventory">("overview");
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New product form modal state
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    sku: "",
    categoryId: categories[0]?.id || "",
    price: 199,
    originalPrice: 249,
    stock: 50,
    weight: "350g",
    ingredients: "Spices, Mustard Oil, Salt",
    image: "/images/products/mango-pickle.jpg",
  });

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
        setMessage({ text: "Inventory stock updated", type: "success" });
      }
    } catch {
      setMessage({ text: "Failed to update stock", type: "error" });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts([data.product, ...products]);
        setShowNewProductModal(false);
        setMessage({ text: "New pickle product added successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Product creation failed", type: "error" });
      }
    } catch {
      setMessage({ text: "Error creating product", type: "error" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast message */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2 text-sm shadow ${
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
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "overview"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Dashboard Metrics
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "orders"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "products"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === "inventory"
              ? "bg-[#174E37] text-[#FFF9EC]"
              : "bg-white text-[#163D2D] hover:bg-[#EFF1DC]"
          }`}
        >
          Stock & Inventory
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
                  {initialStats.totalOrders}
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
                  {initialStats.lowStockCount}
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
              onClick={() => setShowNewProductModal(true)}
              className="px-4 py-2 bg-[#174E37] text-[#FFF9EC] rounded-full text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Pickle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-[#E9E2CE] bg-[#FFF9EC]/40 space-y-3"
              >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white border border-[#E9E2CE]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#163D2D]">{p.name}</h4>
                  <p className="text-xs text-[#68786B] font-mono">SKU: {p.sku}</p>
                  <p className="font-serif font-bold text-lg text-[#174E37] mt-1">₹{p.price}</p>
                  <p className="text-xs text-[#68786B]">In Stock: <strong>{p.stock}</strong> jars</p>
                </div>
              </div>
            ))}
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

      {/* New Product Modal */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E9E2CE] shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-2xl text-[#163D2D]">Add New Pickle Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductData.name}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full p-2 bg-[#FFF9EC] border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={newProductData.slug}
                  onChange={(e) => setNewProductData({ ...newProductData, slug: e.target.value })}
                  className="w-full p-2 bg-[#FFF9EC] border rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductData.price}
                    onChange={(e) => setNewProductData({ ...newProductData, price: Number(e.target.value) })}
                    className="w-full p-2 bg-[#FFF9EC] border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Stock Jars</label>
                  <input
                    type="number"
                    required
                    value={newProductData.stock}
                    onChange={(e) => setNewProductData({ ...newProductData, stock: Number(e.target.value) })}
                    className="w-full p-2 bg-[#FFF9EC] border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={newProductData.shortDescription}
                  onChange={(e) => setNewProductData({ ...newProductData, shortDescription: e.target.value })}
                  className="w-full p-2 bg-[#FFF9EC] border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="px-4 py-2 rounded-full border text-[#68786B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#174E37] text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
