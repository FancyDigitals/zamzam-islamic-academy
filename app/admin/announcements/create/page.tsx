import { redirect } from "next/navigation";
import { PortalHeader } from "../../../../components/layout/portal-header";
import { AnnouncementForm } from "./announcement-form";

export const dynamic = "force-dynamic";

export default async function CreateAnnouncementPage() {
  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
    redirect("/login");
  }

  const { db } = await import("@/lib/db");
  const { programmes, levels, classes } = await import("@/lib/db/schema");

  const [programmesList, levelsList, classesList] = await Promise.all([
    db.select({ id: programmes.id, name: programmes.name }).from(programmes),
    db.select({ id: levels.id, name: levels.name }).from(levels),
    db.select({ id: classes.id, name: classes.name }).from(classes),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "hsl(40, 40%, 97%)" }}>
      <PortalHeader />
      <main className="max-w-3xl mx-auto p-6 lg:p-10">
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
          className="text-4xl font-extrabold mb-1"
          style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
        >
          New Announcement
        </h1>
        <p
          className="arabic-text mb-8"
          style={{ color: "hsl(35, 65%, 32%)" }}
        >
          إعلان جديد
        </p>

        <AnnouncementForm
          programmes={programmesList}
          levels={levelsList}
          classes={classesList}
        />
      </main>
    </div>
  );
}