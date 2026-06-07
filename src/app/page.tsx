import Link from 'next/link';

const featuredProducts = [
  { id: 1, name: "Ageless Radiance Serum", price: 68, comparePrice: 85, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", category: "Skincare" },
  { id: 2, name: "Velvet Matte Lipstick", price: 32, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", category: "Makeup" },
  { id: 3, name: "Royal Oud Parfum", price: 120, comparePrice: 145, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80", category: "Fragrances" },
  { id: 4, name: "Vitamin C Glow Cream", price: 75, image: "https://images.unsplash.com/photo-1570194065650-d99fb4ee21ff?w=500&q=80", category: "Skincare" },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in bg-white">
      
      {/* HERO SECTION - Full Width (Edge to Edge) */}
      <section className="relative h-screen flex items-center overflow-hidden">
        
        {/* الصورة بعرض الصفحة بالكامل من غير أي حواف */}
        <div className="absolute inset-0">
          <img 
            src="https://z-cdn-media.chatglm.cn/files/23a50b1f-1a91-447f-977e-1b12bbfdbcb2.jpg?auth_key=1880855676-bf5bca0445c8469b836464657bee4e3c-0-9f47a8724c39bacba67ef0c9fa5a0805" 
            alt="Blonde applying lip gloss" 
            className="w-full h-full object-cover object-center"
          />
          {/* التدرج اللوني عشان الكلام يبان فخم */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* الكلام متوسط ومنظم عشان الصفحة تبقى سيمترية */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p className="text-white/70 font-semibold tracking-[0.3em] uppercase text-[11px] mb-4">Advanced Skincare</p>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-white leading-[1.1] mb-6">
              This skincare routine stays one step ahead of <span className="italic text-rose-300">aging!</span>
            </h1>
            <p className="text-white/80 font-light leading-relaxed text-base mb-10">
              Discover our scientifically formulated routines designed to keep your skin looking youthful, radiant, and healthy.
            </p>
            <Link href="/shop" className="bg-white text-gray-900 px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-rose-700 hover:text-white transition-all duration-500 border border-white">
              SHOP NOW
            </Link>
          </div>
        </div>

      </section>

      {/* PROMO BANNER - Up to 55% OFF */}
      <section className="bg-rose-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/70 tracking-[0.3em] uppercase text-[10px] font-semibold mb-4">Limited Time Offer</p>
          <h2 className="text-6xl md:text-8xl font-serif font-bold mb-6">UP TO 55% OFF</h2>
          <p className="text-white/80 font-light mb-8 max-w-xl mx-auto text-sm">
            Premium beauty at exceptional prices. Do not miss out on our exclusive seasonal sale.
          </p>
          <Link href="/shop" className="bg-white text-rose-700 px-10 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 inline-block">
            SHOP THE SALE
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS GRID - Symmetrical & Centered */}
      <section className="section-luxury bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <p className="text-gray-400 font-semibold tracking-[0.4em] uppercase mb-4 text-[10px]">Bestsellers</p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">Featured Products</h2>
            <div className="w-16 h-[1px] bg-gray-900 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[3/4] bg-white mb-5 shadow-sm">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  {product.comparePrice && (
                    <span className="absolute top-4 left-4 bg-rose-600 text-white text-[9px] font-bold px-3 py-1.5 tracking-[0.15em]">SALE</span>
                  )}
                  <button className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-900 hover:text-white text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
                <p className="text-[9px] text-rose-500 font-semibold uppercase tracking-[0.2em] mb-2">{product.category}</p>
                <h3 className="font-serif font-medium text-gray-900 leading-snug mb-3 text-sm">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">{product.price} EGP</span>
                  {product.comparePrice && <span className="text-xs text-gray-300 line-through">{product.comparePrice} EGP</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/shop" className="btn-secondary inline-block">
              VIEW ALL PRODUCTS
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}