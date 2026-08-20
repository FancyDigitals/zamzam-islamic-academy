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
      students,
      courses,
      programmes,
      levels,
    } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const student = await db.query.students.findFirst({
      where: eq(students.userId, session.userId),
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student record not found" },
        { status: 404 }
      );
    }

    // If student has no programme assigned, return empty
    if (!student.currentProgrammeId) {
      return NextResponse.json({
        success: true,
        data: {
          courses: [],
          programme: null,
          level: null,
          message: "No programme assigned yet",
        },
      });
    }

    // Get all active courses for the student's programme
    const programmeCourses = await db.query.courses.findMany({
      where: eq(courses.programmeId, student.currentProgrammeId),
      orderBy: (courses, { asc }) => [asc(courses.sortOrder)],
    });

    const programme = await db.query.programmes.findFirst({
      where: eq(programmes.id, student.currentProgrammeId),
      columns: { name: true, arabicName: true, code: true },
    });

    const level = student.currentLevelId
      ? await db.query.levels.findFirst({
          where: eq(levels.id, student.currentLevelId),
          columns: { name: true, arabicName: true, levelNumber: true },
        })
      : null;

    return NextResponse.json({
      success: true,
      data: {
        courses: programmeCourses,
        programme,
        level,
      },
    });
  } catch (error) {
    console.error("Student courses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load courses" },
      { status: 500 }
    );
  }
}