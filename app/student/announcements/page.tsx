import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalHeader } from "../../../components/layout/portal-header";

export const dynamic = "force-dynamic";

export default async function StudentAnnouncementsPage() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const { db } = await import("@/lib/db");
  const {
    announcements,
    students,
    enrollments,
  } = await import("@/lib/db/schema");
  const { eq, and, or, inArray, desc } = await import("drizzle-orm");

  const [student] = await db
    .select({
      id: students.id,
      programmeId: students.programmeId,
      levelId: students.levelId,
    })
    .from(students)
    .where(eq(students.userId, session.userId))
    .limit(1);

  let list: Array<{
    id: string;
    title: string;
    titleArabic: string | null;
    content: string;
    contentArabic: string | null;
    target: string;
    publishedAt: Date | null;
  }> = [];

  if (student) {
    const studentEnrollments = await db
      .select({ classId: enrollments.classId })
      .from(enrollments)
      .where(eq(enrollments.studentId, student.id));

    const classIds = studentEnrollments
      .map((e) => e.classId)
      .filter(Boolean) as string[];

    const filters = [
      eq(announcements.target, "everyone"),
      eq(announcements.target, "students"),
    ];

    if (student.programmeId) {
      filters.push(
        and(
          eq(announcements.target, "programme"),
          eq(announcements.targetId, student.programmeId)
        )!
      );
    }

    if (student.levelId) {
      filters.push(
        and(
          eq(announcements.target, "level"),
          eq(announcements.targetId, student.levelId)
        )!
      );
    }

    if (classIds.length > 0) {
      filters.push(
        and(
          eq(announcements.target, "class"),
          inArray(announcements.targetId, classIds)
        )!
      );
    }

    list = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        titleArabic: announcements.titleArabic,
        content: announcements.content,
        contentArabic: announcements.contentArabic,
        target: announcements.target,
        publishedAt: announcements.publishedAt,
      })
      .from(announcements)
      .where(
        and(eq(announcements.isPublished, true), or(...filters))
      )
      .orderBy(desc(announcements.publishedAt));
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      <PortalHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex w-64 flex-col border-r min-h-[calc(100vh-72px)] p-4"
          style={{ background: "white", borderColor: "hsl(35, 20%, 85%)" }}
        >
          <SidebarLink href="/student/dashboard" label="Dashboard" labelAr="لوحة التحكم" />
          <SidebarLink href="/student/courses" label="My Courses" labelAr="مقرراتي" />
          <SidebarLink href="/student/results" label="My Results" labelAr="نتائجي" />
          <SidebarLink
            href="/student/announcements"
            label="Announcements"
            labelAr="الإعلانات"
            active
          />
        </aside>

        <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10">
          <p
            className="text-xs uppercase mb-2"
            style={{
              color: "hsl(38, 60%, 45%)",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            Latest
          </p>
          <h1
            className="text-4xl font-extrabold mb-1"
            style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
          >
            Announcements
          </h1>
          <p
            className="arabic-text mb-8"
            style={{ color: "hsl(35, 65%, 32%)" }}
          >
            الإعلانات
          </p>

          {list.length === 0 ? (
            <div className="paper-card p-12 rounded-lg text-center">
              <p style={{ color: "hsl(0, 0%, 40%)" }}>
                No announcements yet. Check back soon.
              </p>
              <p
                className="arabic-text mt-2"
                style={{ color: "hsl(35, 65%, 32%)" }}
              >
                لا توجد إعلانات حتى الآن
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((a) => (
                <article key={a.id} className="paper-card p-6 rounded-lg">
                  <div
                    className="text-xs mb-3"
                    style={{ color: "hsl(0, 0%, 40%)", fontWeight: 500 }}
                  >
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </div>

                  <h2
                    className="text-2xl font-extrabold mb-1"
                    style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.02em" }}
                  >
                    {a.title}
                  </h2>
                  {a.titleArabic && (
                    <p
                      className="arabic-text text-lg mb-4"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    >
                      {a.titleArabic}
                    </p>
                  )}

                  <div
                    className="whitespace-pre-wrap leading-relaxed"
                    style={{ color: "hsl(0, 0%, 18%)" }}
                  >
                    {a.content}
                  </div>

                  {a.contentArabic && (
                    <div
                      className="arabic-text whitespace-pre-wrap leading-relaxed mt-4 pt-4 border-t"
                      style={{
                        color: "hsl(0, 0%, 18%)",
                        borderColor: "hsl(35, 20%, 88%)",
                      }}
                    >
                      {a.contentArabic}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around py-2"
        style={{ background: "white", borderColor: "hsl(35, 20%, 85%)" }}
      >
        <MobileNavLink href="/student/dashboard" label="Home" />
        <MobileNavLink href="/student/courses" label="Courses" />
        <MobileNavLink href="/student/results" label="Results" />
        <MobileNavLink href="/student/announcements" label="News" active />
      </nav>
    </div>
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
      className="px-4 py-3 rounded-md mb-1 transition"
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
      <div className="flex flex-col">
        <span>{label}</span>
        <span
          className="arabic-text text-xs"
          style={{ color: "hsl(35, 65%, 32%)" }}
        >
          {labelAr}
        </span>
      </div>
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-xs"
      style={{
        color: active ? "hsl(38, 60%, 45%)" : "hsl(0, 0%, 40%)",
        fontWeight: active ? 700 : 500,
      }}
    >
      {label}
    </Link>
  );
}