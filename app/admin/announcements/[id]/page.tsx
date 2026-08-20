import { redirect, notFound } from "next/navigation";
import { PortalHeader } from "../../../../components/layout/portal-header";
import { EditAnnouncementForm } from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { getSession } = await import("@/lib/auth/session");
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
    redirect("/login");
  }

  const { db } = await import("@/lib/db");
  const { announcements, programmes, levels, classes } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const [announcement] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);

  if (!announcement) notFound();

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
          Edit
        </p>
        <h1
          className="text-4xl font-extrabold mb-1"
          style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.03em" }}
        >
          Edit Announcement
        </h1>
        <p
          className="arabic-text mb-8"
          style={{ color: "hsl(35, 65%, 32%)" }}
        >
          تحرير الإعلان
        </p>

        <EditAnnouncementForm
          announcement={{
            id: announcement.id,
            title: announcement.title,
            titleArabic: announcement.titleArabic,
            content: announcement.content,
            contentArabic: announcement.contentArabic,
            target: announcement.target,
            targetId: announcement.targetId,
            isPublished: announcement.isPublished,
          }}
          programmes={programmesList}
          levels={levelsList}
          classes={classesList}
        />
      </main>
    </div>
  );
}