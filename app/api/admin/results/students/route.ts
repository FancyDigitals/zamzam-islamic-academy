import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (
      !session ||
      (session.role !== "super_admin" && session.role !== "academy_admin")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get("levelId");

    const { db } = await import("@/lib/db");
    const { students, users, levels, programmes } = await import(
      "@/lib/db/schema"
    );
    const { eq, and } = await import("drizzle-orm");

    // Build query — filter by level if provided
    const allStudents = await db.query.students.findMany({
      where: and(
        eq(students.isActive, true),
        levelId ? eq(students.currentLevelId, levelId) : undefined
      ),
      orderBy: (students, { asc }) => [asc(students.studentId)],
    });

    // Enrich with user data, programme, level
    const enriched = [];
    for (const s of allStudents) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, s.userId),
        columns: {
          firstName: true,
          lastName: true,
          arabicName: true,
          profilePhoto: true,
        },
      });

      const programme = s.currentProgrammeId
        ? await db.query.programmes.findFirst({
            where: eq(programmes.id, s.currentProgrammeId),
            columns: { name: true, arabicName: true },
          })
        : null;

      const level = s.currentLevelId
        ? await db.query.levels.findFirst({
            where: eq(levels.id, s.currentLevelId),
            columns: { name: true, arabicName: true },
          })
        : null;

      enriched.push({
        id: s.id,
        studentId: s.studentId,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        arabicName: user?.arabicName || null,
        profilePhoto: user?.profilePhoto || null,
        programme: programme || null,
        level: level || null,
        currentLevelId: s.currentLevelId,
        currentProgrammeId: s.currentProgrammeId,
      });
    }

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("Get students for results error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load students" },
      { status: 500 }
    );
  }
}