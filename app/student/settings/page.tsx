import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalHeader } from "@/components/layout/portal-header";
import { ChangePasswordForm } from "./change-password-form";

export const dynamic = "force-dynamic";

export default async function StudentSettingsPage() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const { db } = await import("@/lib/db");
  const { users, students } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const [currentUser] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      arabicName: users.arabicName,
      email: users.email,
      phone: users.phone,
      profilePhoto: users.profilePhoto,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const [studentRecord] = await db
    .select({ studentId: students.studentId })
    .from(students)
    .where(eq(students.userId, session.userId))
    .limit(1);

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      <PortalHeader user={currentUser} subtitle="Student Portal" arabicSubtitle="بوابة الطالب" />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex w-64 flex-col border-r min-h-[calc(100vh-64px)] p-4 shrink-0"
          style={{ background: "white", borderColor: "hsl(35, 20%, 85%)" }}
        >
          <SidebarLink href="/student/dashboard" label="Dashboard" labelAr="لوحة التحكم" />
          <SidebarLink href="/student/courses" label="My Courses" labelAr="مقرراتي" />
          <SidebarLink href="/student/results" label="My Results" labelAr="نتائجي" />
          <SidebarLink href="/student/announcements" label="Announcements" labelAr="الإعلانات" />
          <SidebarLink href="/student/settings" label="Settings" labelAr="الإعدادات" active />
        </aside>

        <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10 max-w-4xl">
          <div className="mb-8">
            <p
              className="text-xs uppercase mb-2"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Account Security
            </p>
            <h1
              className="text-4xl font-extrabold"
              style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
            >
              Settings & Password
            </h1>
            <p className="arabic-text mt-1 text-lg" style={{ color: "hsl(35, 65%, 32%)" }}>
              الإعدادات وكلمة المرور
            </p>
          </div>

          <div className="space-y-6">
            {/* Account Details Card */}
            <div
              className="paper-card rounded-lg p-6"
              style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: "hsl(0, 0%, 8%)" }}>
                Account Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Student ID</p>
                  <p className="font-mono font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>
                    {studentRecord?.studentId || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Email Address</p>
                  <p className="font-semibold" style={{ color: "hsl(0, 0%, 18%)" }}>
                    {currentUser?.email || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div
              className="paper-card rounded-lg p-6 lg:p-8"
              style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
            >
              <div className="mb-6 pb-3 border-b" style={{ borderColor: "hsl(35, 25%, 88%)" }}>
                <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>
                  Change Password
                </h2>
                <p className="arabic-text text-xs mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
                  تغيير كلمة المرور
                </p>
              </div>

              <ChangePasswordForm />
            </div>
          </div>
        </main>
      </div>
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
      <span className="arabic-text text-xs mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
        {labelAr}
      </span>
    </Link>
  );
}