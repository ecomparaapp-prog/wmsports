import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSizeSurcharge, PERSONALIZATION_PRICE, SPONSORS_PRICE } from '@/lib/constants';

export interface CartItem {
  cartItemId: string;
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
  sponsors?: boolean;
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
  getTotalItems: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              JSON.stringify(i.personalization) === JSON.stringify(item.personalization) &&
              !!i.sponsors === !!item.sponsors
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
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// totalCartItems: total quantity of all items in cart (for cross-product discount)
export function calculateItemUnitPrice(item: CartItem, totalCartItems?: number): number {
  let base = item.basePrice;

  // Apply discount based on TOTAL cart items, not just this item's qty
  const count = totalCartItems ?? item.quantity;
  if (count >= 5 && item.price5) {
    base = item.price5;
  } else if (count >= 3 && item.price3) {
    base = item.price3;
  }

  const sizeSurcharge = getSizeSurcharge(item.size);
  const persSurcharge = item.personalization ? PERSONALIZATION_PRICE : 0;
  const sponsorsSurcharge = item.sponsors ? SPONSORS_PRICE : 0;

  return base + sizeSurcharge + persSurcharge + sponsorsSurcharge;
}

export function calculateCartTotal(items: CartItem[]): number {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  return items.reduce((total, item) => {
    return total + (calculateItemUnitPrice(item, totalItems) * item.quantity);
  }, 0);
}

export function getCartTotalItems(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
