import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
} from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PortalHeader } from "@/components/layout/portal-header";
import { AssignProgrammeClient } from "./assign-programme";

export const dynamic = "force-dynamic";

async function getStudentData(studentDbId: string) {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (
    !session ||
    (session.role !== "super_admin" && session.role !== "academy_admin")
  )
    return null;

  const { db } = await import("@/lib/db");
  const { students, users, programmes, levels, classes } = await import(
    "@/lib/db/schema"
  );
  const { eq } = await import("drizzle-orm");

  // Current admin user for header
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

  const student = await db.query.students.findFirst({
    where: eq(students.id, studentDbId),
  });

  if (!student) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, student.userId),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      arabicName: true,
      email: true,
      phone: true,
      profilePhoto: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  let programme = null;
  let level = null;
  let studentClass = null;

  if (student.currentProgrammeId) {
    programme = await db.query.programmes.findFirst({
      where: eq(programmes.id, student.currentProgrammeId),
    });
  }
  if (student.currentLevelId) {
    level = await db.query.levels.findFirst({
      where: eq(levels.id, student.currentLevelId),
    });
  }
  if (student.currentClassId) {
    studentClass = await db.query.classes.findFirst({
      where: eq(classes.id, student.currentClassId),
    });
  }

  const allProgrammes = await db.query.programmes.findMany({
    where: eq(programmes.isActive, true),
  });
  const allLevels = await db.query.levels.findMany({
    where: eq(levels.isActive, true),
  });

  return {
    currentUser,
    student,
    user,
    programme,
    level,
    studentClass,
    allProgrammes,
    allLevels,
  };
}

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getStudentData(id);

  if (!data) {
    redirect("/admin/students");
  }

  const {
    currentUser,
    student,
    user,
    programme,
    level,
    studentClass,
    allProgrammes,
    allLevels,
  } = data;

  const isActive = user?.isActive !== false;

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      <PortalHeader
        user={currentUser}
        subtitle="Admin Panel"
        arabicSubtitle="لوحة الإدارة"
      />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10 min-w-0">
          <div className="max-w-5xl">
            {/* Back link */}
            <Link
              href="/admin/students"
              className="inline-flex items-center gap-2 mb-6 text-sm font-semibold"
              style={{ color: "hsl(0, 0%, 40%)", textDecoration: "none" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Back to Students</span>
              <span
                className="arabic-text text-xs"
                style={{ color: "hsl(35, 65%, 32%)" }}
              >
                العودة للطلاب
              </span>
            </Link>

            {/* Student Hero Card — Deep Ink, not green */}
            <div
              className="rounded-lg p-6 lg:p-8 mb-6 text-white relative overflow-hidden"
              style={{
                background: "hsl(0, 0%, 8%)",
                border: "1px solid hsl(35, 20%, 30%)",
              }}
            >
              <div className="flex items-center gap-5 flex-wrap relative z-10">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                    style={{ border: "2.5px solid hsl(38, 60%, 45%)" }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
                    style={{
                      background: "hsl(38, 45%, 94%)",
                      color: "hsl(38, 60%, 45%)",
                    }}
                  >
                    {user?.firstName?.charAt(0)?.toUpperCase() || "?"}
                    {user?.lastName?.charAt(0)?.toUpperCase() || ""}
                  </div>
                )}

                <div className="min-w-0">
                  <h1
                    className="text-2xl lg:text-3xl font-extrabold"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {user?.arabicName && (
                    <p
                      className="arabic-text text-xl mt-1"
                      style={{ color: "hsl(38, 60%, 55%)" }}
                    >
                      {user.arabicName}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap mt-3">
                    <span
                      className="px-3 py-1 rounded text-xs font-mono font-bold"
                      style={{
                        background: "hsl(35, 65%, 22%)",
                        border: "1px solid hsl(38, 60%, 45%)",
                        color: "hsl(42, 75%, 88%)",
                      }}
                    >
                      {student.studentId}
                    </span>
                    <span
                      className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider"
                      style={{
                        background: isActive
                          ? "hsl(155, 30%, 92%)"
                          : "hsl(0, 50%, 95%)",
                        color: isActive
                          ? "hsl(155, 40%, 32%)"
                          : "hsl(0, 60%, 42%)",
                      }}
                    >
                      {isActive ? "Active • نشط" : "Inactive • غير نشط"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div
                className="paper-card rounded-lg p-6"
                style={{
                  background: "white",
                  borderColor: "hsl(35, 20%, 82%)",
                }}
              >
                <div
                  className="flex justify-between items-baseline mb-5 pb-3 border-b"
                  style={{ borderColor: "hsl(35, 25%, 88%)" }}
                >
                  <h2
                    className="text-lg font-bold"
                    style={{
                      color: "hsl(0, 0%, 8%)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Personal Information
                  </h2>
                  <span
                    className="arabic-text text-xs font-bold"
                    style={{ color: "hsl(35, 65%, 32%)" }}
                  >
                    المعلومات الشخصية
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wider mb-1"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      Full Name / الاسم الكامل
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "hsl(0, 0%, 8%)" }}
                    >
                      {user?.firstName} {user?.lastName}
                    </p>
                    {user?.arabicName && (
                      <p
                        className="arabic-text text-sm mt-0.5"
                        style={{ color: "hsl(35, 65%, 32%)" }}
                      >
                        {user.arabicName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        Email / البريد الإلكتروني
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "hsl(0, 0%, 18%)" }}
                      >
                        {user?.email || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        Phone / الهاتف
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "hsl(0, 0%, 18%)" }}
                      >
                        {user?.phone || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        Date of Birth / تاريخ الميلاد
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "hsl(0, 0%, 18%)" }}
                      >
                        {student.dateOfBirth || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wider mb-1"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      Gender / الجنس
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "hsl(0, 0%, 18%)" }}
                    >
                      {student.gender === "male"
                        ? "Male • ذكر"
                        : student.gender === "female"
                          ? "Female • أنثى"
                          : "Not set"}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wider mb-1.5"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      Account Status / حالة الحساب
                    </p>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded uppercase tracking-wider"
                      style={{
                        background: isActive
                          ? "hsl(155, 30%, 92%)"
                          : "hsl(0, 50%, 95%)",
                        color: isActive
                          ? "hsl(155, 40%, 32%)"
                          : "hsl(0, 60%, 42%)",
                      }}
                    >
                      {isActive ? "Active • نشط" : "Inactive • غير نشط"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div
                className="paper-card rounded-lg p-6"
                style={{
                  background: "white",
                  borderColor: "hsl(35, 20%, 82%)",
                }}
              >
                <div
                  className="flex justify-between items-baseline mb-5 pb-3 border-b"
                  style={{ borderColor: "hsl(35, 25%, 88%)" }}
                >
                  <h2
                    className="text-lg font-bold"
                    style={{
                      color: "hsl(0, 0%, 8%)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Academic Information
                  </h2>
                  <span
                    className="arabic-text text-xs font-bold"
                    style={{ color: "hsl(35, 65%, 32%)" }}
                  >
                    المعلومات الأكاديمية
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <GraduationCap
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        Student ID / رقم الطالب
                      </p>
                      <p
                        className="text-sm font-mono font-bold"
                        style={{ color: "hsl(0, 0%, 8%)" }}
                      >
                        {student.studentId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        Programme / البرنامج
                      </p>
                      {programme ? (
                        <>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "hsl(0, 0%, 8%)" }}
                          >
                            {programme.name}
                          </p>
                          {programme.arabicName && (
                            <p
                              className="arabic-text text-sm mt-0.5"
                              style={{ color: "hsl(35, 65%, 32%)" }}
                            >
                              {programme.arabicName}
                            </p>
                          )}
                        </>
                      ) : (
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "hsl(0, 0%, 60%)" }}
                        >
                          Not assigned • لم يتم التحديد
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        Level / المستوى
                      </p>
                      {level ? (
                        <>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "hsl(0, 0%, 8%)" }}
                          >
                            {level.name}
                          </p>
                          {level.arabicName && (
                            <p
                              className="arabic-text text-sm mt-0.5"
                              style={{ color: "hsl(35, 65%, 32%)" }}
                            >
                              {level.arabicName}
                            </p>
                          )}
                        </>
                      ) : (
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "hsl(0, 0%, 60%)" }}
                        >
                          Not assigned • لم يتم التحديد
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      Class / الفصل
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: studentClass
                          ? "hsl(0, 0%, 18%)"
                          : "hsl(0, 0%, 60%)",
                      }}
                    >
                      {studentClass
                        ? studentClass.name
                        : "Not assigned • لم يتم التحديد"}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      Admission Date / تاريخ القبول
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "hsl(0, 0%, 18%)" }}
                    >
                      {student.admissionDate || "—"}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      Last Login / آخر تسجيل دخول
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "hsl(0, 0%, 18%)" }}
                    >
                      {user?.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assign Programme Module */}
            <div
              className="paper-card rounded-lg p-6"
              style={{
                background: "white",
                borderColor: "hsl(35, 20%, 82%)",
              }}
            >
              <div
                className="flex justify-between items-baseline mb-5 pb-3 border-b"
                style={{ borderColor: "hsl(35, 25%, 88%)" }}
              >
                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "hsl(0, 0%, 8%)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Assign Programme & Level
                </h2>
                <span
                  className="arabic-text text-xs font-bold"
                  style={{ color: "hsl(35, 65%, 32%)" }}
                >
                  تعيين البرنامج والمستوى
                </span>
              </div>

              <AssignProgrammeClient
                studentId={student.id}
                currentProgrammeId={student.currentProgrammeId}
                currentLevelId={student.currentLevelId}
                programmes={allProgrammes}
                levels={allLevels}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}