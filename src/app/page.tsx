import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-[#fdf8f5] px-4 text-center">
        <h1 className="text-5xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
          Glōra Beauty
        </h1>
        <p className="text-xl text-[#666] mb-2">
          جمالك، أولويتنا
        </p>
        <p className="text-sm text-[#999] mb-8">
          أفضل منتجات التجميل للبشرة الشرقية
        </p>
        <div className="flex gap-4">
          <Link
            href="/shop"
            className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#333] transition-colors"
          >
            تسوقي الآن
          </Link>
          <Link
            href="/about"
            className="border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
          >
            عن Glōra
          </Link>
        </div>
      </section>
    </main>
  )
}