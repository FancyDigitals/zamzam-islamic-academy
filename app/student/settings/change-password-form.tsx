"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, KeyRound } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
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
      setError("New password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/student/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update password.");
        setIsLoading(false);
        return;
      }

      setMessage("Password changed successfully! • تم تحديث كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {message && (
        <div
          className="flex items-center gap-2.5 p-3.5 rounded text-xs font-semibold"
          style={{
            background: "hsl(155, 30%, 92%)",
            color: "hsl(155, 40%, 32%)",
            border: "1px solid hsl(155, 35%, 82%)",
          }}
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

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
          Current Password / كلمة المرور الحالية *
        </label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
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
          Confirm New Password / تأكيد كلمة المرور الجديدة *
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
        className="px-6 py-3 rounded text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-2 disabled:opacity-50"
        style={{ background: "hsl(0, 0%, 8%)", color: "white" }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <KeyRound className="w-4 h-4" />
            <span>Update Password • تحديث كلمة المرور</span>
          </>
        )}
      </button>
    </form>
  );
}