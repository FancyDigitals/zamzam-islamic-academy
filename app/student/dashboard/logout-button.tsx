"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-500 transition-colors hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
      title="Sign out"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">{loading ? "..." : "Sign out"}</span>
    </button>
  );
}