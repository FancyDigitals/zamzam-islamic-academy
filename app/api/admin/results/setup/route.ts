import { NextResponse } from "next/server";

export async function POST() {
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

    const { db } = await import("@/lib/db");
    const {
      users,
      teachers,
      academicSessions,
      levels,
      classes,
    } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    // 1. Ensure admin user has a teacher record
    const adminUser = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    let teacherRecord = await db.query.teachers.findFirst({
      where: eq(teachers.userId, session.userId),
    });

    if (!teacherRecord) {
      const [newTeacher] = await db
        .insert(teachers)
        .values({
          userId: session.userId,
          teacherId: `TCH-ADMIN-001`,
          qualification: "Academy Administrator",
          specialization: "Academic Administration",
          isActive: true,
        })
        .returning();
      teacherRecord = newTeacher;
      console.log("Created admin teacher record:", teacherRecord.id);
    }

    // 2. Get current session
    const currentSession = await db.query.academicSessions.findFirst({
      where: eq(academicSessions.isCurrent, true),
    });

    if (!currentSession) {
      return NextResponse.json(
        { success: false, error: "No active academic session found" },
        { status: 400 }
      );
    }

    // 3. Get all active levels
    const allLevels = await db.query.levels.findMany({
      where: eq(levels.isActive, true),
    });

    // 4. Ensure each level has a class for this session
    let classesCreated = 0;
    for (const level of allLevels) {
      const existingClass = await db.query.classes.findFirst({
        where: (classes, { and, eq }) =>
          and(
            eq(classes.levelId, level.id),
            eq(classes.sessionId, currentSession.id)
          ),
      });

      if (!existingClass) {
        await db.insert(classes).values({
          levelId: level.id,
          sessionId: currentSession.id,
          name: `${level.name} — ${currentSession.name}`,
          capacity: 40,
          isActive: true,
        });
        classesCreated++;
        console.log(`Created class for level: ${level.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Setup complete. Teacher record ready. ${classesCreated} class(es) created.`,
      data: {
        teacherId: teacherRecord.id,
        sessionId: currentSession.id,
        levelsProcessed: allLevels.length,
        classesCreated,
      },
    });
  } catch (error) {
    console.error("Results setup error:", error);
    return NextResponse.json(
      { success: false, error: "Setup failed" },
      { status: 500 }
    );
  }
}