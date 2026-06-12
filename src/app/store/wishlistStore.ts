import { create } from 'zustand'

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  hydrated: boolean;
  hydrate: () => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    if (typeof window !== 'undefined' && !get().hydrated) {
      const saved = localStorage.getItem('wishlistItems');
      if (saved) set({ items: JSON.parse(saved), hydrated: true });
      else set({ hydrated: true });
    }
  },

  addItem: (item) => set((state) => {
    if (state.items.find(i => i.id === item.id)) return state;
    const items = [...state.items, item];
    if (typeof window !== 'undefined') localStorage.setItem('wishlistItems', JSON.stringify(items));
    return { items };
  }),

  removeItem: (id) => set((state) => {
    const items = state.items.filter(i => i.id !== id);
    if (typeof window !== 'undefined') localStorage.setItem('wishlistItems', JSON.stringify(items));
    return { items };
  }),

  isInWishlist: (id) => get().items.some(i => i.id === id),
  count: () => get().items.length,
}))