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

  const getSubtitle = () => {
    if (subtitle && arabicSubtitle) {
      return { en: subtitle, ar: arabicSubtitle };
    }

    const role = user?.role;

    if (role === "super_admin" || role === "academy_admin") {
      return {
        en: "Admin Panel",
        ar: "لوحة الإدارة",
      };
    }

    if (role === "teacher") {
      return {
        en: "Teacher Portal",
        ar: "بوابة المعلم",
      };
    }

    if (role === "student") {
      return {
        en: "Student Portal",
        ar: "بوابة الطالب",
      };
    }

    return {
      en: "Academy Portal",
      ar: "بوابة الأكاديمية",
    };
  };

  const titles = getSubtitle();

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "User"
    : "";

  const initials = user
    ? (
        user.firstName?.charAt(0) ||
        user.email?.charAt(0) ||
        "A"
      ).toUpperCase() + (user.lastName?.charAt(0) || "").toUpperCase()
    : "Z";

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault();

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  }

  return (
    <header
      className="sticky top-0 z-40 w-full h-16 border-b shrink-0 overflow-hidden"
      style={{
        background: "hsl(40, 40%, 97%)",
        borderColor: "hsl(35, 20%, 85%)",
      }}
    >
      <div className="h-full w-full max-w-full flex items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        {/* LEFT: BRAND */}
        <Link
          href="/"
          className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden"
        >
          <img
            src="/logo.png"
            alt="Zamzam Logo"
            className="w-9 h-9 shrink-0 object-contain"
          />

          <div className="min-w-0 overflow-hidden">
            {/* English School Name */}
            <p
              className="font-black uppercase leading-none truncate text-[10px] sm:text-xs lg:text-sm"
              style={{
                color: "hsl(0, 0%, 8%)",
                letterSpacing: "-0.01em",
              }}
              title="Zamzam College of Islamic and Arabic Studies"
            >
              Zamzam College of Islamic and Arabic Studies
            </p>

            {/* Arabic School Name */}
            <p
              className="arabic-text mt-1 leading-none truncate text-[9px] sm:text-[10px] lg:text-xs"
              dir="rtl"
              style={{
                color: "hsl(35, 65%, 32%)",
                fontWeight: 700,
              }}
            >
              زمزم للدراسات الإسلامية والعربية
            </p>

            {/* Portal Subtitle */}
            <p
              className="mt-1 leading-none font-semibold truncate text-[8px] sm:text-[9px] lg:text-[10px]"
              style={{
                color: "hsl(0, 0%, 40%)",
              }}
            >
              {titles.en}{" "}
              <span className="text-gray-400 font-normal">/</span>{" "}
              <span className="arabic-text">
                {titles.ar}
              </span>
            </p>
          </div>
        </Link>

        {/* RIGHT: USER + LOGOUT */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user && (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* User name hidden on smaller screens */}
              <div className="text-right hidden md:block max-w-[180px] lg:max-w-[240px]">
                <span
                  className="text-xs sm:text-sm font-bold block leading-none truncate"
                  style={{
                    color: "hsl(0, 0%, 15%)",
                  }}
                  title={displayName}
                >
                  {displayName}
                </span>

                {user.arabicName && (
                  <span
                    className="arabic-text text-xs block mt-1 leading-none truncate"
                    dir="rtl"
                    style={{
                      color: "hsl(35, 65%, 32%)",
                    }}
                  >
                    {user.arabicName}
                  </span>
                )}
              </div>

              {/* Profile */}
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={displayName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0"
                  style={{
                    border: "1.5px solid hsl(38, 60%, 45%)",
                  }}
                />
              ) : (
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0"
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
            <form onSubmit={handleLogout} className="shrink-0">
              <button
                type="submit"
                className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded transition flex items-center gap-1.5 shrink-0"
                style={{
                  color: "hsl(0, 0%, 18%)",
                  border: "1.5px solid hsl(0, 0%, 8%)",
                  background: "white",
                }}
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}