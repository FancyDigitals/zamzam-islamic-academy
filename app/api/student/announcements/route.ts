import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session || session.role !== "student") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { db } = await import("@/lib/db");
    const {
      announcements,
      students,
      enrollments,
    } = await import("@/lib/db/schema");
    const { eq, and, or, inArray, desc } = await import("drizzle-orm");

    const [student] = await db
      .select({
        id: students.id,
        currentProgrammeId: students.currentProgrammeId,
        currentLevelId: students.currentLevelId,
      })
      .from(students)
      .where(eq(students.userId, session.userId))
      .limit(1);

    if (!student) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const studentEnrollments = await db
      .select({ classId: enrollments.classId })
      .from(enrollments)
      .where(eq(enrollments.studentId, student.id));

    const classIds = studentEnrollments
      .map((e) => e.classId)
      .filter((id): id is string => Boolean(id));

    const filters = [
      eq(announcements.target, "everyone"),
      eq(announcements.target, "students"),
    ];

    if (student.currentProgrammeId) {
      filters.push(
        and(
          eq(announcements.target, "programme"),
          eq(announcements.targetProgrammeId, student.currentProgrammeId)
        )!
      );
    }

    if (student.currentLevelId) {
      filters.push(
        and(
          eq(announcements.target, "level"),
          eq(announcements.targetLevelId, student.currentLevelId)
        )!
      );
    }

    if (classIds.length > 0) {
      filters.push(
        and(
          eq(announcements.target, "class"),
          inArray(announcements.targetClassId, classIds)
        )!
      );
    }

    const list = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        target: announcements.target,
        publishedAt: announcements.publishedAt,
        createdAt: announcements.createdAt,
      })
      .from(announcements)
      .where(and(eq(announcements.isPublished, true), or(...filters)))
      .orderBy(desc(announcements.publishedAt));

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Student announcements API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load announcements" },
      { status: 500 }
    );
  }
}