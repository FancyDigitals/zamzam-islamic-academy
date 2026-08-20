import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalHeader } from "@/components/layout/portal-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
    redirect("/login");
  }

  const { db } = await import("@/lib/db");
  const { announcements, users } = await import("@/lib/db/schema");
  const { desc, eq } = await import("drizzle-orm");

  let list: any[] = [];
  try {
    list = await db
      .select({
  id: announcements.id,
  title: announcements.title,
  target: announcements.target,
        isPublished: announcements.isPublished,
        publishedAt: announcements.publishedAt,
        createdAt: announcements.createdAt,
        creatorFirstName: users.firstName,
        creatorLastName: users.lastName,
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.createdBy, users.id))
      .orderBy(desc(announcements.createdAt));
  } catch (err) {
    console.error("Database query failed inside announcements list page:", err);
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      <PortalHeader />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        <main className="flex-1 p-6 lg:p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p
                className="text-xs uppercase mb-2"
                style={{
                  color: "hsl(38, 60%, 45%)",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                }}
              >
                Communications
              </p>
              <h1
                className="text-4xl font-extrabold"
                style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
              >
                Announcements
              </h1>
              <p
                className="arabic-text mt-1"
                style={{ color: "hsl(35, 65%, 32%)" }}
              >
                الإعلانات
              </p>
            </div>

            <Link
              href="/admin/announcements/create"
              className="px-5 py-3 rounded-md transition"
              style={{
                background: "hsl(0, 0%, 8%)",
                color: "white",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              + New Announcement
            </Link>
          </div>

          {list.length === 0 ? (
            <div className="paper-card p-12 rounded-lg text-center">
              <p style={{ color: "hsl(0, 0%, 40%)" }}>
                No announcements yet. Create your first one.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((a) => (
                <div key={a.id} className="paper-card p-5 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <TargetBadge target={a.target} />
                        {a.isPublished ? (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              background: "hsl(155, 30%, 92%)",
                              color: "hsl(155, 40%, 32%)",
                              fontWeight: 600,
                            }}
                          >
                            Published
                          </span>
                        ) : (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              background: "hsl(0, 0%, 92%)",
                              color: "hsl(0, 0%, 40%)",
                              fontWeight: 600,
                            }}
                          >
                            Draft
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-lg font-bold truncate"
                        style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.01em" }}
                      >
                        {a.title}
                      </h3>

                      <p
                        className="text-xs mt-2"
                        style={{ color: "hsl(0, 0%, 40%)" }}
                      >
                        By {a.creatorFirstName || "System"} {a.creatorLastName || ""} •{" "}
                        {new Date(a.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <Link
                      href={`/admin/announcements/${a.id}`}
                      className="px-4 py-2 rounded text-sm whitespace-nowrap"
                      style={{
                        border: "1.5px solid hsl(0, 0%, 8%)",
                        color: "hsl(0, 0%, 8%)",
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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

function TargetBadge({ target }: { target: string }) {
  const labels: Record<string, { en: string; ar: string; color: string }> = {
    everyone: { en: "Everyone", ar: "الجميع", color: "hsl(215, 45%, 40%)" },
    students: { en: "All Students", ar: "الطلاب", color: "hsl(38, 60%, 45%)" },
    teachers: { en: "All Teachers", ar: "المعلمون", color: "hsl(38, 60%, 45%)" },
    programme: { en: "Programme", ar: "برنامج", color: "hsl(155, 40%, 32%)" },
    level: { en: "Level", ar: "مستوى", color: "hsl(155, 40%, 32%)" },
    class: { en: "Class", ar: "فصل", color: "hsl(155, 40%, 32%)" },
  };
  const info = labels[target] || labels.everyone;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded"
      style={{
        background: "hsl(38, 45%, 94%)",
        color: info.color,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {info.en}
    </span>
  );
}