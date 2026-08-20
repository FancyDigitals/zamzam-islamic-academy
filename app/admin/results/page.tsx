import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
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
  FileText,
  CheckCircle,
  Clock,
  Eye,
  PlusCircle,
} from "lucide-react";

async function getResultsOverview() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (
    !session ||
    (session.role !== "super_admin" && session.role !== "academy_admin")
  )
    return null;

  const { db } = await import("@/lib/db");
  const { results, academicSessions, terms } = await import(
    "@/lib/db/schema"
  );
  const { eq, and, sql } = await import("drizzle-orm");

  const currentSession = await db.query.academicSessions.findFirst({
    where: eq(academicSessions.isCurrent, true),
  });

  const currentTerm = currentSession
    ? await db.query.terms.findFirst({
        where: and(
          eq(terms.sessionId, currentSession.id),
          eq(terms.isCurrent, true)
        ),
      })
    : null;

  const allTerms = currentSession
    ? await db.query.terms.findMany({
        where: eq(terms.sessionId, currentSession.id),
        orderBy: (t, { asc }) => [asc(t.termNumber)],
      })
    : [];

  // Count results by status
  const [draftCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(results)
    .where(eq(results.status, "draft"));

  const [submittedCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(results)
    .where(eq(results.status, "submitted"));

  const [approvedCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(results)
    .where(eq(results.status, "approved"));

  const [publishedCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(results)
    .where(eq(results.status, "published"));

  return {
    session,
    currentSession,
    currentTerm,
    allTerms,
    stats: {
      draft: Number(draftCount.count),
      submitted: Number(submittedCount.count),
      approved: Number(approvedCount.count),
      published: Number(publishedCount.count),
    },
  };
}

export default async function AdminResultsPage() {
  const data = await getResultsOverview();

  if (!data) {
    redirect("/login");
  }

  const { session, currentSession, currentTerm, allTerms, stats } = data;

  const sidebarLinks = [
    {
      name: "Dashboard",
      arabic: "لوحة التحكم",
      href: "/admin/dashboard",
      icon: TrendingUp,
      active: false,
    },
    {
      name: "Students",
      arabic: "الطلاب",
      href: "/admin/students",
      icon: Users,
      active: false,
    },
    {
      name: "Admissions",
      arabic: "القبول",
      href: "/admin/admissions",
      icon: UserPlus,
      active: false,
    },
    {
      name: "Programmes",
      arabic: "البرامج",
      href: "/admin/programmes",
      icon: Layers,
      active: false,
    },
    {
      name: "Courses",
      arabic: "المواد",
      href: "/admin/courses",
      icon: BookOpen,
      active: false,
    },
    {
      name: "Results",
      arabic: "النتائج",
      href: "/admin/results",
      icon: Award,
      active: true,
    },
    {
      name: "Announcements",
      arabic: "الإعلانات",
      href: "/admin/announcements",
      icon: Bell,
      active: false,
    },
    {
      name: "Settings",
      arabic: "الإعدادات",
      href: "/admin/settings",
      icon: Settings,
      active: false,
    },
  ];

  const statusCards = [
    {
      label: "Draft",
      arabic: "مسودة",
      value: stats.draft,
      color: "hsl(215,16%,47%)",
      bg: "hsl(210,20%,96%)",
      border: "hsl(214,32%,91%)",
      icon: FileText,
    },
    {
      label: "Submitted",
      arabic: "مُقدَّم",
      value: stats.submitted,
      color: "hsl(42,78%,40%)",
      bg: "hsl(41,85%,93%)",
      border: "hsl(41,85%,85%)",
      icon: Clock,
    },
    {
      label: "Approved",
      arabic: "مُعتمَد",
      value: stats.approved,
      color: "hsl(220,70%,48%)",
      bg: "hsl(220,70%,95%)",
      border: "hsl(220,70%,88%)",
      icon: CheckCircle,
    },
    {
      label: "Published",
      arabic: "منشور",
      value: stats.published,
      color: "hsl(162,55%,28%)",
      bg: "hsl(162,40%,94%)",
      border: "hsl(162,40%,85%)",
      icon: Eye,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(210,20%,98%)" }}>
      {/* Header */}
      <header
        className="h-16 flex items-center justify-between px-4 sm:px-8 border-b"
        style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(162,55%,25%)" }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Zamzam Islamic Academy
            </p>
            <p className="text-xs text-gray-500">Admin Panel / لوحة الإدارة</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">
            {session.firstName} {session.lastName}
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "hsl(162,55%,25%)" }}
          >
            {session.firstName.charAt(0)}
            {session.lastName.charAt(0)}
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8">
          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Results Management
              </h1>
              <p className="arabic-text text-sm mt-1" style={{ color: "hsl(162,55%,30%)" }}>
                إدارة النتائج
              </p>
              {currentSession && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentSession.name} Academic Session
                  {currentTerm && ` — ${currentTerm.name}`}
                </p>
              )}
            </div>
            <Link
              href="/admin/results/entry"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enter Results</span>
            </Link>
          </div>

          {/* No session warning */}
          {!currentSession && (
            <div
              className="rounded-xl border p-6 mb-6"
              style={{
                background: "hsl(41,85%,93%)",
                borderColor: "hsl(41,85%,80%)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "hsl(42,78%,35%)" }}>
                ⚠️ No active academic session found. Please set an active
                session before entering results.
              </p>
            </div>
          )}

          {/* Status overview cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-xl border p-5"
                  style={{
                    background: "white",
                    borderColor: "hsl(214,32%,91%)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: card.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{ color: "hsl(215,28%,17%)" }}
                  >
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="arabic-text text-xs text-gray-400">
                    {card.arabic}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Workflow Guide */}
          <div
            className="rounded-xl border p-6 mb-6"
            style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
          >
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Results Workflow
            </h2>
            <p className="arabic-text text-xs text-gray-400 mb-4">
              مسار النتائج
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                {
                  step: "1",
                  label: "Enter Scores",
                  arabic: "إدخال الدرجات",
                  color: "hsl(215,16%,47%)",
                  bg: "hsl(210,20%,96%)",
                },
                { arrow: true },
                {
                  step: "2",
                  label: "Submit",
                  arabic: "تقديم",
                  color: "hsl(42,78%,40%)",
                  bg: "hsl(41,85%,93%)",
                },
                { arrow: true },
                {
                  step: "3",
                  label: "Approve",
                  arabic: "اعتماد",
                  color: "hsl(220,70%,48%)",
                  bg: "hsl(220,70%,95%)",
                },
                { arrow: true },
                {
                  step: "4",
                  label: "Publish",
                  arabic: "نشر",
                  color: "hsl(162,55%,28%)",
                  bg: "hsl(162,40%,94%)",
                },
              ].map((item, i) =>
                "arrow" in item ? (
                  <span key={i} className="text-gray-300 text-lg font-light">
                    →
                  </span>
                ) : (
                  <div
                    key={item.step}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: item.bg }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: item.color }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <span
                        className="text-xs font-medium block"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="arabic-text text-[10px] block"
                        style={{ color: item.color, opacity: 0.8 }}
                      >
                        {item.arabic}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Students can only see results after they are{" "}
              <strong>Published</strong>. Draft and submitted results are hidden
              from students.
            </p>
          </div>

          {/* Term Tabs + View Results */}
          {currentSession && (
            <div
              className="rounded-xl border p-6"
              style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
            >
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                View Results by Term
              </h2>
              <p className="arabic-text text-xs text-gray-400 mb-4">
                عرض النتائج حسب الفصل
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {allTerms.map((term) => (
                  <Link
                    key={term.id}
                    href={`/admin/results/view?termId=${term.id}&sessionId=${currentSession.id}`}
                    className="p-4 rounded-xl border transition-all hover:shadow-md"
                    style={{ borderColor: "hsl(214,32%,91%)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {term.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background:
                            term.status === "active"
                              ? "hsl(162,40%,94%)"
                              : "hsl(210,20%,96%)",
                          color:
                            term.status === "active"
                              ? "hsl(162,55%,28%)"
                              : "hsl(215,16%,47%)",
                        }}
                      >
                        {term.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {term.startDate} → {term.endDate}
                    </p>
                    <p
                      className="text-xs mt-2 font-medium"
                      style={{ color: "hsl(162,55%,28%)" }}
                    >
                      View / Enter Results →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2 z-50"
        style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
      >
        {[
          {
            name: "Dashboard",
            arabic: "الرئيسية",
            href: "/admin/dashboard",
            icon: TrendingUp,
            active: false,
          },
          {
            name: "Students",
            arabic: "الطلاب",
            href: "/admin/students",
            icon: Users,
            active: false,
          },
          {
            name: "Results",
            arabic: "النتائج",
            href: "/admin/results",
            icon: Award,
            active: true,
          },
          {
            name: "Courses",
            arabic: "المواد",
            href: "/admin/courses",
            icon: BookOpen,
            active: false,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: item.active ? "hsl(162,55%,28%)" : "#94a3b8",
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{
                  color: item.active ? "hsl(162,55%,28%)" : "#94a3b8",
                }}
              >
                {item.name}
              </span>
              <span
                className="arabic-text text-[9px]"
                style={{
                  color: item.active ? "hsl(162,55%,35%)" : "#cbd5e1",
                }}
              >
                {item.arabic}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}