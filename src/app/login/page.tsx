"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) { setError("All fields are required"); return; }

    if (password === "password123") {
      setIsLoading(true);

      const savedUser = localStorage.getItem("lumiere_signup_data");
      const userData = savedUser ? JSON.parse(savedUser) : {};

      const name = userData.firstName ? `${userData.firstName}+${userData.lastName}` : email.split("@")[0];
      const profileImage = `https://ui-avatars.com/api/?name=${name}&background=2c1a0e&color=f9ede2&size=128&bold=true`;

      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);

        localStorage.setItem("lumiere_user", JSON.stringify({
          ...userData,
          email,
          profileImage,
          loggedIn: true,
        }));

        setTimeout(() => { window.location.href = "/"; }, 1200);
      }, 1500);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-nude-50 relative overflow-hidden flex items-center justify-center py-16 px-4">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-nude-200 opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-nude-300 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-nude-300 text-sm">✦</span>
            <span className="font-serif text-2xl font-light text-gray-900 tracking-widest">LUMIÈRE</span>
          </Link>
          <p className="text-[10px] tracking-[0.3em] uppercase text-nude-300 font-medium mb-2">Welcome Back</p>
          <h1 className="font-serif text-3xl font-light text-gray-900">Sign In</h1>
        </div>

        <div className="bg-white p-10 border border-nude-100">
          {success && (
            <div className="bg-gray-900 text-white px-4 py-3 text-center text-[11px] tracking-[0.2em] uppercase mb-6 animate-slide-down">
              Welcome Back ✦
            </div>
          )}

          {error && (
            <div className="border border-red-100 bg-red-50 text-red-500 px-4 py-3 text-center text-[11px] tracking-wider uppercase mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-7">
            <div className="relative">
              <label className={`block text-[10px] font-medium uppercase tracking-widest mb-2 transition-colors duration-200 ${focused === "email" ? "text-gray-700" : "text-nude-300"}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent border-b border-nude-200 py-2.5 text-sm font-light text-gray-900 placeholder:text-nude-200 outline-none transition-colors duration-200 focus:border-stone-400"
              />
              <span className="absolute bottom-0 left-0 h-px bg-stone-700 transition-all duration-300" style={{ width: focused === "email" ? "100%" : "0" }} />
            </div>

            <div className="relative">
              <label className={`block text-[10px] font-medium uppercase tracking-widest mb-2 transition-colors duration-200 ${focused === "password" ? "text-gray-700" : "text-nude-300"}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Enter your password"
                required
                className="w-full bg-transparent border-b border-nude-200 py-2.5 text-sm font-light text-gray-900 placeholder:text-nude-200 outline-none transition-colors duration-200 focus:border-stone-400"
              />
              <span className="absolute bottom-0 left-0 h-px bg-stone-700 transition-all duration-300" style={{ width: focused === "password" ? "100%" : "0" }} />
            </div>

            <button type="submit" disabled={isLoading || success} className="w-full mt-2 py-4 bg-gray-900 text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-stone-800 transition-colors disabled:opacity-60">
              {isLoading ? "Signing in..." : success ? "✓ Success" : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 text-[11px] text-nude-300 font-light">
            Hint: password is <span className="font-medium text-gray-700">password123</span>
          </p>

          <div className="mt-6 pt-6 border-t border-nude-100 text-center">
            <p className="text-xs text-gray-400 font-light">
              New to Lumière?{" "}
              <Link href="/signup" className="text-gray-700 font-medium border-b border-nude-200 pb-px hover:border-gray-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}