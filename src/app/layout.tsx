import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Lumière Beauty | Premium Cosmetics & Skincare",
  description: "Discover luxurious skincare, makeup, and fragrances. Illuminate your natural beauty with Lumière Paris.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-white text-gray-800">
        
        <Header />

        <main className="flex-grow">
          {children}
        </main>

        {/* Chanel Style Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1">
                <h2 className="text-2xl font-serif font-medium mb-4 tracking-wider">LUMIÈRE</h2>
                <p className="text-gray-400 text-sm leading-relaxed font-light">Official PTG China Partner. Premium beauty delivered to Egypt.</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-6 uppercase tracking-[0.3em] text-gray-400">Collections</h3>
                <ul className="space-y-3">
                  <li><a href="/categories/skincare" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Skincare</a></li>
                  <li><a href="/categories/makeup" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Makeup</a></li>
                  <li><a href="/categories/fragrances" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Fragrances</a></li>
                  <li><a href="/categories/gift-sets" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Gift Sets</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-6 uppercase tracking-[0.3em] text-gray-400">Client Care</h3>
                <ul className="space-y-3">
                  <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm font-light">FAQ</a></li>
                  <li><a href="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Shipping</a></li>
                  <li><a href="/return-policy" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Returns</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-6 uppercase tracking-[0.3em] text-gray-400">Join PTG</h3>
                <ul className="space-y-3">
                  <li><a href="/signup" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Become a Partner</a></li>
                  <li><a href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-light">Sign In</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-xs tracking-widest uppercase">
              <p>&copy; 2026 Lumière Beauty. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}