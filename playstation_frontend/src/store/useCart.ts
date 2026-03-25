import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],
  setItems: (items: any) => set({ items }),
  total: () => {
    const state = useCart.getState() as any;
    return state.items.reduce((acc: number, item: any) => {
      // Handle both backend structure (item.product.price) and frontend structure (item.price)
      const price = item.product?.price || item.price || 0;
      return acc + (price * item.quantity);
    }, 0);
  }
}));
