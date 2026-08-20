"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login failed. Please try again.");
        return;
      }

      const role = result.data?.role;
      if (role === "student") {
        window.location.href = "/student/dashboard";
      } else if (role === "teacher") {
        window.location.href = "/teacher/dashboard";
      } else if (role === "super_admin" || role === "academy_admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "hsl(40, 40%, 97%)" }}
    >
      {/* Islamic geometric pattern background */}
<div
  className="absolute inset-0 opacity-[0.05] pointer-events-none"
  style={{
    backgroundImage: "url('/pattern.svg')",
    backgroundSize: "80px 80px",
    backgroundRepeat: "repeat",
  }}
/>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5">
            <img
              src="/logo.png"
              alt="Zamzam Islamic Academy"
              style={{
                width: "72px",
                height: "72px",
                objectFit: "contain",
                margin: "0 auto",
              }}
            />
          </Link>

          <p
            className="arabic-text mb-2"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            أكاديمية زمزم الإسلامية
          </p>

          <h1
            style={{
              color: "hsl(0, 0%, 8%)",
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "6px",
            }}
          >
            Welcome Back
          </h1>
          <p
            className="text-sm"
            style={{
              color: "hsl(0, 0%, 45%)",
              letterSpacing: "-0.005em",
            }}
          >
            Sign in to your student portal
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-lg p-7"
          style={{
            background: "hsl(0, 0%, 100%)",
            border: "1px solid hsl(35, 20%, 85%)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  background: "hsl(0, 50%, 96%)",
                  border: "1px solid hsl(0, 60%, 85%)",
                  color: "hsl(0, 60%, 40%)",
                  letterSpacing: "-0.005em",
                }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs mb-2"
                style={{
                  color: "hsl(0, 0%, 25%)",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-md text-sm outline-none transition-all"
                style={{
                  background: "hsl(40, 40%, 97%)",
                  border: "1.5px solid hsl(35, 20%, 82%)",
                  color: "hsl(0, 0%, 8%)",
                  letterSpacing: "-0.005em",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(38, 60%, 45%)";
                  e.currentTarget.style.background = "hsl(0, 0%, 100%)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "hsl(35, 20%, 82%)";
                  e.currentTarget.style.background = "hsl(40, 40%, 97%)";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs"
                  style={{
                    color: "hsl(0, 0%, 25%)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs transition-colors"
                  style={{
                    color: "hsl(35, 65%, 32%)",
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-11 px-3.5 pr-11 rounded-md text-sm outline-none transition-all"
                  style={{
                    background: "hsl(40, 40%, 97%)",
                    border: "1.5px solid hsl(35, 20%, 82%)",
                    color: "hsl(0, 0%, 8%)",
                    letterSpacing: "-0.005em",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "hsl(38, 60%, 45%)";
                    e.currentTarget.style.background = "hsl(0, 0%, 100%)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "hsl(35, 20%, 82%)";
                    e.currentTarget.style.background = "hsl(40, 40%, 97%)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "hsl(0, 0%, 45%)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-md text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: "hsl(0, 0%, 8%)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.background = "hsl(38, 60%, 32%)";
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.background = "hsl(0, 0%, 8%)";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "hsl(35, 20%, 88%)" }} />
            <span
              className="text-xs"
              style={{
                color: "hsl(0, 0%, 55%)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              New here?
            </span>
            <div className="flex-1 h-px" style={{ background: "hsl(35, 20%, 88%)" }} />
          </div>

          <Link
            href="/signup"
            className="w-full h-11 rounded-md flex items-center justify-center gap-2 transition-all"
            style={{
              color: "hsl(0, 0%, 8%)",
              border: "1.5px solid hsl(0, 0%, 8%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "-0.01em",
            }}
          >
            Apply for Admission
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{
              color: "hsl(0, 0%, 45%)",
              letterSpacing: "-0.005em",
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Academy Website
          </Link>
        </div>
      </div>
    </div>
  );
}