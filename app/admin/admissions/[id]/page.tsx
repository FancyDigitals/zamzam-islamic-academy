import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PortalHeader } from "@/components/layout/portal-header";
import { UpdateStatusClient } from "./update-status";

export const dynamic = "force-dynamic";

async function getAdmissionData(admissionId: string) {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) return null;

  const { db } = await import("@/lib/db");
  const { admissions } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const admission = await db.query.admissions.findFirst({
    where: eq(admissions.id, admissionId),
  });

  if (!admission) return null;
  return { session, admission };
}

export default async function AdminAdmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getAdmissionData(id);

  if (!data) {
    redirect("/admin/admissions");
  }

  const { admission } = data;

  // STRICT EDITORIAL STATUS COLOR CODES (PART 6 DESIGN SYSTEM)
  const statusMap: Record<string, { bg: string; color: string; label: string; labelAr: string }> = {
    submitted: { bg: "hsl(215, 40%, 94%)", color: "hsl(215, 45%, 40%)", label: "Submitted", labelAr: "مقدم" },
    under_review: { bg: "hsl(40, 70%, 92%)", color: "hsl(35, 75%, 42%)", label: "Under Review", labelAr: "قيد المراجعة" },
    accepted: { bg: "hsl(155, 30%, 92%)", color: "hsl(155, 40%, 32%)", label: "Accepted", labelAr: "مقبول" },
    rejected: { bg: "hsl(0, 50%, 95%)", color: "hsl(0, 60%, 42%)", label: "Rejected", labelAr: "مرفوض" },
    waitlisted: { bg: "hsl(40, 70%, 92%)", color: "hsl(35, 75%, 42%)", label: "Waitlisted", labelAr: "قائمة الانتظار" },
  };

  const sc = statusMap[admission.status] || statusMap.submitted;

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      {/* Shared Unified Header */}
      <PortalHeader />

      <div className="flex">
        {/* Shared Unified Sidebar for consistent split-screen layout */}
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10">
          <div className="max-w-4xl">
            {/* Back Link */}
            <Link
              href="/admin/admissions"
              className="inline-flex items-center gap-2 mb-6 text-sm font-semibold transition"
              style={{ color: "hsl(0, 0%, 40%)", textDecoration: "none" }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              <span>Back to Admissions</span>
              <span className="arabic-text text-xs" style={{ color: "hsl(35, 65%, 32%)" }}>العودة للقبول</span>
            </Link>

            {/* Main Header Card */}
            <div
              className="paper-card rounded-lg p-6 lg:p-8 mb-6"
              style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1
                    className="text-3xl font-extrabold"
                    style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
                  >
                    {admission.firstName} {admission.lastName}
                  </h1>
                  <p
                    className="text-sm font-mono mt-1"
                    style={{ color: "hsl(0, 0%, 40%)" }}
                  >
                    {admission.applicationNumber}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-4 py-1.5 rounded"
                  style={{ backgroundColor: sc.bg, color: sc.color, textTransform: "uppercase" }}
                >
                  {sc.label} • {sc.labelAr}
                </span>
              </div>
              <p className="text-xs" style={{ color: "hsl(0, 0%, 40%)" }}>
                Submitted: {new Date(admission.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} at {new Date(admission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div
                className="paper-card rounded-lg p-6"
                style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
              >
                <div className="flex justify-between items-baseline mb-4 border-b pb-3" style={{ borderColor: "hsl(35, 25%, 88%)" }}>
                  <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}>
                    Personal Information
                  </h2>
                  <span className="arabic-text text-xs font-bold" style={{ color: "hsl(35, 65%, 32%)" }}>
                    المعلومات الشخصية
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Full Name / الاسم الكامل
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 8%)" }}>
                      {admission.firstName} {admission.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Email Address / البريد الإلكتروني
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Phone / الهاتف
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Gender / الجنس
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.gender === "male" ? "Male • ذكر" : admission.gender === "female" ? "Female • أنثى" : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Date of Birth / تاريخ الميلاد
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.dateOfBirth || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guardian & School Information */}
              <div
                className="paper-card rounded-lg p-6"
                style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
              >
                <div className="flex justify-between items-baseline mb-4 border-b pb-3" style={{ borderColor: "hsl(35, 25%, 88%)" }}>
                  <h2 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}>
                    Guardian & Background
                  </h2>
                  <span className="arabic-text text-xs font-bold" style={{ color: "hsl(35, 65%, 32%)" }}>
                    ولي الأمر والتعليم السابق
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Guardian Name / اسم ولي الأمر
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 8%)" }}>
                      {admission.guardianName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Guardian Phone / هاتف ولي الأمر
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.guardianPhone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Relationship / العلاقة
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.guardianRelationship || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 40%)" }}>
                      Previous Education / التعليم السابق
                    </p>
                    <p className="text-sm font-semibold mt-0.5 leading-relaxed" style={{ color: "hsl(0, 0%, 18%)" }}>
                      {admission.previousEducation || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Update Status Client Module */}
            <div
              className="paper-card rounded-lg p-6"
              style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
            >
              <UpdateStatusClient
                admissionId={admission.id}
                currentStatus={admission.status}
                alreadyConverted={!!admission.convertedToStudentId}
                hasEmail={!!admission.email}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}