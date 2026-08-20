import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Award, Bell, TrendingUp, Hash } from "lucide-react";
import { PortalHeader } from "../../../components/layout/portal-header";

async function getData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || session.role !== "student") return null;

  const { db } = await import("@/lib/db");
  const { students, users, courses, programmes, levels } = await import("@/lib/db/schema");
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
    },
  });

  if (!student) return null;

  const programmeCourses = student.currentProgrammeId
    ? await db.query.courses.findMany({
        where: eq(courses.programmeId, student.currentProgrammeId),
        orderBy: (c, { asc }) => [asc(c.sortOrder)],
      })
    : [];

  const programme = student.currentProgrammeId
    ? await db.query.programmes.findFirst({
        where: eq(programmes.id, student.currentProgrammeId),
        columns: { name: true, arabicName: true, code: true },
      })
    : null;

  const level = student.currentLevelId
    ? await db.query.levels.findFirst({
        where: eq(levels.id, student.currentLevelId),
        columns: { name: true, arabicName: true, levelNumber: true },
      })
    : null;

  return { session, student, user, courses: programmeCourses, programme, level };
}

function groupCourses(courses: any[]) {
  const groups: Record<string, { label: string; arabic: string; courses: any[] }> = {
    ARB: { label: "Arabic Language", arabic: "اللغة العربية", courses: [] },
    QUR: { label: "Qur'anic Sciences", arabic: "علوم القرآن", courses: [] },
    ISL: { label: "Islamic Studies", arabic: "الدراسات الإسلامية", courses: [] },
    OTHER: { label: "Other Courses", arabic: "مواد أخرى", courses: [] },
  };

  for (const course of courses) {
    const prefix = course.code?.split("-")[0] || "OTHER";
    if (groups[prefix]) groups[prefix].courses.push(course);
    else groups.OTHER.courses.push(course);
  }

  return Object.entries(groups).filter(([, g]) => g.courses.length > 0);
}

export default async function StudentCoursesPage() {
  const data = await getData();

  if (!data) {
    redirect("/login");
  }

  const { session, student, user, courses, programme, level } = data;
  const groupedCourses = groupCourses(courses);

  const navItems = [
    { name: "Dashboard", arabic: "الرئيسية", href: "/student/dashboard", icon: TrendingUp, active: false },
    { name: "My Courses", arabic: "موادي الدراسية", href: "/student/courses", icon: BookOpen, active: true },
    { name: "My Results", arabic: "نتائجي", href: "/student/results", icon: Award, active: false },
    { name: "Announcements", arabic: "الإعلانات", href: "/student/announcements", icon: Bell, active: false },
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
          style={{ background: "hsl(0, 0%, 100%)", borderColor: "hsl(35, 20%, 85%)" }}
        >
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors"
                  style={{
                    background: item.active ? "hsl(38, 45%, 94%)" : "transparent",
                    color: item.active ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 40%)",
                    fontWeight: item.active ? 700 : 500,
                    borderLeft: item.active ? "3px solid hsl(38, 60%, 45%)" : "3px solid transparent",
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: item.active ? "hsl(38, 60%, 45%)" : "inherit" }} />
                  <div>
                    <span className="block leading-tight">{item.name}</span>
                    <span className="arabic-text block text-xs opacity-75">{item.arabic}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-4 border-t" style={{ borderColor: "hsl(35, 20%, 88%)" }}>
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors">
              ← Academy Website / الموقع
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Courses</h1>
            <p className="arabic-text text-sm mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
              موادي الدراسية
            </p>
          </div>

          {(programme || level) && (
            <div
              className="rounded-xl p-6 mb-6 flex flex-wrap items-center gap-4 text-white"
              style={{ background: "linear-gradient(135deg, hsl(0,0%,8%) 0%, hsl(0,0%,15%) 60%, hsl(35,65%,22%) 100%)" }}
            >
              <div className="flex-1">
                <p className="text-base font-bold">
                  {programme?.name || "Programme"}
                  {programme?.arabicName && (
                    <span className="arabic-text ml-2 inline font-normal" style={{ color: "hsl(38, 60%, 55%)" }}>
                      {programme.arabicName}
                    </span>
                  )}
                </p>
                <p className="text-xs opacity-75 mt-0.5">
                  {level?.name || "Level"}
                  {level?.arabicName && (
                    <span className="arabic-text ml-2 inline">
                      {level.arabicName}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold tracking-tight">{courses.length}</p>
                <p className="text-xs opacity-75">courses enrolled</p>
              </div>
            </div>
          )}

          {!programme && (
            <div className="paper-card rounded-lg p-8 text-center mb-6">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-bold">No Programme Assigned Yet</p>
              <p className="arabic-text text-xs text-gray-400 mt-1">لم يتم تحديد برنامج بعد</p>
            </div>
          )}

          {groupedCourses.map(([key, group]) => (
            <div key={key} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs uppercase font-extrabold tracking-wider" style={{ color: "hsl(0, 0%, 20%)" }}>
                  {group.label}
                </h2>
                <p className="arabic-text text-xs text-gray-400">{group.arabic}</p>
                <div className="flex-1 h-px" style={{ background: "hsl(35, 20%, 85%)" }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.courses.map((course: any) => (
                  <div key={course.id} className="paper-card p-4 rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 leading-snug">
                          {course.name}
                        </p>
                        {course.arabicName && (
                          <p className="arabic-text text-sm font-medium mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
                            {course.arabicName}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0" style={{ background: "hsl(38, 45%, 94%)", color: "hsl(0, 0%, 8%)" }}>
                        {course.code}
                      </span>
                    </div>

                    {course.description && (
                      <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-2" style={{ borderTop: "1px solid hsl(35, 20%, 90%)" }}>
                      <span className="flex items-center gap-1 font-semibold">
                        <Hash className="w-3 h-3 text-gray-400" />
                        {course.creditUnits} credit unit{course.creditUnits !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}