"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  // Helper to check if a link is active
  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside
      className="hidden lg:flex w-64 flex-col border-r min-h-[calc(100vh-64px)] p-4 shrink-0"
      style={{ background: "white", borderColor: "hsl(35, 20%, 85%)" }}
    >
      <div className="space-y-1">
        <SidebarLink
          href="/admin/dashboard"
          label="Dashboard"
          labelAr="لوحة التحكم"
          active={isActive("/admin/dashboard")}
        />
        <SidebarLink
          href="/admin/students"
          label="Students"
          labelAr="الطلاب"
          active={isActive("/admin/students")}
        />
        <SidebarLink
          href="/admin/admissions"
          label="Admissions"
          labelAr="القبول"
          active={isActive("/admin/admissions")}
        />
        <SidebarLink
          href="/admin/programmes"
          label="Programmes"
          labelAr="البرامج"
          active={isActive("/admin/programmes")}
        />
        <SidebarLink
          href="/admin/courses"
          label="Courses"
          labelAr="المواد"
          active={isActive("/admin/courses")}
        />
        <SidebarLink
          href="/admin/results"
          label="Results"
          labelAr="النتائج"
          active={isActive("/admin/results")}
        />
        <SidebarLink
          href="/admin/announcements"
          label="Announcements"
          labelAr="الإعلانات"
          active={isActive("/admin/announcements")}
        />
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  labelAr,
  active,
}: {
  href: string;
  label: string;
  labelAr: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-3 rounded-md mb-1 transition flex flex-col"
      style={
        active
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
      <span>{label}</span>
      <span
        className="arabic-text text-xs"
        style={{ color: "hsl(35, 65%, 32%)", marginTop: "2px" }}
      >
        {labelAr}
      </span>
    </Link>
  );
}