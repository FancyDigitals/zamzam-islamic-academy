import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Award, Bell, TrendingUp } from "lucide-react";
import { PortalHeader } from "../../../components/layout/portal-header";

async function getUser() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || session.role !== "student") return null;

  const { db } = await import("@/lib/db");
  const { students, users, programmes, levels } = await import(
    "@/lib/db/schema"
  );
  const { eq } = await import("drizzle-orm");

  const student = await db.query.students.findFirst({
    where: eq(students.userId, session.userId),
  });

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: {
      firstName: true,
      lastName: true,
      arabicName: true,
      profilePhoto: true,
      email: true,
    },
  });

  const programme = student?.currentProgrammeId
    ? await db.query.programmes.findFirst({
        where: eq(programmes.id, student.currentProgrammeId),
        columns: { name: true, arabicName: true },
      })
    : null;

  const level = student?.currentLevelId
    ? await db.query.levels.findFirst({
        where: eq(levels.id, student.currentLevelId),
        columns: { name: true, arabicName: true },
      })
    : null;

  return { session, student, user, programme, level };
}

export default async function StudentDashboardPage() {
  const data = await getUser();

  if (!data) {
    redirect("/login");
  }

  const { session, student, user, programme, level } = data;

  const sidebarLinks = [
    {
      name: "Dashboard",
      arabic: "لوحة التحكم",
      href: "/student/dashboard",
      icon: TrendingUp,
      active: true,
    },
    {
      name: "My Courses",
      arabic: "موادي الدراسية",
      href: "/student/courses",
      icon: BookOpen,
      active: false,
    },
    {
      name: "My Results",
      arabic: "نتائجي",
      href: "/student/results",
      icon: Award,
      active: false,
    },
    {
      name: "Announcements",
      arabic: "الإعلانات",
      href: "/student/announcements",
      icon: Bell,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      <PortalHeader
        subtitle="Student Portal"
        arabicSubtitle="بوابة الطالب"
        user={{
          firstName: user?.firstName || session.firstName,
          lastName: user?.lastName || session.lastName,
          arabicName: user?.arabicName,
          profilePhoto: user?.profilePhoto,
        }}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r p-4"
          style={{
            background: "hsl(0, 0%, 100%)",
            borderColor: "hsl(35, 20%, 85%)",
          }}
        >
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors"
                  style={{
                    background: item.active
                      ? "hsl(38, 45%, 94%)"
                      : "transparent",
                    color: item.active
                      ? "hsl(0, 0%, 8%)"
                      : "hsl(0, 0%, 40%)",
                    fontWeight: item.active ? 700 : 500,
                    borderLeft: item.active
                      ? "3px solid hsl(38, 60%, 45%)"
                      : "3px solid transparent",
                  }}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{
                      color: item.active
                        ? "hsl(38, 60%, 45%)"
                        : "inherit",
                    }}
                  />
                  <div>
                    <span className="block leading-tight">{item.name}</span>
                    <span className="arabic-text block text-xs opacity-75">
                      {item.arabic}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div
            className="mt-auto pt-4 border-t"
            style={{ borderColor: "hsl(35, 20%, 88%)" }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors"
              style={{ color: "hsl(0, 0%, 40%)" }}
            >
              <span>← Academy Website</span>
              <span className="arabic-text text-xs opacity-60">الموقع</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 max-w-5xl pb-24 lg:pb-8">
          {/* Welcome banner */}
          <div
            className="rounded-xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsl(0,0%,8%) 0%, hsl(0,0%,15%) 60%, hsl(35,65%,22%) 100%)",
            }}
          >
            <div className="flex items-start gap-4 relative z-10">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover hidden sm:block shrink-0"
                  style={{ border: "2px solid hsl(38, 60%, 45%)" }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold hidden sm:flex shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "hsl(38, 60%, 55%)",
                  }}
                >
                  {session.firstName.charAt(0)}
                  {session.lastName.charAt(0)}
                </div>
              )}
              <div>
                <p
                  className="text-xs uppercase mb-1"
                  style={{
                    color: "hsl(38, 60%, 55%)",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                >
                  السلام عليكم — Assalamu Alaikum
                </p>
                <h1
                  className="text-2xl sm:text-3xl font-extrabold mb-1"
                  style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
                >
                  {user?.firstName || session.firstName}{" "}
                  {user?.lastName || session.lastName}
                </h1>
                {user?.arabicName && (
                  <p
                    className="arabic-text text-lg"
                    style={{ color: "hsl(38, 55%, 65%)" }}
                  >
                    {user.arabicName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5 relative z-10">
              {student?.studentId && (
                <span
                  className="px-3 py-1 rounded-md text-xs font-mono font-bold"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "hsl(40, 40%, 97%)",
                  }}
                >
                  ID: {student.studentId}
                </span>
              )}
              <span
                className="px-3 py-1 rounded-md text-xs font-semibold"
                style={{
                  background: "hsl(38, 60%, 45%)",
                  color: "hsl(0, 0%, 8%)",
                }}
              >
                Active Student / طالب
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                icon: BookOpen,
                label: "Current Courses",
                arabic: "المواد الحالية",
                value: "—",
              },
              {
                icon: Award,
                label: "Results",
                arabic: "النتائج",
                value: "0",
              },
              {
                icon: TrendingUp,
                label: "Progress",
                arabic: "التقدم",
                value: "Active",
              },
              {
                icon: Bell,
                label: "Announcements",
                arabic: "الإعلانات",
                value: "0",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-lg p-5"
                  style={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(35, 20%, 85%)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center mb-3"
                    style={{ background: "hsl(38, 45%, 94%)" }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    />
                  </div>
                  <p
                    className="text-2xl font-extrabold"
                    style={{
                      color: "hsl(0, 0%, 8%)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs font-semibold mt-1"
                    style={{ color: "hsl(0, 0%, 25%)" }}
                  >
                    {stat.label}
                  </p>
                  <p className="arabic-text text-xs text-gray-400">
                    {stat.arabic}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 rounded-lg p-6"
              style={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 20%, 85%)",
              }}
            >
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Award
                  className="w-4 h-4"
                  style={{ color: "hsl(38, 60%, 45%)" }}
                />
                Recent Results
              </h2>
              <p className="arabic-text text-xs text-gray-400 mb-4">
                النتائج الأخيرة
              </p>
              <div className="text-center py-8">
                <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 text-sm font-medium">
                  No published results yet
                </p>
                <p className="arabic-text text-xs text-gray-400 mt-1">
                  لا توجد نتائج منشورة بعد
                </p>
              </div>
            </div>

            <div
              className="rounded-lg p-6"
              style={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 20%, 85%)",
              }}
            >
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Bell
                  className="w-4 h-4"
                  style={{ color: "hsl(38, 60%, 45%)" }}
                />
                Announcements
              </h2>
              <p className="arabic-text text-xs text-gray-400 mb-4">
                الإعلانات
              </p>
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 text-sm font-medium">
                  No announcements
                </p>
                <p className="arabic-text text-xs text-gray-400 mt-1">
                  لا توجد إعلانات
                </p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div
            className="rounded-lg p-6 mt-6"
            style={{
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(35, 20%, 85%)",
            }}
          >
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Student Information
            </h2>
            <p className="arabic-text text-xs text-gray-400 mb-4">
              معلومات الطالب
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "0.08em" }}
                >
                  Full Name / الاسم الكامل
                </p>
                <p className="font-semibold text-gray-900">
                  {user?.firstName || session.firstName}{" "}
                  {user?.lastName || session.lastName}
                </p>
                {user?.arabicName && (
                  <p
                    className="arabic-text font-semibold mt-0.5"
                    style={{ color: "hsl(35, 65%, 32%)" }}
                  >
                    {user.arabicName}
                  </p>
                )}
              </div>
              <div>
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "0.08em" }}
                >
                  Student ID / رقم الطالب
                </p>
                <p className="font-bold font-mono text-gray-900">
                  {student?.studentId || "Pending"}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "0.08em" }}
                >
                  Email / البريد الإلكتروني
                </p>
                <p className="font-semibold text-gray-900">
                  {user?.email || session.email || "Not set"}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "0.08em" }}
                >
                  Programme / البرنامج
                </p>
                <p className="font-semibold text-gray-900">
                  {programme
                    ? `${programme.name}${programme.arabicName ? ` · ${programme.arabicName}` : ""}`
                    : "Not assigned / لم يتم التحديد"}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "0.08em" }}
                >
                  Level / المستوى
                </p>
                <p className="font-semibold text-gray-900">
                  {level
                    ? `${level.name}${level.arabicName ? ` · ${level.arabicName}` : ""}`
                    : "Not assigned / لم يتم التحديد"}
                </p>
              </div>
              <div>
                <p
                  className="text-xs uppercase font-semibold mb-1"
                  style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "0.08em" }}
                >
                  Admission Date / تاريخ القبول
                </p>
                <p className="font-semibold text-gray-900">
                  {student?.admissionDate || "—"}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2 z-50"
        style={{
          background: "hsl(0, 0%, 100%)",
          borderColor: "hsl(35, 20%, 85%)",
        }}
      >
        {sidebarLinks.map((item) => {
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
                  color: item.active ? "hsl(0, 0%, 8%)" : "#94a3b8",
                }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: item.active ? "hsl(0, 0%, 8%)" : "#94a3b8",
                }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}