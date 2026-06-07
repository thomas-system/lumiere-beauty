import { create } from 'zustand'

interface WishlistState {
  count: number;
  hydrated: boolean;
  addItem: () => void;
  removeItem: () => void;
  setCount: (count: number) => void;
  hydrate: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  count: 8, // الرقم الافتراضي للسيرفر
  hydrated: false,
  
  hydrate: () => {
    if (typeof window !== 'undefined' && !get().hydrated) {
      const savedCount = localStorage.getItem('wishlistCount');
      if (savedCount) {
        set({ count: parseInt(savedCount), hydrated: true });
      } else {
        set({ hydrated: true });
      }
    }
  },
  
  addItem: () => set((state) => {
    const newCount = state.count + 1;
    if (typeof window !== 'undefined') localStorage.setItem('wishlistCount', newCount.toString());
    return { count: newCount };
  }),
  
  removeItem: () => set((state) => {
    const newCount = Math.max(0, state.count - 1);
    if (typeof window !== 'undefined') localStorage.setItem('wishlistCount', newCount.toString());
    return { count: newCount };
  }),

  setCount: (count: number) => set(() => {
    if (typeof window !== 'undefined') localStorage.setItem('wishlistCount', count.toString());
    return { count };
  }),
}))