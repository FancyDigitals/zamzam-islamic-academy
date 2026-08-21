"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  Camera,
  X,
} from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    arabicName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    studentId: string;
    name: string;
    arabicName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile photo must be less than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (success?.studentId) {
      navigator.clipboard.writeText(success.studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          arabicName: form.arabicName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          gender: form.gender || undefined,
          dateOfBirth: form.dateOfBirth || undefined,
          password: form.password,
          profilePhoto: profilePhoto || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess({
        studentId: result.data.studentId,
        name: `${result.data.firstName} ${result.data.lastName}`,
        arabicName: form.arabicName,
      });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12 relative"
        style={{ background: "hsl(40, 40%, 97%)" }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('/pattern.svg')",
            backgroundSize: "80px 80px",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative w-full max-w-md text-center">
          <div
            className="rounded-lg p-8"
            style={{
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(35, 20%, 85%)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "hsl(155, 40%, 32%)" }}
            >
              <CheckCircle className="w-7 h-7 text-white" />
            </div>

            <img
              src="/logo.png"
              alt="Zamzam College of Islamic and Arabic Studies"
              style={{
                width: "56px",
                height: "56px",
                objectFit: "contain",
                margin: "0 auto 16px",
              }}
            />

            <p
              className="arabic-text mb-1"
              style={{ color: "hsl(35, 65%, 32%)", fontSize: "1.1rem" }}
            >
              أهلاً وسهلاً بك
            </p>
            <p
              className="arabic-text mb-4"
              style={{ color: "hsl(38, 60%, 45%)", fontSize: "0.95rem" }}
            >
              بارك الله فيك
            </p>

            <h1
              style={{
                color: "hsl(0, 0%, 8%)",
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginBottom: "8px",
              }}
            >
              Welcome to the Academy
            </h1>
            <p
              className="text-sm mb-6"
              style={{
                color: "hsl(0, 0%, 40%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.55,
              }}
            >
              Your account has been created, {success.name}.
              {success.arabicName && (
                <span
                  className="arabic-text block mt-1"
                  style={{ color: "hsl(35, 65%, 32%)" }}
                >
                  {success.arabicName}
                </span>
              )}
            </p>

            <div
              className="rounded-lg p-4 mb-5"
              style={{
                background: "hsl(38, 45%, 94%)",
                border: "1px solid hsl(35, 30%, 82%)",
              }}
            >
              <p
                className="text-xs mb-2"
                style={{
                  color: "hsl(0, 0%, 45%)",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Your Student ID
              </p>
              <div className="flex items-center justify-center gap-3">
                <span
                  className="font-mono"
                  style={{
                    color: "hsl(0, 0%, 8%)",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                  }}
                >
                  {success.studentId}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md transition-colors"
                  style={{
                    color: "hsl(35, 65%, 32%)",
                    background: "hsl(42, 75%, 88%)",
                  }}
                  title="Copy Student ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p
                  className="text-xs mt-2"
                  style={{ color: "hsl(155, 40%, 32%)", fontWeight: 600 }}
                >
                  ✓ Copied to clipboard
                </p>
              )}
              <p
                className="text-xs mt-3"
                style={{
                  color: "hsl(0, 0%, 45%)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.5,
                }}
              >
                Save this ID — you'll need it for academic records.
              </p>
            </div>

            <Link
              href="/student/dashboard"
              className="w-full h-11 rounded-md flex items-center justify-center gap-2 text-white transition-all mb-3"
              style={{
                background: "hsl(0, 0%, 8%)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "-0.01em",
              }}
            >
              Go to Student Portal
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "-0.005em" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Academy Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: "hsl(40, 40%, 97%)" }}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "url('/pattern.svg')",
          backgroundSize: "80px 80px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5">
            <img
              src="/logo.png"
              alt="Zamzam College of Islamic and Arabic Studies"
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
            Create Your Account
          </h1>
          <p
            className="text-sm"
            style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "-0.005em" }}
          >
            Join Zamzam College of Islamic and Arabic Studies
          </p>
        </div>

        <div
          className="rounded-lg p-7"
          style={{
            background: "hsl(0, 0%, 100%)",
            border: "1px solid hsl(35, 20%, 85%)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div
              className="text-center pb-4"
              style={{ borderBottom: "1px solid hsl(35, 20%, 90%)" }}
            >
              <div className="flex flex-col items-center gap-3">
                {profilePhoto ? (
                  <div className="relative">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                      style={{ border: "3px solid hsl(38, 60%, 45%)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setProfilePhoto(null)}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                      style={{ background: "hsl(0, 60%, 42%)" }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "hsl(38, 45%, 94%)",
                      border: "2px dashed hsl(35, 30%, 78%)",
                    }}
                  >
                    <Camera
                      className="w-6 h-6"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    />
                  </div>
                )}
                <label
                  className="cursor-pointer text-xs px-4 py-2 rounded-md transition-colors"
                  style={{
                    background: "hsl(38, 45%, 94%)",
                    color: "hsl(35, 65%, 32%)",
                    border: "1px solid hsl(35, 30%, 82%)",
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {profilePhoto ? "Change Photo" : "Upload Profile Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <p
                  className="text-xs"
                  style={{
                    color: "hsl(0, 0%, 50%)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  Max 2MB · JPG or PNG
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="First Name"
                arabic="الاسم الأول"
                required
                value={form.firstName}
                onChange={(v) => updateForm("firstName", v)}
                placeholder="Abdullah"
              />
              <FormInput
                label="Last Name"
                arabic="اسم العائلة"
                required
                value={form.lastName}
                onChange={(v) => updateForm("lastName", v)}
                placeholder="Ibrahim"
              />
            </div>

            <FormInput
              type="email"
              label="Email Address"
              arabic="البريد الإلكتروني"
              required
              value={form.email}
              onChange={(v) => updateForm("email", v)}
              placeholder="your@email.com"
            />

            <FormInput
              type="tel"
              label="Phone Number"
              arabic="رقم الهاتف"
              value={form.phone}
              onChange={(v) => updateForm("phone", v)}
              placeholder="+234 800 000 0000"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel label="Gender" arabic="الجنس" />
                <select
                  value={form.gender}
                  onChange={(e) => updateForm("gender", e.target.value)}
                  className="w-full h-11 px-3 rounded-md text-sm outline-none transition-all"
                  style={{
                    background: "hsl(40, 40%, 97%)",
                    border: "1.5px solid hsl(35, 20%, 82%)",
                    color: "hsl(0, 0%, 8%)",
                  }}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <FormInput
                type="date"
                label="Date of Birth"
                arabic="تاريخ الميلاد"
                value={form.dateOfBirth}
                onChange={(v) => updateForm("dateOfBirth", v)}
              />
            </div>

            <div>
              <FormLabel label="Password" arabic="كلمة المرور" required />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className="w-full h-11 px-3.5 pr-11 rounded-md text-sm outline-none transition-all"
                  style={{
                    background: "hsl(40, 40%, 97%)",
                    border: "1.5px solid hsl(35, 20%, 82%)",
                    color: "hsl(0, 0%, 8%)",
                    letterSpacing: "-0.005em",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "hsl(0, 0%, 45%)" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <FormInput
              type="password"
              label="Confirm Password"
              arabic="تأكيد كلمة المرور"
              required
              value={form.confirmPassword}
              onChange={(v) => updateForm("confirmPassword", v)}
              placeholder="Repeat your password"
              minLength={8}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-md text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{
                background: "hsl(0, 0%, 8%)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "-0.01em",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div
              className="flex-1 h-px"
              style={{ background: "hsl(35, 20%, 88%)" }}
            />
            <span
              className="text-xs"
              style={{
                color: "hsl(0, 0%, 55%)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Have an account?
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "hsl(35, 20%, 88%)" }}
            />
          </div>

          <Link
            href="/login"
            className="w-full h-11 rounded-md flex items-center justify-center gap-2 transition-all"
            style={{
              color: "hsl(0, 0%, 8%)",
              border: "1.5px solid hsl(0, 0%, 8%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "-0.01em",
            }}
          >
            Sign In Instead
          </Link>
        </div>

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

function FormLabel({
  label,
  arabic,
  required,
}: {
  label: string;
  arabic: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label
        className="block text-xs"
        style={{
          color: "hsl(0, 0%, 25%)",
          fontWeight: 600,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: "hsl(38, 60%, 45%)" }}> *</span>}
      </label>
      <span
        className="arabic-text text-xs"
        style={{ color: "hsl(0, 0%, 55%)" }}
      >
        {arabic}
      </span>
    </div>
  );
}

function FormInput({
  label,
  arabic,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  minLength,
}: {
  label: string;
  arabic: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  minLength?: number;
}) {
  return (
    <div>
      <FormLabel label={label} arabic={arabic} required={required} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full h-11 px-3.5 rounded-md text-sm outline-none transition-all"
        style={{
          background: "hsl(40, 40%, 97%)",
          border: "1.5px solid hsl(35, 20%, 82%)",
          color: "hsl(0, 0%, 8%)",
          letterSpacing: "-0.005em",
          colorScheme: type === "date" ? "light" : "auto",
        }}
      />
    </div>
  );
}