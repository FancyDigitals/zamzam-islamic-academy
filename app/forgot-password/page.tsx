"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [verifyField, setVerifyField] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          verifyField,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Reset failed. Please check your verification information.");
        setIsLoading(false);
        return;
      }

      setMessage(data.message);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: "hsl(40, 40%, 97%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.png" alt="Zamzam Academy" className="h-16 w-16 mx-auto object-contain" />
          </Link>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
          >
            Reset Password
          </h1>
          <p className="arabic-text text-lg mt-1" style={{ color: "hsl(35, 65%, 32%)" }}>
            إعادة تعيين كلمة المرور
          </p>
          <p className="text-xs mt-2" style={{ color: "hsl(0, 0%, 40%)" }}>
            Verify your Student ID & Date of Birth/Phone to set a new password.
          </p>
        </div>

        {/* Card */}
        <div
          className="paper-card rounded-lg p-6 lg:p-8"
          style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
        >
          {message ? (
            <div className="text-center space-y-4 py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "hsl(155, 30%, 92%)", color: "hsl(155, 40%, 32%)" }}
              >
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>
                {message}
              </p>
              <Link
                href="/login"
                className="block w-full py-3 rounded text-xs uppercase font-extrabold tracking-wider transition text-center"
                style={{ background: "hsl(0, 0%, 8%)", color: "white" }}
              >
                Proceed to Login • الانتهاء والجميع إلى الدخول
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="flex items-center gap-2.5 p-3.5 rounded text-xs font-semibold"
                  style={{
                    background: "hsl(0, 50%, 95%)",
                    color: "hsl(0, 60%, 42%)",
                    border: "1px solid hsl(0, 45%, 85%)",
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  className="block text-[10px] uppercase font-bold tracking-widest mb-1.5"
                  style={{ color: "hsl(0, 0%, 18%)" }}
                >
                  Student ID or Email / رقم الطالب أو البريد *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZIA-2026-0001 or email@domain.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-11 px-3.5 rounded text-sm font-semibold transition outline-none"
                  style={{ border: "1.5px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] uppercase font-bold tracking-widest mb-1.5"
                  style={{ color: "hsl(0, 0%, 18%)" }}
                >
                  Date of Birth (YYYY-MM-DD) or Phone Number / تاريخ الميلاد أو الهاتف *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2005-04-12 or 08012345678"
                  value={verifyField}
                  onChange={(e) => setVerifyField(e.target.value)}
                  className="w-full h-11 px-3.5 rounded text-sm font-semibold transition outline-none"
                  style={{ border: "1.5px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] uppercase font-bold tracking-widest mb-1.5"
                  style={{ color: "hsl(0, 0%, 18%)" }}
                >
                  New Password / كلمة المرور الجديدة *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded text-sm font-semibold transition outline-none"
                  style={{ border: "1.5px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] uppercase font-bold tracking-widest mb-1.5"
                  style={{ color: "hsl(0, 0%, 18%)" }}
                >
                  Confirm New Password / تأكيد كلمة المرور *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded text-sm font-semibold transition outline-none"
                  style={{ border: "1.5px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded text-xs uppercase font-extrabold tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "hsl(0, 0%, 8%)", color: "white" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Reset Password • تعيين كلمة المرور</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: "hsl(35, 20%, 88%)" }}>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold transition"
              style={{ color: "hsl(0, 0%, 40%)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login • العودة لتسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}