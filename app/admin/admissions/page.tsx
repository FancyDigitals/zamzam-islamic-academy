import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PortalHeader } from "@/components/layout/portal-header";
import { UserPlus, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdmissionsData() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) return null;

  const { db } = await import("@/lib/db");
  const { admissions } = await import("@/lib/db/schema");
  const { desc } = await import("drizzle-orm");

  const allAdmissions = await db
    .select()
    .from(admissions)
    .orderBy(desc(admissions.createdAt));

  return { session, admissions: allAdmissions };
}

export default async function AdminAdmissionsPage() {
  const data = await getAdmissionsData();

  if (!data) {
    redirect("/login");
  }

  const { admissions: admissionList } = data;

  // STRICT EDITORIAL STATUS COLOR CODES (PART 6 DESIGN SYSTEM)
  const statusColors: Record<string, { bg: string; color: string; label: string; arabic: string }> = {
    submitted: { bg: "hsl(215, 40%, 94%)", color: "hsl(215, 45%, 40%)", label: "Submitted", arabic: "مقدم" },
    under_review: { bg: "hsl(40, 70%, 92%)", color: "hsl(35, 75%, 42%)", label: "Under Review", arabic: "قيد المراجعة" },
    accepted: { bg: "hsl(155, 30%, 92%)", color: "hsl(155, 40%, 32%)", label: "Accepted", arabic: "مقبول" },
    rejected: { bg: "hsl(0, 50%, 95%)", color: "hsl(0, 60%, 42%)", label: "Rejected", arabic: "مرفوض" },
    waitlisted: { bg: "hsl(40, 70%, 92%)", color: "hsl(35, 75%, 42%)", label: "Waitlisted", arabic: "قائمة الانتظار" },
  };

  const submitted = admissionList.filter((a: any) => a.status === "submitted").length;
  const accepted = admissionList.filter((a: any) => a.status === "accepted").length;
  const rejected = admissionList.filter((a: any) => a.status === "rejected").length;

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      {/* Shared Unified Header */}
      <PortalHeader />

      <div className="flex">
        {/* Shared Unified Sidebar */}
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-10 pb-24 lg:pb-10">
          <div className="mb-8">
            <p
              className="text-xs uppercase mb-2"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Registrar Desk
            </p>
            <h1
              className="text-4xl font-extrabold"
              style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Admissions
            </h1>
            <p className="arabic-text mt-1 text-lg" style={{ color: "hsl(35, 65%, 32%)" }}>
              إدارة طلبات القبول
            </p>
            <p className="text-sm mt-2" style={{ color: "hsl(0, 0%, 40%)" }}>
              {admissionList.length} total applications processed
            </p>
          </div>

          {/* Stats Cards (Branded Grid) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[
              { label: "Total", arabic: "الإجمالي", value: admissionList.length, color: "hsl(0, 0%, 8%)" },
              { label: "Pending", arabic: "قيد الانتظار", value: submitted, color: "hsl(35, 75%, 42%)" },
              { label: "Accepted", arabic: "مقبول", value: accepted, color: "hsl(155, 40%, 32%)" },
              { label: "Rejected", arabic: "مرفوض", value: rejected, color: "hsl(0, 60%, 42%)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="paper-card rounded-lg p-6 text-center"
                style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}
              >
                <p style={{ fontSize: "32px", fontWeight: "800", color: stat.color, letterSpacing: "-0.03em" }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: 700, tracking: "0.1em", color: "hsl(0, 0%, 18%)", marginTop: "4px" }}>
                  {stat.label}
                </p>
                <p className="arabic-text" style={{ fontSize: "12px", color: "hsl(35, 65%, 32%)", marginTop: "2px" }}>
                  {stat.arabic}
                </p>
              </div>
            ))}
          </div>

          {/* Admissions Table */}
          <div className="paper-card rounded-lg overflow-hidden" style={{ background: "white", borderColor: "hsl(35, 20%, 82%)" }}>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "hsl(38, 45%, 94%)", borderBottom: "1px solid hsl(35, 20%, 82%)" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>Application #</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>Applicant</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>Contact</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>Guardian</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>Status</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(0, 0%, 18%)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissionList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "64px 20px", textAlign: "center" }}>
                        <UserPlus style={{ width: "48px", height: "48px", color: "hsl(35, 20%, 82%)", margin: "0 auto 16px" }} />
                        <p style={{ color: "hsl(0, 0%, 18%)", fontWeight: "600" }}>No applications yet</p>
                        <p className="arabic-text mt-1 text-sm" style={{ color: "hsl(35, 65%, 32%)" }}>لم يتم تلقي طلبات بعد</p>
                      </td>
                    </tr>
                  ) : (
                    admissionList.map((a: any) => {
                      const sc = statusColors[a.status] || statusColors.submitted;
                      return (
                        <tr key={a.id} style={{ borderBottom: "1px solid hsl(35, 25%, 88%)" }}>
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: "600", color: "hsl(0, 0%, 8%)" }}>{a.applicationNumber}</span>
                            <p style={{ fontSize: "11px", color: "hsl(0, 0%, 40%)", marginTop: "2px" }}>
                              {new Date(a.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <p style={{ fontSize: "14px", fontWeight: "700", color: "hsl(0, 0%, 8%)" }}>{a.firstName} {a.lastName}</p>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <p style={{ fontSize: "13px", color: "hsl(0, 0%, 18%)", fontWeight: "500" }}>{a.phone || "—"}</p>
                            <p style={{ fontSize: "12px", color: "hsl(0, 0%, 40%)" }}>{a.email || "—"}</p>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <p style={{ fontSize: "13px", color: "hsl(0, 0%, 18%)", fontWeight: "500" }}>{a.guardianName || "—"}</p>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "4px", background: sc.bg, color: sc.color, textTransform: "uppercase" }}>
                              {sc.label} • {sc.arabic}
                            </span>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <Link
                              href={`/admin/admissions/${a.id}`}
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
                              Review
                            </Link>
                          </td>
                        </tr>
                      );
                    })
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