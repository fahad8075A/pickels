import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  weight: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, weight?: string) => void;
  updateQuantity: (productId: string, quantity: number, weight?: string) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: "",

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const itemWeight = product.weight || "Standard";
          const existing = state.items.find(
            (i) => i.productId === product.productId && (i.weight || "Standard") === itemWeight
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.productId && (i.weight || "Standard") === itemWeight
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...product, weight: itemWeight, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, weight?: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && (!weight || i.weight === weight))
          ),
        }));
      },

      updateQuantity: (productId, quantity, weight?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, weight);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && (!weight || i.weight === weight)
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: "" }),

      setCouponCode: (couponCode) => set({ couponCode }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "zezty-pickles-cart",
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode }),
    }
  )
);
