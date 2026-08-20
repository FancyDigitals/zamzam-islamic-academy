import { redirect } from "next/navigation";
import Link from "next/link";
import { ResultsEntryForm } from "./results-entry-form";
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

async function getData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (
    !session ||
    (session.role !== "super_admin" && session.role !== "academy_admin")
  )
    return null;

  const { db } = await import("@/lib/db");
  const { academicSessions, terms, levels, programmes } = await import(
    "@/lib/db/schema"
  );
  const { eq, and } = await import("drizzle-orm");

  const currentSession = await db.query.academicSessions.findFirst({
    where: eq(academicSessions.isCurrent, true),
  });

  const allTerms = currentSession
    ? await db.query.terms.findMany({
        where: eq(terms.sessionId, currentSession.id),
        orderBy: (t, { asc }) => [asc(t.termNumber)],
      })
    : [];

  const currentTerm = allTerms.find((t) => t.isCurrent) || allTerms[0] || null;

  const allLevels = await db.query.levels.findMany({
    where: eq(levels.isActive, true),
    orderBy: (l, { asc }) => [asc(l.sortOrder)],
  });

  const allProgrammes = await db.query.programmes.findMany({
    where: eq(programmes.isActive, true),
    orderBy: (p, { asc }) => [asc(p.sortOrder)],
  });

  return {
    session,
    currentSession,
    currentTerm,
    allTerms,
    allLevels,
    allProgrammes,
  };
}

export default async function ResultsEntryPage() {
  const data = await getData();

  if (!data) {
    redirect("/login");
  }

  const {
    session,
    currentSession,
    currentTerm,
    allTerms,
    allLevels,
    allProgrammes,
  } = data;

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
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/admin/results"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Results
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-900 font-medium">Enter Results</span>
          </div>

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Enter Results</h1>
            <p className="arabic-text text-sm mt-1" style={{ color: "hsl(162,55%,30%)" }}>
              إدخال النتائج
            </p>
            {currentSession && (
              <p className="text-sm text-gray-500 mt-1">
                {currentSession.name}
                {currentTerm && ` — ${currentTerm.name}`}
              </p>
            )}
          </div>

          {!currentSession ? (
            <div
              className="rounded-xl border p-8 text-center"
              style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
            >
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active academic session found.</p>
              <p className="text-gray-400 text-sm mt-1">
                Please create and activate an academic session first.
              </p>
            </div>
          ) : (
            <ResultsEntryForm
              currentSession={{
                id: currentSession.id,
                name: currentSession.name,
              }}
              currentTerm={
                currentTerm
                  ? { id: currentTerm.id, name: currentTerm.name }
                  : null
              }
              allTerms={allTerms.map((t) => ({
                id: t.id,
                name: t.name,
                termNumber: t.termNumber,
              }))}
              allLevels={allLevels.map((l) => ({
                id: l.id,
                name: l.name,
                arabicName: l.arabicName,
                programmeId: l.programmeId,
              }))}
              allProgrammes={allProgrammes.map((p) => ({
                id: p.id,
                name: p.name,
                arabicName: p.arabicName,
              }))}
            />
          )}
        </main>
      </div>
    </div>
  );
}