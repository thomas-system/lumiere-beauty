"use client";

import { useState } from "react";
import { useLanguage } from "../components/LanguageContext";

export default function ShippingPage() {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    governorate: "",
    city: "",
    district: "",
    street: "",
    building: "",
    floor: "",
    apartment: "",
    landmark: "",
  });

  const [orderNumber, setOrderNumber] = useState("");
  const [estimatedDays, setEstimatedDays] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleTrackOrder = (e: any) => {
    e.preventDefault();
    if (orderNumber.trim() === "") return;
    const days = Math.floor(Math.random() * 5) + 3;
    setEstimatedDays(
      t(
        `Your order #${orderNumber} is on its way! Estimated delivery in ${days} business days 🚚`,
        `طلبك رقم #${orderNumber} في الطريق! التسليم المتوقع خلال ${days} أيام عمل 🚚`
      )
    );
  };

  return (
    <div className="min-h-screen bg-pink-50/40 py-16 px-4 animate-fade-in" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto space-y-12">

        {/* حتة تتبع الأوردر */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif font-bold text-gray-900">{t("Track Your Order 📍", "تتبعي طلبك 📍")}</h2>
            <p className="text-gray-500 text-sm mt-2">{t("Enter your order number to see the estimated delivery time", "أدخلي رقم الطلب لمعرفة الوقت المتوقع للتسليم")}</p>
          </div>

          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="text" 
              value={orderNumber} 
              onChange={(e) => setOrderNumber(e.target.value)} 
              placeholder={t("Enter Order Number (e.g., LM-12345)", "أدخلي رقم الطلب (مثل: LM-12345)")} 
              className="flex-grow px-5 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300"
              required
            />
            <button type="submit" className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-600 transition-all shadow-md text-sm whitespace-nowrap">
              {t("Track Order", "تتبع الطلب")}
            </button>
          </form>

          {estimatedDays && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm font-medium animate-slide-down">
              {estimatedDays}
            </div>
          )}
        </div>

        {/* حتة بيانات الشحن */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900">{t("Shipping Address 🏠", "عنوان الشحن 🏠")}</h2>
            <p className="text-gray-500 text-sm mt-2">{t("Fill in your details so we can deliver your order safely", "أدخلي بياناتك عشان نوصّلك طلبك بأمان")}</p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-6">✅</span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{t("Address Saved Successfully!", "تم حفظ العنوان بنجاح!")}</h3>
              <p className="text-gray-500 mb-6">{t("Your shipping details have been recorded to the database.", "تم تسجيل بيانات الشحن في قاعدة البيانات.")}</p>
              <button onClick={() => setIsSubmitted(false)} className="text-pink-600 font-semibold hover:text-pink-700 text-sm underline">
                {t("Edit Address", "تعديل العنوان")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Full Name", "الاسم بالكامل")}</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Sarah Johnson" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Phone Number", "رقم الهاتف")}</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+20 1xx xxx xxxx" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Governorate", "المحافظة")}</label>
                  <input type="text" name="governorate" required value={formData.governorate} onChange={handleChange} placeholder="Cairo" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("City", "المدينة")}</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Nasr City" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("District / Area", "الحي / المنطقة")}</label>
                  <input type="text" name="district" required value={formData.district} onChange={handleChange} placeholder="Heliopolis" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Street Name", "اسم الشارع")}</label>
                  <input type="text" name="street" required value={formData.street} onChange={handleChange} placeholder="El Merghany St." className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Building Number", "رقم المبنى")}</label>
                  <input type="text" name="building" required value={formData.building} onChange={handleChange} placeholder="Building 12" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Floor", "الدور")}</label>
                  <input type="text" name="floor" required value={formData.floor} onChange={handleChange} placeholder="3rd Floor" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Apartment", "الشقة")}</label>
                  <input type="text" name="apartment" required value={formData.apartment} onChange={handleChange} placeholder="Apt 5" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">{t("Nearby Landmark (Optional)", "علامة مميزة قريبة (اختياري)")}</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Next to the gas station / Facing the park" className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm bg-pink-50/30 placeholder-pink-300" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-600 transition-all shadow-md hover:shadow-lg text-sm">
                {t("Save Address", "حفظ العنوان")}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}