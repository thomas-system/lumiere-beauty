"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white border border-[#e8d5c4] p-10 shadow-sm">

        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold text-[#c9a882] tracking-[0.3em] uppercase mb-3">Lumière Beauty</p>
          <h1 className="text-2xl font-serif text-[#1a1a1a] tracking-wide">Welcome Back</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-center text-xs tracking-wider uppercase mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-center text-xs tracking-wider uppercase mb-6">
            ✓ Signed in successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-[#1a1a1a] text-white py-3 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : success ? "✓ Success" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-8">
          New to Lumière?{" "}
          <Link href="/signup" className="text-[#c9a882] hover:underline font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}