"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Login failed. Please try again.");
        return;
      }

      toast.success("Welcome back!");

      // Redirect based on role
      const role = result.data?.role;
      if (role === "student") {
        router.push("/student/dashboard");
      } else if (role === "teacher") {
        router.push("/teacher/dashboard");
      } else if (role === "super_admin" || role === "academy_admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-emerald-700/10 blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </Link>
          <p className="arabic-text text-emerald-300 text-lg mb-2">
            أكاديمية زمزم الإسلامية
          </p>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome Back
          </h1>
          <p className="text-emerald-400 text-sm">
            Sign in to your student portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-emerald-200 mb-1.5"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-400/60 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-red-400 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-emerald-200"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-400/60 focus-visible:ring-emerald-500 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-emerald-400 text-sm">
              Not a student yet?{" "}
              <Link
                href="/admissions"
                className="text-emerald-300 hover:text-white font-medium transition-colors"
              >
                Apply for Admission
              </Link>
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-emerald-500 hover:text-emerald-400 text-sm transition-colors"
          >
            ← Back to Academy Website
          </Link>
        </div>
      </div>
    </div>
  );
}