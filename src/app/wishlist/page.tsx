"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useCartStore } from "@/app/store/cartStore";

export default function WishlistPage() {
  const wishlist = useWishlistStore((state) => state.wishlist) || []; // حماية من الـ undefined
  const removeItem = useWishlistStore((state) => state.removeItem);
  const hydrateWishlist = useWishlistStore((state) => state.hydrate);
  
  const addItemToCart = useCartStore((state) => state.addItem);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrateWishlist();
    setMounted(true);
  }, [hydrateWishlist]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-pulse text-gray-300 text-sm tracking-widest">LOADING...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Background blurs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-rose-50 opacity-50 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-rose-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb - غيرنا اللينك عشان يروح للهوم بدل الشوب */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-10">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Wishlist</span>
        </div>

        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-2">Your Collection</p>
          <h1 className="font-serif text-3xl font-light text-gray-900">Wishlist</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-3xl block mb-4 text-gray-200">✦</span>
            <p className="font-serif text-lg font-light text-gray-900 mb-2">Your wishlist is empty</p>
            <p className="text-xs text-gray-400 font-light mb-6">Save your favorite items for later</p>
            {/* غيرنا اللينك هنا يروح للهوم عشان ميجبش 404 */}
            <Link href="/" className="px-6 py-2.5 bg-gray-900 text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-stone-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[10px] text-gray-400 font-light mb-8">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlist.map((item: any) => (
                <div key={item.id} className="group bg-white border border-gray-100 hover:border-gray-300 transition-colors overflow-hidden relative">
                  <Link href={"/shop/" + item.id} className="block">
                    <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] text-rose-400 uppercase tracking-[0.2em] mb-1">{item.category}</p>
                      <p className="font-serif text-sm font-light text-gray-900 leading-snug mb-2">{item.name}</p>
                      <p className="text-sm font-medium text-gray-900">{item.price} EGP</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={() => {
                        addItemToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
                        removeItem(item.id);
                      }}
                      className="flex-1 py-2.5 bg-gray-900 text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-rose-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="px-3 py-2.5 border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-600 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}