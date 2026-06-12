"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";

const featuredProducts = [
  { id: 1, name: "Ageless Radiance Serum", price: 68, comparePrice: 85, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", category: "Skincare" },
  { id: 2, name: "Velvet Matte Lipstick", price: 32, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", category: "Makeup" },
  { id: 3, name: "Royal Oud Parfum", price: 120, comparePrice: 145, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80", category: "Fragrances" },
  { id: 4, name: "Vitamin C Glow Cream", price: 75, image: "https://images.unsplash.com/photo-1570194065650-d99fb4ee21ff?w=500&q=80", category: "Skincare" },
];

const REVIEWS = [
  { name: "Sarah M.", city: "Cairo", text: "The Ageless Radiance Serum completely transformed my skin!", rating: 5 },
  { name: "Nour A.", city: "Alexandria", text: "Best lipstick I've ever used. Stays all day.", rating: 5 },
  { name: "Yasmine K.", city: "Giza", text: "The Royal Oud lasts all day. Absolutely love it!", rating: 5 },
  { name: "Huda S.", city: "Mansoura", text: "Fast delivery and authentic products.", rating: 4 },
];

const INSTAGRAM = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1570194065650-d99fb4ee21ff?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=300&fit=crop",
];

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);
  const loyaltyPoints = useCartStore((state) => state.loyaltyPoints);
  const [user, setUser] = useState<any>(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const announcements = [
    "Complimentary Shipping on Orders Over 500 EGP",
    "New Arrivals — Discover Our Summer Collection",
    "20% Off Your First Order — Use Code WELCOME20",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("lumiere_user");
    if (userData) { try { const parsed = JSON.parse(userData); if (parsed.loggedIn) setUser(parsed); } catch (e) {} }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { setAnnouncementIdx((prev) => (prev + 1) % announcements.length); }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
  };

  return (
    <div className="animate-fade-in bg-white">
      <div className="bg-gray-900 text-white py-2 px-4 text-center overflow-hidden">
        <p className="text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-500" key={announcementIdx}>{announcements[announcementIdx]}</p>
      </div>

      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://z-cdn-media.chatglm.cn/files/23a50b1f-1a91-447f-977e-1b12bbfdbcb2.jpg?auth_key=1880855676-bf5bca0445c8469b836464657bee4e3c-0-9f47a8724c39bacba67ef0c9fa5a0805" alt="Hero" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p className="text-white/70 font-semibold tracking-[0.3em] uppercase text-[11px] mb-4">{user ? "Welcome Back" : "Advanced Skincare"}</p>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-white leading-[1.1] mb-6">
              {user ? (<>Hello, {user.firstName}<span className="block text-3xl md:text-5xl mt-2 text-white/80 font-light">Your journey continues</span></>) : (<>This skincare routine stays one step ahead of <span className="italic text-rose-300">aging!</span></>)}
            </h1>
            <p className="text-white/80 font-light leading-relaxed text-base mb-10">{user ? "Explore our latest collections and discover something beautiful today." : "Discover our scientifically formulated routines designed to keep your skin looking youthful, radiant, and healthy."}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/categories" className="bg-white text-gray-900 px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-rose-700 hover:text-white transition-all duration-500 border border-white">SHOP NOW</Link>
              {!user && <Link href="/signup" className="bg-transparent text-white px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-white/10 transition-all duration-500 border border-white/40">JOIN US</Link>}
            </div>
            <div className="flex flex-wrap gap-6 mt-8 items-center">
              <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg><span className="text-[10px] text-white/50 font-light">Free Shipping 500+ EGP</span></div>
              <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg><span className="text-[10px] text-white/50 font-light">100% Authentic</span></div>
              {user && <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg><span className="text-[10px] text-white/80 font-medium tracking-wider">{loyaltyPoints} Loyalty Points</span></div>}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-rose-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/70 tracking-[0.3em] uppercase text-[10px] font-semibold mb-4">Limited Time Offer</p>
          <h2 className="text-6xl md:text-8xl font-serif font-bold mb-6">UP TO 55% OFF</h2>
          <p className="text-white/80 font-light mb-8 max-w-xl mx-auto text-sm">Premium beauty at exceptional prices. Do not miss out on our exclusive seasonal sale.</p>
          <Link href="/shop" className="bg-white text-rose-700 px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 inline-block">SHOP THE SALE</Link>
        </div>
      </section>

      <section className="section-luxury bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-400 font-semibold tracking-[0.4em] uppercase mb-4 text-[10px]">Bestsellers</p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">Featured Products</h2>
            <div className="w-16 h-[1px] bg-gray-900 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={"/shop/" + product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[3/4] bg-white mb-5 shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  {product.comparePrice && <span className="absolute top-4 left-4 bg-rose-600 text-white text-[9px] font-bold px-3 py-1.5 tracking-[0.15em]">SALE</span>}
                  <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-900 hover:text-white text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
                  <button onClick={(e) => handleAddToCart(e, product)} className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-2.5 text-[9px] tracking-[0.2em] uppercase font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-900 hover:text-white">Add to Cart</button>
                </div>
                <p className="text-[9px] text-rose-500 font-semibold uppercase tracking-[0.2em] mb-2">{product.category}</p>
                <h3 className="font-serif font-medium text-gray-900 leading-snug mb-3 text-sm">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">{product.price} EGP</span>
                  {product.comparePrice && <span className="text-xs text-gray-300 line-through">{product.comparePrice} EGP</span>}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-16"><Link href="/shop" className="btn-secondary inline-block">VIEW ALL PRODUCTS</Link></div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14"><p className="text-gray-400 font-semibold tracking-[0.4em] uppercase mb-4 text-[10px]">Explore</p><h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">Shop by Category</h2><div className="w-16 h-[1px] bg-gray-900 mx-auto mt-6"></div></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ name: "Skincare", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop", href: "/shop?category=Skincare" },{ name: "Makeup", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop", href: "/shop?category=Makeup" },{ name: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop", href: "/shop?category=Fragrance" },{ name: "Body Care", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=500&fit=crop", href: "/shop?category=Body" }].map((cat) => (
              <Link key={cat.name} href={cat.href} className="group relative aspect-[3/4] overflow-hidden"><img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" /><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-white font-serif text-2xl font-light tracking-wider">{cat.name}</span><span className="mt-2 text-[9px] tracking-[0.2em] uppercase text-white/70 font-medium border-b border-white/30 pb-px group-hover:border-white/70 transition-colors">Shop Now</span></div></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-rose-300 font-semibold tracking-[0.4em] uppercase text-[10px] mb-4">Loyalty Program</p>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight mb-6">Earn Points.<br/>Get Rewarded.</h2>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-8">Shop your favorites and earn 1 Loyalty Point for every 20 EGP spent. Redeem your points at checkout (1 Point = 0.5 EGP) for exclusive discounts.</p>
              {user ? (<div className="bg-white/5 border border-white/10 p-6 inline-block backdrop-blur-sm"><p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-2">Your Available Balance</p><div className="flex items-baseline gap-2"><span className="text-4xl font-serif text-rose-300">{loyaltyPoints}</span><span className="text-xs text-white/50 font-light tracking-wider">POINTS</span></div><p className="text-[10px] text-gray-500 font-light mt-2">Worth {(loyaltyPoints * 0.5)} EGP on your next order</p></div>) : (<Link href="/signup" className="bg-white text-gray-900 px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-rose-700 hover:text-white transition-all duration-500 border border-white inline-block">JOIN TO START EARNING</Link>)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ step: "1", title: "Shop", desc: "Browse and purchase your favorite beauty products" },{ step: "2", title: "Earn", desc: "Get 1 Point for every 20 EGP you spend" },{ step: "3", title: "Redeem", desc: "Use your points (1 Point = 0.5 EGP) at checkout" },{ step: "★", title: "Save", desc: "Enjoy premium beauty for less, every time" }].map((item) => (
                <div key={item.step} className="border border-white/10 p-6 hover:border-rose-300/30 transition-colors duration-500"><span className="text-rose-300/50 text-2xl font-serif block mb-3">{item.step}</span><p className="text-[11px] text-white font-medium tracking-[0.15em] uppercase mb-2">{item.title}</p><p className="text-[10px] text-gray-500 font-light leading-relaxed">{item.desc}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14"><p className="text-gray-400 font-semibold tracking-[0.4em] uppercase mb-4 text-[10px]">Testimonials</p><h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">What Our Customers Say</h2><div className="w-16 h-[1px] bg-gray-900 mx-auto mt-6"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, idx) => (<div key={idx} className="bg-white border border-gray-100 p-6"><div className="flex gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => (<svg key={i} xmlns="http://www.w3.org/2000/svg" className={"h-3 w-3 " + (i < review.rating ? "text-yellow-500" : "text-gray-200")} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>))}</div><p className="text-sm text-gray-600 font-light leading-relaxed mb-4">"{review.text}"</p><div className="border-t border-gray-50 pt-3"><p className="text-xs font-medium text-gray-900">{review.name}</p><p className="text-[10px] text-gray-400 font-light">{review.city}</p></div></div>))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10"><p className="text-gray-400 font-semibold tracking-[0.4em] uppercase mb-4 text-[10px]">@lumiere.beauty</p><h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">Follow Us on Instagram</h2><div className="w-16 h-[1px] bg-gray-900 mx-auto mt-6"></div></div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {INSTAGRAM.map((img, idx) => (<a key={idx} href="#" className="group aspect-square overflow-hidden relative"><img src={img} alt="Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div></a>))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-900 p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5"><svg viewBox="0 0 200 200" fill="currentColor" className="text-white"><circle cx="100" cy="100" r="80" /></svg></div>
            <span className="text-rose-300 text-sm block mb-3">✦</span><h2 className="font-serif text-2xl md:text-3xl font-light text-white mb-3">Stay in the Light</h2><p className="text-[11px] text-gray-400 font-light tracking-wider max-w-md mx-auto mb-2">Subscribe to receive exclusive offers, new arrivals, and beauty tips</p><p className="text-[10px] text-gray-500 font-light mb-8">Get 10% off your first order</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"><input type="email" placeholder="Your email address" className="flex-1 bg-transparent border-b border-gray-700 py-3 text-sm font-light text-white placeholder:text-gray-600 outline-none focus:border-gray-500 transition-colors" /><button type="submit" className="px-8 py-3 bg-white text-gray-900 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-rose-700 hover:text-white transition-colors">Subscribe</button></form>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div><div className="flex items-center gap-2 mb-4"><span className="text-rose-300 text-sm">✦</span><span className="font-serif text-lg font-light text-gray-900 tracking-widest">LUMIÈRE</span></div><p className="text-[11px] text-gray-400 font-light leading-relaxed mb-6">Luxury skincare and beauty crafted for you.</p></div>
            <div><p className="text-[10px] tracking-[0.2em] uppercase text-gray-900 font-medium mb-4">Shop</p><div className="space-y-2"><Link href="/shop" className="block text-[11px] text-gray-400 hover:text-gray-900 font-light transition-colors">All Products</Link><Link href="/shop?category=Skincare" className="block text-[11px] text-gray-400 hover:text-gray-900 font-light transition-colors">Skincare</Link><Link href="/shop?category=Makeup" className="block text-[11px] text-gray-400 hover:text-gray-900 font-light transition-colors">Makeup</Link></div></div>
            <div><p className="text-[10px] tracking-[0.2em] uppercase text-gray-900 font-medium mb-4">Help</p><div className="space-y-2"><Link href="/shipping" className="block text-[11px] text-gray-400 hover:text-gray-900 font-light transition-colors">Shipping & Delivery</Link><Link href="/about" className="block text-[11px] text-gray-400 hover:text-gray-900 font-light transition-colors">About Us</Link><a href="#" className="block text-[11px] text-gray-400 hover:text-gray-900 font-light transition-colors">Return Policy</a></div></div>
            <div><p className="text-[10px] tracking-[0.2em] uppercase text-gray-900 font-medium mb-4">Contact</p><div className="space-y-3"><p className="text-[11px] text-gray-400 font-light">support@lumiere.com</p><p className="text-[11px] text-gray-400 font-light" dir="ltr">+20 1207420048</p></div></div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-[10px] text-gray-300 font-light tracking-wider">&copy; 2026 Lumiere Beauty. All rights reserved.</p></div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 400); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  if (!visible) return null;
  return (<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-gray-900 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-lg" aria-label="Back to top"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" /></svg></button>);
}