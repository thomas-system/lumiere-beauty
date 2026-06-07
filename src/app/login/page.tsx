"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) { setError("All fields are required"); return; }

    if (password === "password123") {
      setIsLoading(true);
      
      // محاكاة للـ Google OAuth بناخد صورة الإيميل
      const profileImage = `https://ui-avatars.com/api/?name=${email}&background=111827&color=fff&size=128`;
      
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        localStorage.setItem('lumiere_user_image', profileImage); // بحفظ الصورة
        
        setTimeout(() => { window.location.href = "/"; }, 1500);
      }, 2000);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="max-w-md w-full bg-white p-12 shadow-sm border border-gray-100 space-y-8">
        
        <div className="text-center">
          <p className="text-gray-400 font-semibold tracking-[0.4em] uppercase mb-4 text-[10px]">Account</p>
          <h2 className="text-3xl font-serif font-medium text-gray-900">Sign In</h2>
        </div>

        {success && (
          <div className="bg-gray-900 text-white px-4 py-3 text-center text-sm tracking-wider animate-slide-down">
            WELCOME BACK
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-center text-xs tracking-wider uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-luxury" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-luxury" placeholder="Enter your password" />
          </div>

          <button type="submit" disabled={isLoading || success} className="btn-luxury w-full flex justify-center">
            {isLoading ? 'AUTHENTICATING...' : success ? 'SUCCESS' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-400 tracking-wider">(Hint: password is <b>password123</b>)</p>
      </div>
    </div>
  );
}