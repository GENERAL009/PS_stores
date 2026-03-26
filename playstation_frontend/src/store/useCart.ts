import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  items: any[];
  setItems: (items: any[]) => void;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get: any) => ({
      items: [],
      setItems: (items: any) => set({ items }),
      total: () => {
        const state = get();
        return state.items.reduce((acc: number, item: any) => {
          const price = item.product?.price || item.price || 0;
          return acc + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'ps-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
