"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-sm bg-white border border-[#e8d5c4] p-10 shadow-sm">

        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold text-[#c9a882] tracking-[0.3em] uppercase mb-3">Lumière Beauty</p>
          <h1 className="text-2xl font-serif text-[#1a1a1a] tracking-wide">Create Account</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-center text-xs tracking-wider uppercase mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-center text-xs tracking-wider mb-6">
            ✓ Account created! Please check your email to confirm, then sign in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">First Name</label>
              <input
                type="text" name="firstName" required
                value={formData.firstName} onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
                placeholder="Sarah"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">Last Name</label>
              <input
                type="text" name="lastName" required
                value={formData.lastName} onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
                placeholder="Johnson"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">Email Address</label>
            <input
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">Password</label>
            <input
              type="password" name="password" required
              value={formData.password} onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.2em]">Confirm Password</label>
            <input
              type="password" name="confirmPassword" required
              value={formData.confirmPassword} onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c9a882] transition-colors"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-[#1a1a1a] text-white py-3 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#333] transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? "Creating Account..." : success ? "✓ Account Created" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-[#c9a882] hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}