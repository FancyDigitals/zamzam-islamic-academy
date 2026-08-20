import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PortalHeader } from "@/components/layout/portal-header";
import { 
  Users, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  UserPlus, 
  FileText 
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdminData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) return null;

  const { db } = await import("@/lib/db");
  const { users, students, programmes, courses, admissions, academicSessions } = await import("@/lib/db/schema");
  const { eq, sql } = await import("drizzle-orm");

  // Get full current user record from database
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

  const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(students);
  const [teacherCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "teacher"));
  const [programmeCount] = await db.select({ count: sql<number>`count(*)` }).from(programmes);
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
  const [pendingAdmissions] = await db.select({ count: sql<number>`count(*)` }).from(admissions).where(eq(admissions.status, "submitted"));
  const [totalAdmissions] = await db.select({ count: sql<number>`count(*)` }).from(admissions);

  const currentSession = await db.query.academicSessions.findFirst({
    where: eq(academicSessions.isCurrent, true),
  });

  const recentStudents = await db.query.students.findMany({
    limit: 5,
    orderBy: (students, { desc }) => [desc(students.createdAt)],
  });

  const recentAdmissions = await db.query.admissions.findMany({
    limit: 5,
    orderBy: (admissions, { desc }) => [desc(admissions.createdAt)],
  });

  const studentUsers = [];
  for (const s of recentStudents) {
    const u = await db.query.users.findFirst({
      where: eq(users.id, s.userId),
      columns: { firstName: true, lastName: true, arabicName: true, profilePhoto: true, email: true },
    });
    studentUsers.push({ ...s, user: u });
  }

  return {
    currentUser,
    stats: {
      students: Number(studentCount.count),
      teachers: Number(teacherCount.count),
      programmes: Number(programmeCount.count),
      courses: Number(courseCount.count),
      pendingAdmissions: Number(pendingAdmissions.count),
      totalAdmissions: Number(totalAdmissions.count),
    },
    currentSession,
    recentStudents: studentUsers,
    recentAdmissions,
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminData();

  if (!data) {
    redirect("/login");
  }

  const { currentUser, stats, currentSession, recentStudents, recentAdmissions } = data;

  const adminName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.email
    : "Administrator";

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      {/* 🔴 Pass Database User directly to Header */}
      <PortalHeader user={currentUser} subtitle="Admin Panel" arabicSubtitle="لوحة الإدارة" />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* 🔴 Tighter top padding (p-6) moves content UP cleanly */}
        <main className="flex-1 p-6 lg:p-8 pb-20 max-w-7xl min-w-0">
          
          {/* Welcome Banner */}
          <div 
            className="rounded-lg p-6 lg:p-8 mb-6 text-white relative overflow-hidden shadow-sm" 
            style={{ 
              background: "hsl(0, 0%, 8%)",
              border: "1px solid hsl(35, 20%, 30%)"
            }}
          >
            <div className="relative z-10">
              <p className="text-xs uppercase font-bold tracking-widest mb-1" style={{ color: "hsl(38, 60%, 55%)" }}>
                السلام عليكم — Assalamu Alaikum
              </p>
              
              {/* 🔴 Admin Name is now visible */}
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                {adminName}
              </h1>

              {currentUser?.arabicName && (
                <p className="arabic-text text-lg mt-1" style={{ color: "hsl(38, 60%, 55%)" }}>
                  {currentUser.arabicName}
                </p>
              )}

              <p className="text-sm mt-1" style={{ color: "hsl(40, 45%, 85%)" }}>
                Academy Administrator • مدير الأكاديمية
              </p>

              {currentSession && (
                <div className="mt-4 inline-block px-3.5 py-1 rounded" style={{ background: "hsl(35, 65%, 22%)", border: "1.5px solid hsl(38, 60%, 45%)" }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(42, 75%, 88%)" }}>
                    Active Session: {currentSession.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards Block */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Users, label: "Total Students", arabic: "إجمالي الطلاب", value: stats.students, color: "hsl(38, 60%, 45%)", bg: "hsl(38, 45%, 94%)" },
              { icon: GraduationCap, label: "Teachers", arabic: "المعلمون", value: stats.teachers, color: "hsl(215, 45%, 40%)", bg: "hsl(215, 40%, 94%)" },
              { icon: Layers, label: "Programmes", arabic: "البرامج", value: stats.programmes, color: "hsl(155, 40%, 32%)", bg: "hsl(155, 30%, 92%)" },
              { icon: BookOpen, label: "Courses", arabic: "المواد", value: stats.courses, color: "hsl(38, 60%, 45%)", bg: "hsl(38, 45%, 94%)" },
              { icon: UserPlus, label: "Pending Adm.", arabic: "طلبات القبول المعلقة", value: stats.pendingAdmissions, color: "hsl(0, 60%, 42%)", bg: "hsl(0, 50%, 95%)" },
              { icon: FileText, label: "Total Applications", arabic: "إجمالي الطلبات", value: stats.totalAdmissions, color: "hsl(215, 45%, 40%)", bg: "hsl(215, 40%, 94%)" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="paper-card rounded-lg p-5 flex items-start gap-4 transition-all hover:shadow-sm" 
                  style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
                >
                  <div className="w-12 h-12 rounded flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-3xl font-extrabold leading-none" style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}>
                      {stat.value}
                    </p>
                    <p className="text-xs uppercase font-bold tracking-wider mt-2" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {stat.label}
                    </p>
                    <p className="arabic-text text-xs leading-none mt-1" style={{ color: "hsl(35, 65%, 32%)" }}>
                      {stat.arabic}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Logs & Content Splits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Students Panel */}
            <div className="paper-card rounded-lg p-6" style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "hsl(35, 25%, 88%)" }}>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}>
                    Recent Student Admissions
                  </h2>
                  <p className="arabic-text text-xs mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
                    الطلاب المقبولون مؤخراً
                  </p>
                </div>
                <Link 
                  href="/admin/students" 
                  className="text-xs font-bold px-3.5 py-1.5 rounded transition"
                  style={{ 
                    border: "1.5px solid hsl(0, 0%, 8%)",
                    color: "hsl(0, 0%, 8%)"
                  }}
                >
                  View All
                </Link>
              </div>

              {recentStudents.length === 0 ? (
                <div className="py-12 text-center">
                  <p style={{ color: "hsl(0, 0%, 40%)", fontSize: "14px" }}>No students registered yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentStudents.map((s: any) => (
                    <div 
                      key={s.id} 
                      className="flex items-center gap-3.5 p-3.5 rounded border" 
                      style={{ background: "hsl(40, 40%, 98%)", borderColor: "hsl(35, 25%, 88%)" }}
                    >
                      {s.user?.profilePhoto ? (
                        <img src={s.user.profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover border" />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" 
                          style={{ background: "hsl(38, 45%, 94%)", color: "hsl(38, 60%, 45%)" }}
                        >
                          {s.user?.firstName?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: "hsl(0, 0%, 8%)" }}>
                          {s.user?.firstName} {s.user?.lastName}
                        </p>
                        {s.user?.arabicName && (
                          <p className="arabic-text text-sm truncate leading-none mt-1" style={{ color: "hsl(35, 65%, 32%)" }}>
                            {s.user.arabicName}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                        {s.studentId}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Admissions Applications Panel */}
            <div className="paper-card rounded-lg p-6" style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "hsl(35, 25%, 88%)" }}>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}>
                    Recent Applications
                  </h2>
                  <p className="arabic-text text-xs mt-0.5" style={{ color: "hsl(35, 65%, 32%)" }}>
                    طلبات القبول الأخيرة
                  </p>
                </div>
                <Link 
                  href="/admin/admissions" 
                  className="text-xs font-bold px-3.5 py-1.5 rounded transition"
                  style={{ 
                    border: "1.5px solid hsl(0, 0%, 8%)",
                    color: "hsl(0, 0%, 8%)"
                  }}
                >
                  View All
                </Link>
              </div>

              {recentAdmissions.length === 0 ? (
                <div className="py-12 text-center">
                  <p style={{ color: "hsl(0, 0%, 40%)", fontSize: "14px" }}>No applications received yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentAdmissions.map((a: any) => {
                    const statusColors: Record<string, { bg: string; color: string; text: string }> = {
                      submitted: { bg: "hsl(215, 40%, 94%)", color: "hsl(215, 45%, 40%)", text: "Pending" },
                      under_review: { bg: "hsl(40, 70%, 92%)", color: "hsl(35, 75%, 42%)", text: "Reviewing" },
                      accepted: { bg: "hsl(155, 30%, 92%)", color: "hsl(155, 40%, 32%)", text: "Accepted" },
                      rejected: { bg: "hsl(0, 50%, 95%)", color: "hsl(0, 60%, 42%)", text: "Rejected" },
                    };
                    const sc = statusColors[a.status] || statusColors.submitted;
                    return (
                      <div 
                        key={a.id} 
                        className="flex items-center justify-between p-3.5 rounded border" 
                        style={{ background: "hsl(40, 40%, 98%)", borderColor: "hsl(35, 25%, 88%)" }}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: "hsl(0, 0%, 8%)" }}>
                            {a.firstName} {a.lastName}
                          </p>
                          <p className="text-xs font-mono mt-1" style={{ color: "hsl(0, 0%, 40%)" }}>
                            {a.applicationNumber}
                          </p>
                        </div>
                        <span 
                          className="text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase shrink-0" 
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {sc.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="paper-card rounded-lg p-6 mt-6" style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}>
            <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}>
              Quick Actions
            </h2>
            <p className="arabic-text text-xs mt-0.5 mb-5" style={{ color: "hsl(35, 65%, 32%)" }}>
              إجراءات سريعة
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Manage Students", arabic: "إدارة الطلاب", href: "/admin/students", icon: Users, color: "hsl(38, 60%, 45%)", bg: "hsl(38, 45%, 94%)" },
                { name: "View Admissions", arabic: "عرض القبول", href: "/admin/admissions", icon: UserPlus, color: "hsl(215, 45%, 40%)", bg: "hsl(215, 40%, 94%)" },
                { name: "Academic Curricula", arabic: "البرامج والمناهج", href: "/admin/programmes", icon: Layers, color: "hsl(155, 40%, 32%)", bg: "hsl(155, 30%, 92%)" },
                { name: "Course Registry", arabic: "مستندات المواد", href: "/admin/courses", icon: BookOpen, color: "hsl(38, 60%, 45%)", bg: "hsl(38, 45%, 94%)" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex flex-col items-center gap-3 p-5 rounded border transition hover:shadow-md text-center"
                    style={{ borderColor: "hsl(35, 20%, 82%)", background: "white" }}
                  >
                    <div className="w-12 h-12 rounded flex items-center justify-center shrink-0" style={{ background: action.bg }}>
                      <Icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold leading-tight" style={{ color: "hsl(0, 0%, 18%)" }}>
                        {action.name}
                      </span>
                      <span className="arabic-text block text-xs mt-1" style={{ color: "hsl(35, 65%, 32%)" }}>
                        {action.arabic}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}