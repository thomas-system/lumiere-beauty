"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-pink-100 p-8 space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Join Lumière 💖</h2>
          <p className="mt-2 text-sm text-gray-500">Create an account to start your beauty journey</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm font-medium animate-slide-down">
            🎉 Account created successfully! Redirecting to login...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-center text-sm font-medium animate-slide-down">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">First Name</label>
              <input 
                type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 placeholder-pink-300"
                placeholder="Sarah"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Last Name</label>
              <input 
                type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 placeholder-pink-300"
                placeholder="Johnson"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 placeholder-pink-300"
              placeholder="you@example.com"
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Create Password</label>
              <input 
                type="password" name="password" required value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 placeholder-pink-300"
                placeholder="Min 8 chars"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Confirm Password</label>
              <input 
                type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 placeholder-pink-300"
                placeholder="Rewrite password"
              />
            </div>
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Date of Birth</label>
              <input 
                type="date" name="dob" required value={formData.dob} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Gender</label>
              <select 
                name="gender" required value={formData.gender} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm bg-pink-50/30 text-gray-500"
              >
                <option value="" disabled>Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-600 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-600 font-semibold hover:text-pink-700">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}