import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Award, Bell, TrendingUp, Lock } from "lucide-react";
import { PortalHeader } from "../../../components/layout/portal-header";

async function getData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || session.role !== "student") return null;

  const { db } = await import("@/lib/db");
  const {
    students,
    users,
    results,
    courseAssignments,
    courses,
    terms,
    academicSessions,
  } = await import("@/lib/db/schema");
  const { eq, and } = await import("drizzle-orm");

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

  const publishedResults = await db.query.results.findMany({
    where: and(
      eq(results.studentId, student.id),
      eq(results.status, "published")
    ),
    orderBy: (r, { desc }) => [desc(r.publishedAt)],
  });

  const enriched = [];
  for (const r of publishedResults) {
    const assignment = await db.query.courseAssignments.findFirst({
      where: eq(courseAssignments.id, r.courseAssignmentId),
    });

    const course = assignment
      ? await db.query.courses.findFirst({
          where: eq(courses.id, assignment.courseId),
          columns: {
            name: true,
            arabicName: true,
            code: true,
            creditUnits: true,
          },
        })
      : null;

    const term = await db.query.terms.findFirst({
      where: eq(terms.id, r.termId),
      columns: { name: true, termNumber: true },
    });

    const academicSession = await db.query.academicSessions.findFirst({
      where: eq(academicSessions.id, r.sessionId),
      columns: { name: true },
    });

    enriched.push({ ...r, course, term, academicSession });
  }

  const grouped: Record<
    string,
    {
      sessionName: string;
      terms: Record<
        string,
        { termName: string; termNumber: number; results: typeof enriched }
      >;
    }
  > = {};

  for (const r of enriched) {
    const sKey = r.academicSession?.name || "Unknown Session";
    const tKey = r.term?.name || "Unknown Term";
    if (!grouped[sKey]) grouped[sKey] = { sessionName: sKey, terms: {} };
    if (!grouped[sKey].terms[tKey]) {
      grouped[sKey].terms[tKey] = {
        termName: tKey,
        termNumber: r.term?.termNumber || 0,
        results: [],
      };
    }
    grouped[sKey].terms[tKey].results.push(r);
  }

  return { session, student, user, enriched, grouped };
}

const GRADE_STYLES: Record<
  string,
  { color: string; bg: string; remark: string }
> = {
  A: {
    color: "hsl(0, 0%, 8%)",
    bg: "hsl(38, 45%, 90%)",
    remark: "Excellent / ممتاز",
  },
  B: {
    color: "hsl(215, 45%, 30%)",
    bg: "hsl(215, 40%, 94%)",
    remark: "Very Good / جيد جداً",
  },
  C: {
    color: "hsl(35, 65%, 30%)",
    bg: "hsl(40, 70%, 92%)",
    remark: "Good / جيد",
  },
  D: {
    color: "hsl(25, 80%, 35%)",
    bg: "hsl(25, 80%, 94%)",
    remark: "Pass / مقبول",
  },
  F: {
    color: "hsl(0, 60%, 35%)",
    bg: "hsl(0, 50%, 95%)",
    remark: "Fail / راسب",
  },
};

