export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-red-100 via-rose-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-red-200 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-rose-200 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-rose-700 font-medium tracking-[0.3em] uppercase mb-4 animate-slide-down text-sm">Our Partnership</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
            Powered by <span className="text-red-700">PTG China</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 animate-fade-in font-light max-w-2xl mx-auto">
            Bringing world-class Chinese beauty innovations and wellness products to your doorstep.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80" alt="PTG Beauty" className="rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500" />
            </div>
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">A Global Legacy, A Local Promise</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                As a proud partner of PTG China, a global leader in health, beauty, and wellness, I bring you a curated selection of products that combine ancient Eastern botanical wisdom with cutting-edge scientific research.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                PTG has empowered millions worldwide through its direct-selling model, offering premium quality at accessible prices. My mission is to deliver this same transformative experience directly to you, with personalized service and trusted advice.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Why Shop With Me?</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                When you buy through my platform, you are not just getting exceptional PTG products, you are getting a dedicated beauty consultant. I provide personalized skincare routines, exclusive member discounts, and 1-on-1 support to help you achieve your beauty goals.
              </p>
              <div className="flex space-x-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-red-700">100%</div>
                  <div className="text-sm text-gray-500 mt-1">Authentic PTG</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-red-700">1-on-1</div>
                  <div className="text-sm text-gray-500 mt-1">Consultation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-red-700">VIP</div>
                  <div className="text-sm text-gray-500 mt-1">Member Prices</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80" alt="Personal Consultant" className="rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-gradient-to-b from-nude-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-16">The PTG Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 text-center border border-rose-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
              <span className="text-5xl block mb-6 group-hover:scale-110 transition-transform">🔬</span>
              <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Scientific Innovation</h3>
              <p className="text-gray-600 leading-relaxed">Advanced formulas developed in state-of-the-art Chinese laboratories, blending traditional herbs with modern science.</p>
            </div>
            <div className="bg-white rounded-3xl p-10 text-center border border-rose-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
              <span className="text-5xl block mb-6 group-hover:scale-110 transition-transform">🌱</span>
              <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Natural Ingredients</h3>
              <p className="text-gray-600 leading-relaxed">Ethically sourced botanicals from pristine environments, ensuring purity and potency in every drop.</p>
            </div>
            <div className="bg-white rounded-3xl p-10 text-center border border-rose-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
              <span className="text-5xl block mb-6 group-hover:scale-110 transition-transform">🤝</span>
              <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Empowering Community</h3>
              <p className="text-gray-600 leading-relaxed">Join a network of entrepreneurs. Build your business with full training, support, and financial freedom.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}