import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSizeSurcharge, PERSONALIZATION_PRICE } from '@/lib/constants';

export interface CartItem {
  cartItemId: string; // unique ID for the cart instance
  productId: number;
  name: string;
  category: string;
  basePrice: number;
  price3?: number | null;
  price5?: number | null;
  size: string;
  quantity: number;
  imageUrl?: string | null;
  personalization?: {
    name: string;
    number: string;
  } | null;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotalItems: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (item) => {
        set((state) => {
          // Check if identical item exists (same product, size, personalization)
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              JSON.stringify(i.personalization) === JSON.stringify(item.personalization)
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems, isDrawerOpen: true };
          }

          const newItem = {
            ...item,
            cartItemId: crypto.randomUUID(),
          };
          return { items: [...state.items, newItem], isDrawerOpen: true };
        });
      },
      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),
      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'wm-sports-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

export function calculateItemUnitPrice(item: CartItem): number {
  let base = item.basePrice;
  
  // Apply quantity discounts if applicable for THIS specific item stack
  if (item.quantity >= 5 && item.price5) {
    base = item.price5;
  } else if (item.quantity >= 3 && item.price3) {
    base = item.price3;
  }

  const sizeSurcharge = getSizeSurcharge(item.size);
  const persSurcharge = item.personalization ? PERSONALIZATION_PRICE : 0;

  return base + sizeSurcharge + persSurcharge;
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (calculateItemUnitPrice(item) * item.quantity);
  }, 0);
}
