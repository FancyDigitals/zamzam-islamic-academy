import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { GraduationCap, Users, BookOpen, Award, Bell, Settings, TrendingUp, UserPlus, Layers, Plus, Edit } from "lucide-react";

async function getCoursesData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) return null;

  const { db } = await import("@/lib/db");
  const { courses, programmes } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const allCourses = await db.query.courses.findMany({
    orderBy: (courses: any, { asc }: any) => [asc(courses.sortOrder)],
  });

  const courseList = [];
  for (const c of allCourses) {
    let programmeName = null;
    let programmeArabic = null;
    if (c.programmeId) {
      const p = await db.query.programmes.findFirst({ where: eq(programmes.id, c.programmeId) });
      programmeName = p?.name || null;
      programmeArabic = p?.arabicName || null;
    }
    courseList.push({ ...c, programmeName, programmeArabic });
  }

  const allProgrammes = await db.query.programmes.findMany({
    where: eq(programmes.isActive, true),
  });

  return { session, courses: courseList, programmes: allProgrammes };
}

export default async function AdminCoursesPage() {
  const data = await getCoursesData();

  if (!data) {
    redirect("/login");
  }

  const { session, courses: courseList, programmes: programmeList } = data;

  const sidebarLinks = [
    { name: "Dashboard", arabic: "لوحة التحكم", href: "/admin/dashboard", icon: TrendingUp, active: false },
    { name: "Students", arabic: "الطلاب", href: "/admin/students", icon: Users, active: false },
    { name: "Admissions", arabic: "القبول", href: "/admin/admissions", icon: UserPlus, active: false },
    { name: "Programmes", arabic: "البرامج", href: "/admin/programmes", icon: Layers, active: false },
    { name: "Courses", arabic: "المواد", href: "/admin/courses", icon: BookOpen, active: true },
    { name: "Results", arabic: "النتائج", href: "/admin/results", icon: Award, active: false },
    { name: "Announcements", arabic: "الإعلانات", href: "/admin/announcements", icon: Bell, active: false },
    { name: "Settings", arabic: "الإعدادات", href: "/admin/settings", icon: Settings, active: false },
  ];

  // Group courses by programme
  const grouped: Record<string, any[]> = { "Unassigned": [] };
  for (const p of programmeList) {
    grouped[p.name] = [];
  }
  for (const c of courseList) {
    const key = c.programmeName || "Unassigned";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(210,20%,98%)" }}>

      {/* Top navbar */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>
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
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Courses / Subjects</h1>
              <p className="arabic-text text-sm" style={{ color: "hsl(162,55%,30%)" }}>إدارة المواد الدراسية</p>
              <p className="text-sm text-gray-500 mt-1">{courseList.length} total courses</p>
            </div>
            <Link
              href="/admin/courses/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              <Plus className="w-4 h-4" />
              Add Course / إضافة مادة
            </Link>
          </div>

          {/* Courses by Programme */}
          {courseList.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>
              <BookOpen style={{ width: "48px", height: "48px", color: "#cbd5e1", margin: "0 auto 16px" }} />
              <p className="text-gray-500 text-base mb-1">No courses created yet</p>
              <p className="arabic-text text-sm text-gray-400 mb-4">لم يتم إنشاء مواد بعد</p>
              <Link
                href="/admin/courses/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "hsl(162,55%,28%)" }}
              >
                <Plus className="w-4 h-4" />
                Create First Course / إنشاء المادة الأولى
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([programmeName, courses]) => {
                if (courses.length === 0) return null;
                return (
                  <div key={programmeName} className="rounded-xl border overflow-hidden" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>
                    <div className="px-6 py-4" style={{ background: "hsl(210,20%,97%)", borderBottom: "1px solid hsl(214,32%,91%)" }}>
                      <h2 className="text-base font-semibold text-gray-900">{programmeName}</h2>
                      <p className="text-xs text-gray-500">{courses.length} course(s)</p>
                    </div>
                    <div className="divide-y" style={{ borderColor: "hsl(214,32%,93%)" }}>
                      {courses.map((c: any) => (
                        <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ background: "hsl(162,40%,94%)" }}
                            >
                              <BookOpen className="w-5 h-5" style={{ color: "hsl(162,55%,28%)" }} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{c.name}</p>
                              {c.arabicName && (
                                <p className="arabic-text text-xs" style={{ color: "hsl(162,55%,30%)" }}>{c.arabicName}</p>
                              )}
                              <p className="text-xs text-gray-400 font-mono mt-0.5">{c.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                              style={{
                                background: c.isActive ? "hsl(162,40%,94%)" : "hsl(0,70%,95%)",
                                color: c.isActive ? "hsl(162,55%,25%)" : "hsl(0,60%,45%)",
                              }}
                            >
                              {c.isActive ? "Active" : "Inactive"}
                            </span>
                            {c.creditUnits && (
                              <span className="text-xs text-gray-400">{c.creditUnits} unit(s)</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2 z-50" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>
        {[
          { name: "Dashboard", arabic: "الرئيسية", href: "/admin/dashboard", icon: TrendingUp, active: false },
          { name: "Students", arabic: "الطلاب", href: "/admin/students", icon: Users, active: false },
          { name: "Courses", arabic: "المواد", href: "/admin/courses", icon: BookOpen, active: true },
          { name: "Programmes", arabic: "البرامج", href: "/admin/programmes", icon: Layers, active: false },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <Icon className="w-5 h-5" style={{ color: item.active ? "hsl(162,55%,28%)" : "#94a3b8" }} />
              <span className="text-[10px] font-medium" style={{ color: item.active ? "hsl(162,55%,28%)" : "#94a3b8" }}>{item.name}</span>
              <span className="arabic-text text-[9px]" style={{ color: item.active ? "hsl(162,55%,35%)" : "#cbd5e1" }}>{item.arabic}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}