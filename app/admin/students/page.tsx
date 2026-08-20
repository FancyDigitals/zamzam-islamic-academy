import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PortalHeader } from "@/components/layout/portal-header";
import { Users, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStudentsData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) return null;

  const { db } = await import("@/lib/db");
  const { students, users, programmes, levels } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  // Fetch full user record for current session
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      arabicName: true,
      email: true,
      role: true,
      profilePhoto: true,
    },
  });

  const allStudents = await db.query.students.findMany({
    orderBy: (students, { desc }) => [desc(students.createdAt)],
  });

  const studentList = [];
  for (const s of allStudents) {
    const u = await db.query.users.findFirst({
      where: eq(users.id, s.userId),
      columns: { firstName: true, lastName: true, arabicName: true, profilePhoto: true, email: true, phone: true, isActive: true },
    });

    let programmeName = null;
    let levelName = null;

    if (s.currentProgrammeId) {
      const p = await db.query.programmes.findFirst({ where: eq(programmes.id, s.currentProgrammeId) });
      programmeName = p?.name || null;
    }
    if (s.currentLevelId) {
      const l = await db.query.levels.findFirst({ where: eq(levels.id, s.currentLevelId) });
      levelName = l?.name || null;
    }

    studentList.push({
      ...s,
      user: u,
      programmeName,
      levelName,
    });
  }

  return { currentUser, students: studentList };
}

export default async function AdminStudentsPage() {
  const data = await getStudentsData();

  if (!data) {
    redirect("/login");
  }

  const { currentUser, students: studentList } = data;

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      {/* Shared Unified Portal Header */}
      <PortalHeader user={currentUser} subtitle="Admin Panel" arabicSubtitle="لوحة الإدارة" />

      <div className="flex">
        {/* Shared Unified Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10 min-w-0">
          
          {/* Page Title & Meta Header */}
          <div className="mb-8">
            <p
              className="text-xs uppercase mb-2"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Student Directory
            </p>
            <h1
              className="text-4xl font-extrabold"
              style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Students
            </h1>
            <p className="arabic-text mt-1 text-lg" style={{ color: "hsl(35, 65%, 32%)" }}>
              إدارة الطلاب
            </p>
            <p className="text-sm mt-2" style={{ color: "hsl(0, 0%, 40%)" }}>
              {studentList.length} total students enrolled
            </p>
          </div>

          {/* Students Directory Table Card */}
          <div className="paper-card rounded-lg overflow-hidden" style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "hsl(38, 45%, 94%)", borderBottom: "1px solid hsl(35, 20%, 82%)" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Student / الطالب
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Student ID / الرقم
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Programme / البرنامج
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Level / المستوى
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Contact / التواصل
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Status / الحالة
                    </th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>
                      Actions / إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "64px 20px", textAlign: "center" }}>
                        <Users style={{ width: "48px", height: "48px", color: "hsl(35, 20%, 82%)", margin: "0 auto 16px" }} />
                        <p style={{ color: "hsl(0, 0%, 18%)", fontWeight: "600" }}>No students registered yet</p>
                        <p className="arabic-text mt-1 text-sm" style={{ color: "hsl(35, 65%, 32%)" }}>لا يوجد طلاب مسجلين بعد</p>
                      </td>
                    </tr>
                  ) : (
                    studentList.map((s: any) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid hsl(35, 25%, 88%)" }}>
                        {/* Student Name & Avatar */}
                        <td style={{ padding: "16px 20px" }}>
                          <div className="flex items-center gap-3">
                            {s.user?.profilePhoto ? (
                              <img
                                src={s.user.profilePhoto}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover border shrink-0"
                                style={{ borderColor: "hsl(35, 20%, 82%)" }}
                              />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0"
                                style={{ background: "hsl(38, 45%, 94%)", color: "hsl(38, 60%, 45%)" }}
                              >
                                {s.user?.firstName?.charAt(0).toUpperCase() || "?"}
                                {s.user?.lastName?.charAt(0).toUpperCase() || ""}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>
                                {s.user?.firstName} {s.user?.lastName}
                              </p>
                              {s.user?.arabicName && (
                                <p className="arabic-text text-xs leading-none mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
                                  {s.user.arabicName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Student ID */}
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: "700", color: "hsl(0, 0%, 8%)" }}>
                            {s.studentId}
                          </span>
                        </td>

                        {/* Programme */}
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "500", color: s.programmeName ? "hsl(0, 0%, 18%)" : "hsl(0, 0%, 60%)" }}>
                            {s.programmeName || "Not assigned"}
                          </span>
                        </td>

                        {/* Level */}
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "500", color: s.levelName ? "hsl(0, 0%, 18%)" : "hsl(0, 0%, 60%)" }}>
                            {s.levelName || "Not assigned"}
                          </span>
                        </td>

                        {/* Contact Information */}
                        <td style={{ padding: "16px 20px" }}>
                          <p style={{ fontSize: "13px", color: "hsl(0, 0%, 18%)", fontWeight: "500" }}>{s.user?.email || "—"}</p>
                          {s.user?.phone && (
                            <p style={{ fontSize: "12px", color: "hsl(0, 0%, 40%)", marginTop: "2px" }}>{s.user.phone}</p>
                          )}
                        </td>

                        {/* Account Status Badge */}
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              textTransform: "uppercase",
                              background: s.user?.isActive !== false ? "hsl(155, 30%, 92%)" : "hsl(0, 50%, 95%)",
                              color: s.user?.isActive !== false ? "hsl(155, 40%, 32%)" : "hsl(0, 60%, 42%)",
                            }}
                          >
                            {s.user?.isActive !== false ? "Active • نشط" : "Inactive • غير نشط"}
                          </span>
                        </td>

                        {/* Actions Link */}
                        <td style={{ padding: "16px 20px" }}>
                          <Link
                            href={`/admin/students/${s.id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              padding: "6px 14px",
                              borderRadius: "4px",
                              border: "1.5px solid hsl(0, 0%, 8%)",
                              color: "hsl(0, 0%, 8%)",
                              textDecoration: "none",
                            }}
                          >
                            <Eye style={{ width: "14px", height: "14px" }} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}