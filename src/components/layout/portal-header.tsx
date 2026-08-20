"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export interface PortalUser {
  firstName?: string | null;
  lastName?: string | null;
  arabicName?: string | null;
  email?: string | null;
  profilePhoto?: string | null;
  role?: string | null;
}

interface PortalHeaderProps {
  subtitle?: string;
  arabicSubtitle?: string;
  user?: PortalUser | null;
  showLogout?: boolean;
}

export function PortalHeader({
  subtitle,
  arabicSubtitle,
  user: initialUser,
  showLogout = true,
}: PortalHeaderProps) {
  const router = useRouter();
  const [fetchedUser, setFetchedUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    if (!initialUser) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setFetchedUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [initialUser]);

  const user = initialUser || fetchedUser;

  // Smart subtitle based on user role
  const getSubtitle = () => {
    if (subtitle && arabicSubtitle) {
      return { en: subtitle, ar: arabicSubtitle };
    }
    const role = user?.role;
    if (role === "super_admin" || role === "academy_admin") {
      return { en: "Admin Panel", ar: "لوحة الإدارة" };
    }
    if (role === "teacher") {
      return { en: "Teacher Portal", ar: "بوابة المعلم" };
    }
    if (role === "student") {
      return { en: "Student Portal", ar: "بوابة الطالب" };
    }
    return { en: "Academy Portal", ar: "لوحة التحكم" };
  };

  const titles = getSubtitle();

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User"
    : "";

  const initials = user
    ? (user.firstName?.charAt(0) || user.email?.charAt(0) || "A").toUpperCase() +
      (user.lastName?.charAt(0) || "").toUpperCase()
    : "Z";

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  }

  return (
    <header
      className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-4 sm:px-8 border-b shrink-0"
      style={{
        background: "hsl(40, 40%, 97%)",
        borderColor: "hsl(35, 20%, 85%)",
      }}
    >
      {/* Left: Branding + Role Subtitle */}
      <Link href="/" className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Zamzam Logo"
          style={{ width: "38px", height: "38px", objectFit: "contain" }}
        />
        <div>
          <p
            className="text-xs sm:text-sm font-black uppercase tracking-tight leading-none"
            style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}
          >
            ZAMZAM ISLAMIC ACADEMY
          </p>
          <p
            className="text-[10px] sm:text-xs mt-1 leading-none font-bold"
            style={{ color: "hsl(35, 65%, 32%)" }}
          >
            {titles.en}{" "}
            <span className="text-gray-400 font-normal">/</span>{" "}
            <span className="arabic-text inline text-xs">{titles.ar}</span>
          </p>
        </div>
      </Link>

      {/* Right: User Metadata Profile + Logout */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span
                className="text-xs sm:text-sm font-bold block leading-none"
                style={{ color: "hsl(0, 0%, 15%)" }}
              >
                {displayName}
              </span>
              {user.arabicName && (
                <span
                  className="arabic-text text-xs block mt-1 leading-none"
                  style={{ color: "hsl(35, 65%, 32%)" }}
                >
                  {user.arabicName}
                </span>
              )}
            </div>

            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover shrink-0"
                style={{ border: "1.5px solid hsl(38, 60%, 45%)" }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                style={{
                  background: "hsl(0, 0%, 8%)",
                  color: "hsl(40, 40%, 97%)",
                }}
              >
                {initials}
              </div>
            )}
          </div>
        )}

        {showLogout && (
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="text-xs font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shrink-0"
              style={{
                color: "hsl(0, 0%, 18%)",
                border: "1.5px solid hsl(0, 0%, 8%)",
                background: "white",
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </form>
        )}
      </div>
    </header>
  );
}