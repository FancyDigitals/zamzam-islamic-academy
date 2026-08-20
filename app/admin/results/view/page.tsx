import { redirect } from "next/navigation";
import Link from "next/link";
import { ResultsViewClient } from "./results-view-client";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  UserPlus,
  Layers,
  ArrowLeft,
} from "lucide-react";

async function getData(termId: string, sessionId: string) {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (
    !session ||
    (session.role !== "super_admin" && session.role !== "academy_admin")
  )
    return null;

  const { db } = await import("@/lib/db");
  const { terms, academicSessions, levels } = await import(
    "@/lib/db/schema"
  );
  const { eq } = await import("drizzle-orm");

  const term = await db.query.terms.findFirst({
    where: eq(terms.id, termId),
  });

  const academicSession = await db.query.academicSessions.findFirst({
    where: eq(academicSessions.id, sessionId),
  });

  const allLevels = await db.query.levels.findMany({
    where: eq(levels.isActive, true),
    orderBy: (l, { asc }) => [asc(l.sortOrder)],
  });

  return { session, term, academicSession, allLevels };
}

export default async function ResultsViewPage({
  searchParams,
}: {
  searchParams: Promise<{ termId?: string; sessionId?: string }>;
}) {
  const params = await searchParams;
  const termId = params.termId || "";
  const sessionId = params.sessionId || "";

  if (!termId || !sessionId) {
    redirect("/admin/results");
  }

  const data = await getData(termId, sessionId);

  if (!data) {
    redirect("/login");
  }

  const { session, term, academicSession, allLevels } = data;

  const sidebarLinks = [
    { name: "Dashboard", arabic: "لوحة التحكم", href: "/admin/dashboard", icon: TrendingUp, active: false },
    { name: "Students", arabic: "الطلاب", href: "/admin/students", icon: Users, active: false },
    { name: "Admissions", arabic: "القبول", href: "/admin/admissions", icon: UserPlus, active: false },
    { name: "Programmes", arabic: "البرامج", href: "/admin/programmes", icon: Layers, active: false },
    { name: "Courses", arabic: "المواد", href: "/admin/courses", icon: BookOpen, active: false },
    { name: "Results", arabic: "النتائج", href: "/admin/results", icon: Award, active: true },
    { name: "Announcements", arabic: "الإعلانات", href: "/admin/announcements", icon: Bell, active: false },
    { name: "Settings", arabic: "الإعدادات", href: "/admin/settings", icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(210,20%,98%)" }}>
      {/* Header */}
      <header
        className="h-16 flex items-center justify-between px-4 sm:px-8 border-b"
        style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(162,55%,25%)" }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Zamzam Islamic Academy</p>
            <p className="text-xs text-gray-500">Admin Panel / لوحة الإدارة</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">{session.firstName} {session.lastName}</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "hsl(162,55%,25%)" }}>
            {session.firstName.charAt(0)}{session.lastName.charAt(0)}
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r p-4"
          style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
        >
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: item.active ? "hsl(162,40%,94%)" : "transparent",
                    color: item.active ? "hsl(162,55%,22%)" : "hsl(215,16%,47%)",
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="block">{item.name}</span>
                    <span className="arabic-text block text-xs opacity-70">{item.arabic}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-4 border-t" style={{ borderColor: "hsl(214,32%,91%)" }}>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 block">
              ← Academy Website / الموقع
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin/results" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Results
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-900 font-medium">
              {term?.name || "View Results"}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {term?.name} Results
            </h1>
            <p className="arabic-text text-sm mt-1" style={{ color: "hsl(162,55%,30%)" }}>
              نتائج {term?.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {academicSession?.name} Academic Session
            </p>
          </div>

          <ResultsViewClient
            termId={termId}
            sessionId={sessionId}
            termName={term?.name || ""}
            sessionName={academicSession?.name || ""}
            allLevels={allLevels.map((l) => ({
              id: l.id,
              name: l.name,
              arabicName: l.arabicName,
            }))}
          />
        </main>
      </div>
    </div>
  );
}