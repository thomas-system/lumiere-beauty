"use client";

import { useState, useEffect } from "react";
import { useWishlistStore } from "../store/wishlistStore";
import Link from "next/link";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count, hydrate } = useWishlistStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-1.5 px-4 text-center text-[10px] tracking-[0.3em] uppercase font-medium">
        Complimentary Shipping on Orders Over 500 EGP
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            
            <Link href="/" className="text-2xl font-serif font-medium text-gray-900 tracking-[0.15em]">
              LUMIÈRE
            </Link>

            <nav className="hidden lg:flex items-center space-x-10">
              <Link href="/" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">Home</Link>
              <Link href="/shop" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">Shop</Link>
              <Link href="/categories" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">Categories</Link>
              <Link href="/about" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">Our Story</Link>
            </nav>
            
            <div className="flex items-center space-x-5">
              
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>

              <Link href="/wishlist" className="text-gray-400 hover:text-gray-900 transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">{count}</span>
                )}
              </Link>

              <Link href="/login" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
            </div>
          </div>

          {isSearchOpen && (
            <div className="pb-4 animate-slide-down">
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full text-center bg-gray-50 border-0 focus:outline-none focus:ring-0 text-sm py-3 placeholder-gray-400 tracking-widest text-xs uppercase"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim() !== '') { window.location.href = `/shop?search=${searchQuery}`; } }}
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
}