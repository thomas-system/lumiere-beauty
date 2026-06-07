"use client";

import { useState, useEffect } from "react";
import { useWishlistStore } from "../store/wishlistStore";

const initialItems = [
  { id: 1, name: "Rose Petal Hydrating Serum", price: 68, comparePrice: 85, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", category: "Skincare" },
  { id: 2, name: "Velvet Matte Lipstick", price: 32, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", category: "Makeup" },
  { id: 3, name: "Midnight Rose Eau de Parfum", price: 120, comparePrice: 145, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80", category: "Fragrances" },
  { id: 4, name: "Vitamin C Radiance Cream", price: 75, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&q=80", category: "Skincare" },
  { id: 5, name: "Luminous Highlighter Palette", price: 48, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80", category: "Makeup" },
  { id: 6, name: "Argan Oil Repair Shampoo", price: 32, image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80", category: "Hair Care" },
  { id: 7, name: "Shea Butter Body Lotion", price: 28, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80", category: "Body Care" },
  { id: 8, name: "Ultimate Skincare Gift Set", price: 165, comparePrice: 210, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80", category: "Gift Sets" },
];

export default function WishlistPage() {
  const { removeItem, setCount } = useWishlistStore();
  
  const [items, setItems] = useState(initialItems);
  const [isLoaded, setIsLoaded] = useState(false);

  // لما الصفحة تفتح، بيجيب المنتجات المحفوظة من الذاكرة
  useEffect(() => {
    const savedItems = localStorage.getItem('wishlistItems');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems);
      setCount(parsedItems.length); // يظبط الرقم فوق القلب على حسب المنتجات المحفوظة
    }
    setIsLoaded(true);
  }, []);

  const handleRemove = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    removeItem(); // يقلل الرقم اللي فوق القلب
    localStorage.setItem('wishlistItems', JSON.stringify(newItems)); // يحفظ المنتجات الجديدة في الذاكرة
  };

  if (!isLoaded) return null; // يستنى لحد ما البيانات تتحمل

  return (
    <div className="animate-fade-in min-h-screen bg-pink-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            My <span className="text-pink-600">Wishlist</span> 💖
          </h1>
          <p className="text-gray-500 text-lg">Products you absolutely adore</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-pink-100">
            <span className="text-6xl block mb-6">🤍</span>
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Explore our collection and save your favorites!</p>
            <a href="/shop" className="bg-pink-600 text-white px-8 py-3 rounded-full font-medium hover:bg-pink-700 transition-all shadow-md hover:shadow-lg">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-pink-100 overflow-hidden group hover:shadow-xl hover:border-pink-200 transition-all duration-300 relative">
                
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 text-pink-300 transition-all shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="relative overflow-hidden aspect-square bg-pink-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.comparePrice && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      SALE
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <p className="text-[10px] text-pink-400 font-semibold uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="font-serif font-semibold text-gray-900 leading-tight mb-3 text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">${item.price}</span>
                      {item.comparePrice && <span className="text-xs text-gray-400 line-through">${item.comparePrice}</span>}
                    </div>
                    <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}