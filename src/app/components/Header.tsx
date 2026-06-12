"use client";

import { useState, useEffect, useRef } from "react";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import { useLanguage } from "./LanguageContext";
import Link from "next/link";
import CartDrawer from "./CartDrawer";

interface UserData {
  firstName: string;
  profileImage: string;
  loggedIn: boolean;
}

const ALL_PRODUCTS = [
  { id: 1,  nameEn: "Ageless Radiance Serum", nameAr: "سيروم الإشراق الخالد",   price: 450, category: "Skincare",  image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80" },
  { id: 2,  nameEn: "Golden Hour Oil",        nameAr: "زيت الساعة الذهبية",     price: 380, category: "Skincare",  image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80" },
  { id: 3,  nameEn: "Midnight Repair Cream",  nameAr: "كريم الإصلاح الليلي",    price: 520, category: "Skincare",  image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80" },
  { id: 4,  nameEn: "Silk Foundation",        nameAr: "أساس الحرير",            price: 290, category: "Makeup",    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500&q=80" },
  { id: 5,  nameEn: "Velvet Matte Lipstick",  nameAr: "أحمر شفاه مخملي مات",    price: 180, category: "Makeup",    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80" },
  { id: 6,  nameEn: "Bronze Glow Powder",     nameAr: "بودرة البرونز المضيء",   price: 340, category: "Makeup",    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80" },
  { id: 7,  nameEn: "Rose Water Mist",        nameAr: "بخاخ ماء الورد",         price: 150, category: "Skincare",  image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80" },
  { id: 8,  nameEn: "Cashmere Body Lotion",   nameAr: "لوشن جسم الكشمير",       price: 220, category: "Body",      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80" },
  { id: 9,  nameEn: "Royal Oud Parfum",       nameAr: "عطر العود الملكي",       price: 750, category: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80" },
  { id: 10, nameEn: "Ivory Eye Palette",      nameAr: "باليت عيون العاج",       price: 410, category: "Makeup",    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80" },
  { id: 11, nameEn: "Honey Cleansing Balm",   nameAr: "بلسم تنظيف العسل",       price: 275, category: "Skincare",  image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80" },
  { id: 12, nameEn: "Oud Wood Candle",        nameAr: "شمعة خشب العود",         price: 390, category: "Home",      image: "https://images.unsplash.com/photo-1602607750358-1e2b1bbd826d?w=500&q=80" },
];

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof ALL_PRODUCTS>([]);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  
  // استدعاء الـ Wishlist عادي زي ما هو
  const { count: wishlistCount, hydrate: hydrateWishlist } = useWishlistStore();
  
  // استدعاء الـ Cart بالطريقة الجديدة عشان تتوافق مع الـ Store بتاعنا
  const cartItems = useCartStore((state) => state.items);
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // عشان نتحكم في فتح الـ CartDrawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrateWishlist();
    
    // جلب الكارت من الـ localStorage وتمريره للـ hydrateCart
    const savedCart = localStorage.getItem("lumiere_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && Array.isArray(parsedCart)) {
          hydrateCart(parsedCart);
        }
      } catch (e) {}
    }

    const userData = localStorage.getItem("lumiere_user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.loggedIn) setLoggedInUser(parsed);
      } catch (e) {}
    }
  }, [hydrateWishlist, hydrateCart]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = ALL_PRODUCTS.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(q) ||
        p.nameAr.includes(searchQuery) ||
        p.category.toLowerCase().includes(q)
    );
    setSearchResults(results);
  }, [searchQuery]);

  const handleProductClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) { setSearchQuery(""); setSearchResults([]); }
  };

  function highlightMatch(text: string, query: string) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, index)}
        <span className="text-rose-500 font-medium">{text.slice(index, index + query.length)}</span>
        {text.slice(index + query.length)}
      </>
    );
  }

  return (
    <>
      {/* تمرير الـ Props للـ CartDrawer عشان يفتح ويقفل */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="bg-gray-900 text-white py-1.5 px-4 text-center text-[10px] tracking-[0.3em] uppercase font-medium">
        {t("Complimentary Shipping on Orders Over 500 EGP", "شحن مجاني للطلبات فوق ٥٠٠ جنيه")}
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors">
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

            <Link href="/" className="text-2xl font-serif font-medium text-gray-900 tracking-[0.15em]">
              LUMIÈRE
            </Link>

            <nav className="hidden lg:flex items-center space-x-10">
              <Link href="/" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">{t("Home", "الرئيسية")}</Link>
              <Link href="/shop" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">{t("Shop", "المتجر")}</Link>
              <Link href="/categories" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">{t("Categories", "الأقسام")}</Link>
              <Link href="/about" className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors tracking-[0.2em] uppercase">{t("Our Story", "قصتنا")}</Link>
            </nav>

            <div className="flex items-center space-x-5">

              {/* زرار اللغة */}
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="text-[10px] font-bold tracking-widest border border-gray-200 px-2.5 py-1 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                {language === "en" ? "ع" : "EN"}
              </button>

              <button onClick={handleSearchToggle} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>

              <Link href="/wishlist" className="text-gray-400 hover:text-gray-900 transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">{wishlistCount}</span>}
              </Link>

              {/* تعديل زرار الكارت عشان يفتح الـ Drawer */}
              <button onClick={() => setIsCartOpen(true)} className="text-gray-400 hover:text-gray-900 transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">{cartCount}</span>}
              </button>

              {loggedInUser ? (
                <Link href="/account" className="relative group">
                  <img src={loggedInUser.profileImage} alt={loggedInUser.firstName} className="h-7 w-7 rounded-full object-cover border border-nude-200 group-hover:border-nude-400 transition-colors" />
                </Link>
              ) : (
                <Link href="/signup" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
              )}
            </div>
          </div>

          {isSearchOpen && (
            <div ref={searchRef} className="pb-4 animate-slide-down relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("Search for products...", "ابحث عن منتج...")}
                  className="w-full text-center bg-gray-50 border-0 focus:outline-none text-sm py-3 placeholder-gray-400 tracking-widest text-xs uppercase"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) window.location.href = "/shop?search=" + searchQuery;
                    if (e.key === "Escape") { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              {searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full bg-white border border-gray-100 shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-xs text-gray-400 font-light tracking-widest uppercase">{t("No products found", "لا توجد منتجات")}</p>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-gray-300 font-medium">
                          {searchResults.length} {t("results", "نتائج")}
                        </p>
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.id}`}
                          onClick={handleProductClick}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
                        >
                          <div className="w-10 h-12 shrink-0 overflow-hidden bg-gray-100">
                            <img src={product.image} alt={product.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] text-rose-400 uppercase tracking-[0.2em] mb-0.5">{product.category}</p>
                            <p className="text-xs font-serif font-light text-gray-900 truncate">
                              {highlightMatch(product.nameEn, searchQuery)}
                            </p>
                            <p className="text-[10px] text-gray-400 font-light truncate mt-0.5">{product.nameAr}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs font-medium text-gray-900">{product.price} EGP</p>
                          </div>
                        </Link>
                      ))}
                      <div className="px-4 py-3 bg-gray-50">
                        <Link href={`/shop?search=${searchQuery}`} onClick={handleProductClick} className="text-[9px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
                          {t("View all results for", "عرض كل نتائج")} "{searchQuery}"
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-down">
            <nav className="flex flex-col py-4 px-6 space-y-1">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[11px] text-gray-500 hover:text-gray-900 font-medium tracking-[0.2em] uppercase border-b border-nude-50">{t("Home", "الرئيسية")}</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[11px] text-gray-500 hover:text-gray-900 font-medium tracking-[0.2em] uppercase border-b border-nude-50">{t("Shop", "المتجر")}</Link>
              <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[11px] text-gray-500 hover:text-gray-900 font-medium tracking-[0.2em] uppercase border-b border-nude-50">{t("Categories", "الأقسام")}</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[11px] text-gray-500 hover:text-gray-900 font-medium tracking-[0.2em] uppercase border-b border-nude-50">{t("Our Story", "قصتنا")}</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[11px] text-gray-500 hover:text-gray-900 font-medium tracking-[0.2em] uppercase border-b border-nude-50">{t("My Account", "حسابي")}</Link>
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="py-3 text-[11px] text-rose-500 hover:text-rose-700 font-medium tracking-[0.2em] uppercase border-b border-nude-50 text-left"
              >
                {language === "en" ? "🌐 العربية" : "🌐 English"}
              </button>
              {loggedInUser ? (
                <button onClick={() => { localStorage.setItem("lumiere_user", JSON.stringify({ ...JSON.parse(localStorage.getItem("lumiere_user") || "{}"), loggedIn: false })); window.location.href = "/"; }} className="py-3 text-[11px] text-red-400 hover:text-red-600 font-medium tracking-[0.2em] uppercase text-left">{t("Sign Out", "تسجيل الخروج")}</button>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[11px] text-gray-500 hover:text-gray-900 font-medium tracking-[0.2em] uppercase">{t("Sign In", "تسجيل الدخول")}</Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}