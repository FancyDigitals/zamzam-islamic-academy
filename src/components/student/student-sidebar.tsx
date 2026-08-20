"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Bell,
  Library,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    arabic: "لوحة التحكم",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    arabic: "مقرراتي",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    name: "My Results",
    arabic: "نتائجي",
    href: "/student/results",
    icon: Award,
  },
  {
    name: "Resources",
    arabic: "الموارد",
    href: "/student/resources",
    icon: Library,
  },
  {
    name: "Announcements",
    arabic: "الإعلانات",
    href: "/student/announcements",
    icon: Bell,
  },
  {
    name: "My Profile",
    arabic: "ملفي الشخصي",
    href: "/student/profile",
    icon: User,
  },
  {
    name: "Settings",
    arabic: "الإعدادات",
    href: "/student/settings",
    icon: Settings,
  },
];

export function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col border-r min-h-[calc(100vh-64px)] relative shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? "64px" : "256px",
        background: "white",
        borderColor: "hsl(35, 20%, 85%)",
      }}
    >
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className="flex items-center gap-3 px-3 py-3 rounded-md transition-all"
              style={
                isActive
                  ? {
                      background: "hsl(38, 45%, 94%)",
                      color: "hsl(0, 0%, 8%)",
                      fontWeight: 700,
                      borderLeft: "3px solid hsl(38, 60%, 45%)",
                    }
                  : {
                      color: "hsl(0, 0%, 18%)",
                      fontWeight: 500,
                    }
              }
            >
              <Icon
                className="w-5 h-5 shrink-0"
                style={{
                  color: isActive ? "hsl(38, 60%, 45%)" : "hsl(0, 0%, 40%)",
                }}
              />
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm leading-tight">{item.name}</span>
                  <span
                    className="arabic-text text-[10px] leading-tight mt-0.5"
                    style={{ color: "hsl(35, 65%, 32%)" }}
                  >
                    {item.arabic}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition"
        style={{
          background: "hsl(0, 0%, 8%)",
          color: "white",
          border: "1.5px solid hsl(35, 20%, 82%)",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Back to website */}
      {!collapsed && (
        <div
          className="p-4 border-t"
          style={{ borderColor: "hsl(35, 20%, 88%)" }}
        >
          <Link
            href="/"
            className="text-xs font-semibold transition"
            style={{ color: "hsl(0, 0%, 40%)" }}
          >
            ← Academy Website
          </Link>
          <p
            className="arabic-text text-[10px] mt-0.5"
            style={{ color: "hsl(35, 65%, 32%)" }}
          >
            العودة للموقع
          </p>
        </div>
      )}
    </aside>
  );
}