export default async function StudentResultsPage() {
  const data = await getData();

  if (!data) {
    redirect("/login");
  }

  const { session, user, enriched, grouped } = data;

  const navItems = [
    {
      name: "Dashboard",
      arabic: "الرئيسية",
      href: "/student/dashboard",
      icon: TrendingUp,
      active: false,
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
      active: true,
    },
    {
      name: "Announcements",
      arabic: "الإعلانات",
      href: "/student/announcements",
      icon: Bell,
      active: false,
    },
  ];

  const totalGradePoints = enriched.reduce(
    (sum, r) =>
      sum + parseFloat(r.gradePoint || "0") * (r.course?.creditUnits || 1),
    0
  );
  const totalCredits = enriched.reduce(
    (sum, r) => sum + (r.course?.creditUnits || 1),
    0
  );
  const gpa =
    totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : null;

  const sessionKeys = Object.keys(grouped);

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
        <aside
          className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] border-r p-4"
          style={{
            background: "hsl(0, 0%, 100%)",
            borderColor: "hsl(35, 20%, 85%)",
          }}
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
                    background: item.active
                      ? "hsl(38, 45%, 94%)"
                      : "transparent",
                    color: item.active ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 40%)",
                    fontWeight: item.active ? 700 : 500,
                    borderLeft: item.active
                      ? "3px solid hsl(38, 60%, 45%)"
                      : "3px solid transparent",
                  }}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{
                      color: item.active ? "hsl(38, 60%, 45%)" : "inherit",
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
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
            >
              ← Academy Website / الموقع
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8 max-w-4xl">
          <div className="mb-6">
            <h1
              className="text-2xl font-extrabold text-gray-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              My Results
            </h1>
            <p
              className="arabic-text text-sm mt-0.5"
              style={{ color: "hsl(35, 65%, 32%)" }}
            >
              نتائجي الأكاديمية
            </p>
          </div>

          {enriched.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div
                className="rounded-lg p-5"
                style={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(35, 20%, 85%)",
                }}
              >
                <p className="text-3xl font-extrabold text-gray-900">
                  {enriched.length}
                </p>
                <p className="text-xs font-semibold text-gray-700 mt-1">
                  Published Results
                </p>
                <p className="arabic-text text-xs text-gray-400">نتائج منشورة</p>
              </div>
              {gpa && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(35, 20%, 85%)",
                  }}
                >
                  <p
                    className="text-3xl font-extrabold"
                    style={{ color: "hsl(35, 65%, 32%)" }}
                  >
                    {gpa}
                  </p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    Cumulative GPA
                  </p>
                  <p className="arabic-text text-xs text-gray-400">
                    المعدل التراكمي
                  </p>
                </div>
              )}
              <div
                className="rounded-lg p-5"
                style={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(35, 20%, 85%)",
                }}
              >
                <p className="text-3xl font-extrabold text-gray-900">
                  {totalCredits}
                </p>
                <p className="text-xs font-semibold text-gray-700 mt-1">
                  Credit Units
                </p>
                <p className="arabic-text text-xs text-gray-400">وحدات دراسية</p>
              </div>
            </div>
          )}

          <div
            className="flex items-start gap-3 rounded-lg border p-4 mb-6 text-xs"
            style={{
              background: "hsl(38, 45%, 96%)",
              borderColor: "hsl(35, 25%, 82%)",
              color: "hsl(0, 0%, 20%)",
            }}
          >
            <Lock
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "hsl(38, 60%, 45%)" }}
            />
            <div>
              <p className="font-bold text-gray-900">
                Official Published Results Only
              </p>
              <p className="mt-0.5 opacity-80">
                You are viewing officially published academic records. Draft or
                pending results are not shown.
              </p>
              <p className="arabic-text text-xs mt-1 opacity-70">
                تظهر هنا النتائج المنشورة رسمياً فقط
              </p>
            </div>
          </div>

          {enriched.length === 0 ? (
            <div
              className="rounded-lg p-12 text-center"
              style={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 20%, 85%)",
              }}
            >
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-bold text-base">
                No Published Results Yet
              </p>
              <p className="arabic-text text-xs text-gray-400 mt-1">
                لا توجد نتائج منشورة بعد
              </p>
              <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto">
                Your results will appear here once reviewed and published by the
                academy.
              </p>
            </div>
          ) : (
            sessionKeys.map((sessionKey) => {
              const sessionData = grouped[sessionKey];
              const termKeys = Object.keys(sessionData.terms).sort(
                (a, b) =>
                  sessionData.terms[a].termNumber -
                  sessionData.terms[b].termNumber
              );

              return (
                <div key={sessionKey} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
                      {sessionKey} Academic Session
                    </h2>
                    <div
                      className="flex-1 h-px"
                      style={{ background: "hsl(35, 20%, 85%)" }}
                    />
                  </div>

                  {termKeys.map((termKey) => {
                    const termData = sessionData.terms[termKey];
                    const termTotalScore = termData.results.reduce(
                      (sum, r) => sum + parseFloat(r.totalScore || "0"),
                      0
                    );
                    const termAvg =
                      termData.results.length > 0
                        ? (termTotalScore / termData.results.length).toFixed(1)
                        : "—";

                    return (
                      <div key={termKey} className="mb-4">
                        <div
                          className="flex items-center justify-between px-4 py-2.5 rounded-t-lg text-white"
                          style={{ background: "hsl(0, 0%, 8%)" }}
                        >
                          <span className="text-sm font-bold">
                            {termData.termName}
                          </span>
                          <div className="text-right">
                            <span className="text-xs opacity-75">Average: </span>
                            <span
                              className="text-sm font-bold"
                              style={{ color: "hsl(38, 60%, 55%)" }}
                            >
                              {termAvg}%
                            </span>
                          </div>
                        </div>

                        <div
                          className="rounded-b-lg overflow-hidden"
                          style={{
                            background: "hsl(0, 0%, 100%)",
                            border: "1px solid hsl(35, 20%, 85%)",
                            borderTop: "none",
                          }}
                        >
                          <table className="w-full text-xs">
                            <thead>
                              <tr
                                style={{
                                  background: "hsl(40, 40%, 97%)",
                                  borderBottom:
                                    "1px solid hsl(35, 20%, 85%)",
                                }}
                              >
                                <th className="px-4 py-2.5 text-left font-bold text-gray-700">
                                  Course
                                </th>
                                <th className="px-4 py-2.5 text-center font-bold text-gray-700">
                                  CA (40)
                                </th>
                                <th className="px-4 py-2.5 text-center font-bold text-gray-700">
                                  Exam (60)
                                </th>
                                <th className="px-4 py-2.5 text-center font-bold text-gray-700">
                                  Total
                                </th>
                                <th className="px-4 py-2.5 text-center font-bold text-gray-700">
                                  Grade
                                </th>
                                <th className="px-4 py-2.5 text-left font-bold text-gray-700 hidden sm:table-cell">
                                  Remark
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {termData.results.map((r, i) => {
                                const gs =
                                  GRADE_STYLES[r.grade || ""] ||
                                  GRADE_STYLES.F;
                                return (
                                  <tr
                                    key={r.id}
                                    style={{
                                      borderBottom:
                                        i < termData.results.length - 1
                                          ? "1px solid hsl(35, 20%, 90%)"
                                          : "none",
                                    }}
                                  >
                                    <td className="px-4 py-3">
                                      <p className="font-bold text-gray-900">
                                        {r.course?.name || "—"}
                                      </p>
                                      {r.course?.arabicName && (
                                        <p
                                          className="arabic-text text-xs"
                                          style={{
                                            color: "hsl(35, 65%, 32%)",
                                          }}
                                        >
                                          {r.course.arabicName}
                                        </p>
                                      )}
                                      <p className="text-[11px] text-gray-400 font-mono">
                                        {r.course?.code}
                                      </p>
                                    </td>
                                    <td className="px-4 py-3 text-center font-mono font-semibold text-gray-700">
                                      {r.caScore ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-center font-mono font-semibold text-gray-700">
                                      {r.examScore ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-center font-mono font-extrabold text-gray-900">
                                      {r.totalScore ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span
                                        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black"
                                        style={{
                                          background: gs.bg,
                                          color: gs.color,
                                        }}
                                      >
                                        {r.grade || "—"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                      <span
                                        className="text-xs px-2 py-1 rounded-full font-semibold"
                                        style={{
                                          background: gs.bg,
                                          color: gs.color,
                                        }}
                                      >
                                        {gs.remark}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </main>
      </div>

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-2 z-50"
        style={{
          background: "hsl(0, 0%, 100%)",
          borderColor: "hsl(35, 20%, 85%)",
        }}
      >
        {navItems.map((item) => {
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