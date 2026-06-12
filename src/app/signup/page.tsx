'use client';

import { useState } from 'react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-nude-50 relative overflow-hidden flex">

      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-nude-200 opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-nude-300 opacity-30 blur-3xl" />
      </div>

      {/* Left decorative panel */}
      <aside className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between px-14 py-12 relative z-10"
        style={{ background: 'linear-gradient(160deg, #2c1a0e 0%, #4a2c1a 60%, #6b3f25 100%)' }}>

        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-nude-200 text-lg animate-spin" style={{ animationDuration: '8s' }}>✦</span>
          <span className="font-serif text-nude-50 text-2xl font-light tracking-widest">Lumière</span>
        </div>

        {/* Tagline */}
        <div>
          <p className="font-serif text-nude-50 italic font-light leading-tight mb-5"
            style={{ fontSize: 'clamp(40px,4vw,58px)' }}>
            Beauty begins<br />with you.
          </p>
          <p className="text-nude-200 text-sm font-light leading-relaxed mb-8 max-w-[260px]">
            Join a community that celebrates your unique radiance.
          </p>
          <div className="w-10 h-px bg-nude-200 mb-7 opacity-60" />
          <ul className="space-y-4">
            {[
              'Exclusive early access to new collections',
              'Personalized beauty recommendations',
              'Birthday rewards & surprises',
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-nude-300 text-xs font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-nude-200 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-nude-300 text-xs font-light opacity-50">© 2025 Lumière Beauty</p>
      </aside>

      {/* Right — form */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        {submitted ? (
          <div className="text-center animate-fade-in">
            <span className="text-4xl text-nude-300 block mb-5" style={{ animation: 'spin 8s linear infinite' }}>✦</span>
            <h2 className="font-serif text-4xl font-light text-stone-800 mb-3">Welcome to Lumière</h2>
            <p className="text-stone-500 text-sm font-light">
              Your journey starts now, {formData.firstName}.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-md animate-slide-up"
          >
            {/* Header */}
            <div className="mb-10">
              <h1 className="font-serif text-4xl font-light text-stone-800 mb-2 tracking-tight">
                Create Account
              </h1>
              <p className="text-stone-400 text-sm font-light">Fill in your details to get started</p>
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-5 mb-7">
              {(['firstName', 'lastName'] as const).map((field) => (
                <div key={field} className="relative">
                  <label
                    htmlFor={field}
                    className={`block text-[10px] font-medium uppercase tracking-widest mb-2 transition-colors duration-200 ${
                      focused === field ? 'text-stone-700' : 'text-nude-300'
                    }`}
                  >
                    {field === 'firstName' ? 'First Name' : 'Last Name'}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    placeholder={field === 'firstName' ? 'Sara' : 'Ahmed'}
                    required
                    className="w-full bg-transparent border-b border-nude-200 py-2.5 text-sm font-light text-stone-800 placeholder:text-nude-200 outline-none transition-colors duration-200 focus:border-stone-400"
                  />
                  <span
                    className="absolute bottom-0 left-0 h-px bg-stone-700 transition-all duration-300"
                    style={{ width: focused === field ? '100%' : '0' }}
                  />
                </div>
              ))}
            </div>

            {/* Email, Phone, Birth date */}
            {[
              { name: 'email',     label: 'Email Address', type: 'email', placeholder: 'sara@example.com' },
              { name: 'phone',     label: 'Phone Number',  type: 'tel',   placeholder: '+20 10x xxx xxxx' },
              { name: 'birthDate', label: 'Date of Birth', type: 'date',  placeholder: '' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className="relative mb-7">
                <label
                  htmlFor={name}
                  className={`block text-[10px] font-medium uppercase tracking-widest mb-2 transition-colors duration-200 ${
                    focused === name ? 'text-stone-700' : 'text-nude-300'
                  }`}
                >
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  onFocus={() => setFocused(name)}
                  onBlur={() => setFocused(null)}
                  placeholder={placeholder}
                  required
                  className="w-full bg-transparent border-b border-nude-200 py-2.5 text-sm font-light text-stone-800 placeholder:text-nude-200 outline-none transition-colors duration-200 focus:border-stone-400"
                />
                <span
                  className="absolute bottom-0 left-0 h-px bg-stone-700 transition-all duration-300"
                  style={{ width: focused === name ? '100%' : '0' }}
                />
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-2 py-4 text-nude-50 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #2c1a0e 0%, #4a2c1a 100%)' }}
            >
              <span>Join Lumière</span>
              <span className="text-base">→</span>
            </button>

            <p className="text-center mt-5 text-xs text-stone-400 font-light">
              Already a member?{' '}
              <a href="/login" className="text-stone-600 font-medium border-b border-nude-200 pb-px hover:border-stone-400 transition-colors">
                Sign in
              </a>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}