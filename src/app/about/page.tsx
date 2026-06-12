"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageContext";

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <main className="min-h-screen bg-nude-50 relative overflow-hidden" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-nude-200 opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-nude-300 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-nude-300 font-medium mb-2">
            {t("Our Story", "قصتنا")}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-gray-900 mb-6">
            {t("About Lumière", "عن لوميير")}
          </h1>
          <div className="w-16 h-px bg-nude-300 mx-auto mb-8" />
          <p className="text-sm text-nude-300 font-light leading-relaxed max-w-2xl mx-auto">
            {t(
              "Born from a passion for beauty and a belief that everyone deserves to feel radiant, Lumière was founded with a simple mission: to bring luxury skincare and beauty within everyone's reach.",
              "وُلدت لوميير من شغف بالجمال وإيمان بأن كل شخص يستحق أن يشعر بالإشراق. تأسست بمهمة بسيطة: جعل العناية الفاخرة بالبشرة في متناول الجميع."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="aspect-[3/4] overflow-hidden bg-nude-100">
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop" alt="Beauty" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[9px] tracking-[0.3em] uppercase text-nude-300 font-medium mb-2">
              {t("The Beginning", "البداية")}
            </p>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">
              {t("Where Light Meets Beauty", "حيث يلتقي الضوء بالجمال")}
            </h2>
            <p className="text-sm text-nude-300 font-light leading-relaxed mb-4">
              {t(
                "Lumière — French for \"light\" — represents the inner radiance that beauty can unlock. We carefully curate products from the world's finest formulations, ensuring every product meets our high standards of quality, efficacy, and sustainability.",
                "لوميير — كلمة فرنسية تعني \"الضوء\" — تمثّل الإشراق الداخلي الذي يمنحه الجمال. نختار منتجاتنا بعناية من أرقى التركيبات العالمية، لضمان أن كل منتج يلبي معاييرنا العالية من الجودة والفاعلية والاستدامة."
              )}
            </p>
            <p className="text-sm text-nude-300 font-light leading-relaxed">
              {t(
                "From our lab in Cairo to your doorstep, every Lumière product is crafted with care, backed by science, and inspired by the timeless beauty of the Mediterranean.",
                "من مختبرنا في القاهرة إلى بابك، كل منتج لوميير يُصنع بعناية، مدعوم بالعلم، ومستوحى من جمال البحر الأبيض المتوسط الخالد."
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { number: "50+", labelEn: "Products", labelAr: "منتج", descEn: "Curated beauty essentials", descAr: "أساسيات جمالية مختارة" },
            { number: "10K+", labelEn: "Happy Customers", labelAr: "عميلة سعيدة", descEn: "Across Egypt & the region", descAr: "في مصر والمنطقة" },
            { number: "100%", labelEn: "Authentic", labelAr: "أصلي", descEn: "Genuine products guaranteed", descAr: "منتجات أصلية مضمونة" },
          ].map((stat) => (
            <div key={stat.labelEn} className="text-center py-8 bg-white border border-nude-100">
              <p className="font-serif text-4xl font-light text-gray-900 mb-2">{stat.number}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gray-900 font-medium mb-1">
                {language === "ar" ? stat.labelAr : stat.labelEn}
              </p>
              <p className="text-[11px] text-nude-300 font-light">
                {language === "ar" ? stat.descAr : stat.descEn}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 p-10 md:p-14 text-center">
          <span className="text-nude-300 text-sm block mb-3">✦</span>
          <h2 className="font-serif text-2xl font-light text-white mb-3">
            {t("Join the Lumière Family", "انضمي لعائلة لوميير")}
          </h2>
          <p className="text-[11px] text-gray-400 font-light tracking-wider max-w-md mx-auto mb-6">
            {t("Discover your light with our curated collection of beauty essentials", "اكتشفي ضوءك مع مجموعتنا المختارة من أساسيات الجمال")}
          </p>
          <Link href="/shop" className="inline-block px-8 py-3 bg-white text-gray-900 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-gray-100 transition-colors">
            {t("Shop Now", "تسوقي الآن")}
          </Link>
        </div>
      </div>
    </main>
  );
}