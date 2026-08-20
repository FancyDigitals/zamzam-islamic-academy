import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { GraduationCap, Users, BookOpen, Award, Bell, Settings, TrendingUp, UserPlus, Layers, Plus, Edit, ChevronRight } from "lucide-react";

async function getProgrammesData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) return null;

  const { db } = await import("@/lib/db");
  const { programmes, levels, courses, students } = await import("@/lib/db/schema");
  const { eq, sql } = await import("drizzle-orm");

  const allProgrammes = await db.query.programmes.findMany({
    orderBy: (programmes, { asc }) => [asc(programmes.sortOrder)],
  });

  const programmeData = [];
  for (const p of allProgrammes) {
    const programmeLevels = await db.query.levels.findMany({
      where: eq(levels.programmeId, p.id),
      orderBy: (levels, { asc }) => [asc(levels.sortOrder)],
    });

    const [courseCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(eq(courses.programmeId, p.id));

    const [studentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(eq(students.currentProgrammeId, p.id));

    programmeData.push({
      ...p,
      levels: programmeLevels,
      courseCount: Number(courseCount.count),
      studentCount: Number(studentCount.count),
    });
  }

  return { session, programmes: programmeData };
}

export default async function AdminProgrammesPage() {
  const data = await getProgrammesData();

  if (!data) {
    redirect("/login");
  }

  const { session, programmes: programmeList } = data;

  const sidebarLinks = [
    { name: "Dashboard", arabic: "لوحة التحكم", href: "/admin/dashboard", icon: TrendingUp, active: false },
    { name: "Students", arabic: "الطلاب", href: "/admin/students", icon: Users, active: false },
    { name: "Admissions", arabic: "القبول", href: "/admin/admissions", icon: UserPlus, active: false },
    { name: "Programmes", arabic: "البرامج", href: "/admin/programmes", icon: Layers, active: true },
    { name: "Courses", arabic: "المواد", href: "/admin/courses", icon: BookOpen, active: false },
    { name: "Results", arabic: "النتائج", href: "/admin/results", icon: Award, active: false },
    { name: "Announcements", arabic: "الإعلانات", href: "/admin/announcements", icon: Bell, active: false },
    { name: "Settings", arabic: "الإعدادات", href: "/admin/settings", icon: Settings, active: false },
  ];

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
        <AdminSidebar />

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Programmes</h1>
              <p className="arabic-text text-sm" style={{ color: "hsl(162,55%,30%)" }}>إدارة البرامج الأكاديمية</p>
              <p className="text-sm text-gray-500 mt-1">{programmeList.length} programmes</p>
            </div>
            <Link
              href="/admin/programmes/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Programme / إضافة برنامج</span>
            </Link>
          </div>

          {/* Programmes Grid */}
          {programmeList.length === 0 ? (
            <div className="rounded-xl border p-12 text-center" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>
              <Layers style={{ width: "48px", height: "48px", color: "#cbd5e1", margin: "0 auto 16px" }} />
              <p className="text-gray-500 text-base mb-1">No programmes created yet</p>
              <p className="arabic-text text-sm text-gray-400 mb-4">لم يتم إنشاء برامج بعد</p>
              <Link
                href="/admin/programmes/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "hsl(162,55%,28%)" }}
              >
                <Plus className="w-4 h-4" />
                Create First Programme / إنشاء البرنامج الأول
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {programmeList.map((p: any) => (
                <div key={p.id} className="rounded-xl border overflow-hidden" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>

                  {/* Programme header */}
                  <div className="p-6" style={{ borderBottom: "1px solid hsl(214,32%,93%)" }}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-gray-900">{p.name}</h2>
                          <span
                            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                            style={{
                              background: p.isActive ? "hsl(162,40%,94%)" : "hsl(0,70%,95%)",
                              color: p.isActive ? "hsl(162,55%,25%)" : "hsl(0,60%,45%)",
                            }}
                          >
                            {p.isActive ? "Active / نشط" : "Inactive / غير نشط"}
                          </span>
                        </div>
                        {p.arabicName && (
                          <p className="arabic-text text-base mb-2" style={{ color: "hsl(162,55%,30%)" }}>{p.arabicName}</p>
                        )}
                        <p className="text-sm text-gray-500 font-mono">Code: {p.code}</p>
                      </div>
                      <Link
                        href={`/admin/programmes/${p.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors hover:bg-gray-50"
                        style={{ borderColor: "hsl(214,32%,91%)", color: "#475569" }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit / تعديل
                      </Link>
                    </div>

                    {p.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-2xl">{p.description}</p>
                    )}

                    {/* Stats row */}
                    <div className="flex gap-6 mt-4">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{p.levels.length}</p>
                        <p className="text-xs text-gray-500">Levels / المستويات</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">{p.courseCount}</p>
                        <p className="text-xs text-gray-500">Courses / المواد</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">{p.studentCount}</p>
                        <p className="text-xs text-gray-500">Students / الطلاب</p>
                      </div>
                      {p.durationYears && (
                        <div>
                          <p className="text-xl font-bold text-gray-900">{p.durationYears}</p>
                          <p className="text-xs text-gray-500">Years / سنوات</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Levels */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Levels</h3>
                        <p className="arabic-text text-xs text-gray-400">المستويات الدراسية</p>
                      </div>
                      <Link
                        href={`/admin/programmes/${p.id}/add-level`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md"
                        style={{ background: "hsl(162,40%,94%)", color: "hsl(162,55%,25%)" }}
                      >
                        <Plus className="w-3 h-3" />
                        Add Level / إضافة مستوى
                      </Link>
                    </div>

                    {p.levels.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">No levels created yet / لا توجد مستويات</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {p.levels.map((level: any) => (
                          <div
                            key={level.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                            style={{ borderColor: "hsl(214,32%,93%)", background: "hsl(210,20%,98.5%)" }}
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{level.name}</p>
                              {level.arabicName && (
                                <p className="arabic-text text-xs" style={{ color: "hsl(162,55%,30%)" }}>{level.arabicName}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-0.5">Year {level.levelNumber}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2 z-50" style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}>
        {[
          { name: "Dashboard", arabic: "الرئيسية", href: "/admin/dashboard", icon: TrendingUp, active: false },
          { name: "Students", arabic: "الطلاب", href: "/admin/students", icon: Users, active: false },
          { name: "Admissions", arabic: "القبول", href: "/admin/admissions", icon: UserPlus, active: false },
          { name: "Programmes", arabic: "البرامج", href: "/admin/programmes", icon: Layers, active: true },
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