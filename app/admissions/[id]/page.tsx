import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, User, GraduationCap } from "lucide-react";
import { UpdateStatusClient } from "./update-status";

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

  const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    submitted: { bg: "hsl(220,70%,95%)", color: "hsl(220,70%,45%)", label: "Submitted / مقدم" },
    under_review: { bg: "hsl(42,80%,93%)", color: "hsl(42,78%,38%)", label: "Under Review / قيد المراجعة" },
    accepted: { bg: "hsl(162,40%,94%)", color: "hsl(162,55%,25%)", label: "Accepted / مقبول" },
    rejected: { bg: "hsl(0,70%,95%)", color: "hsl(0,60%,45%)", label: "Rejected / مرفوض" },
    waitlisted: { bg: "hsl(270,60%,95%)", color: "hsl(270,60%,40%)", label: "Waitlisted / قائمة الانتظار" },
  };

  const sc = statusColors[admission.status] || statusColors.submitted;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <Link href="/admin/admissions" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", textDecoration: "none", marginBottom: "24px" }}>
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to Admissions / العودة للقبول
        </Link>

        {/* Header */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "28px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                {admission.firstName} {admission.lastName}
              </h1>
              <p style={{ fontSize: "14px", fontFamily: "monospace", color: "#64748b" }}>{admission.applicationNumber}</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "20px", background: sc.bg, color: sc.color }}>
              {sc.label}
            </span>
          </div>

          <p style={{ fontSize: "12px", color: "#94a3b8" }}>
            Submitted: {new Date(admission.createdAt).toLocaleDateString()} at {new Date(admission.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Personal */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>Personal Information</h2>
            <p className="arabic-text" style={{ fontSize: "12px", color: "hsl(162,55%,30%)", marginBottom: "16px" }}>المعلومات الشخصية</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Full Name / الاسم</p>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>{admission.firstName} {admission.lastName}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Email / البريد</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{admission.email || "Not provided"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Phone / الهاتف</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{admission.phone || "Not provided"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Gender / الجنس</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>
                  {admission.gender === "male" ? "Male / ذكر" : admission.gender === "female" ? "Female / أنثى" : "Not provided"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Date of Birth / تاريخ الميلاد</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{admission.dateOfBirth || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Guardian */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>Guardian Information</h2>
            <p className="arabic-text" style={{ fontSize: "12px", color: "hsl(162,55%,30%)", marginBottom: "16px" }}>معلومات ولي الأمر</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Guardian Name / اسم ولي الأمر</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{admission.guardianName || "Not provided"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Guardian Phone / هاتف ولي الأمر</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{admission.guardianPhone || "Not provided"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Relationship / العلاقة</p>
                <p style={{ fontSize: "14px", color: "#334155" }}>{admission.guardianRelationship || "Not provided"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>Previous Education / التعليم السابق</p>
                <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>{admission.previousEducation || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <UpdateStatusClient admissionId={admission.id} currentStatus={admission.status} />

      </div>
    </div>
  );
}