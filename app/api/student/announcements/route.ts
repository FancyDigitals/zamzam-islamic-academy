import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { db } = await import("@/lib/db");
    const {
      announcements,
      students,
      enrollments,
      classes,
      levels,
    } = await import("@/lib/db/schema");
    const { eq, and, or, inArray, desc } = await import("drizzle-orm");

    // Find student's programme, level, class
    const [student] = await db
      .select({
        id: students.id,
        programmeId: students.programmeId,
        levelId: students.levelId,
      })
      .from(students)
      .where(eq(students.userId, session.userId))
      .limit(1);

    if (!student) {
      return NextResponse.json({ success: true, announcements: [] });
    }

    // Find student's active class IDs (via enrollments)
    const studentEnrollments = await db
      .select({ classId: enrollments.classId })
      .from(enrollments)
      .where(eq(enrollments.studentId, student.id));

    const classIds = studentEnrollments.map((e) => e.classId).filter(Boolean) as string[];

    // Build filter: everyone OR students OR programme=mine OR level=mine OR class=mine
    const filters = [
      eq(announcements.target, "everyone"),
      eq(announcements.target, "students"),
    ];

    if (student.programmeId) {
      filters.push(
        and(
          eq(announcements.target, "programme"),
          eq(announcements.targetId, student.programmeId)
        )!
      );
    }

    if (student.levelId) {
      filters.push(
        and(
          eq(announcements.target, "level"),
          eq(announcements.targetId, student.levelId)
        )!
      );
    }

    if (classIds.length > 0) {
      filters.push(
        and(
          eq(announcements.target, "class"),
          inArray(announcements.targetId, classIds)
        )!
      );
    }

    const list = await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.isPublished, true),
          or(...filters)
        )
      )
      .orderBy(desc(announcements.publishedAt));

    return NextResponse.json({ success: true, announcements: list });
  } catch (error) {
    console.error("Student announcements error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load announcements" },
      { status: 500 }
    );
  }
}