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
    const termId = searchParams.get("termId");
    const sessionId = searchParams.get("sessionId");
    const levelId = searchParams.get("levelId");
    const statusFilter = searchParams.get("status");

    if (!termId || !sessionId) {
      return NextResponse.json(
        { success: false, error: "termId and sessionId are required" },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const {
      results,
      students,
      users,
      courseAssignments,
      courses,
      classes,
      levels,
    } = await import("@/lib/db/schema");
    const { eq, and } = await import("drizzle-orm");

    // Get all results for this term/session
    const allResults = await db.query.results.findMany({
      where: and(
        eq(results.termId, termId),
        eq(results.sessionId, sessionId),
        statusFilter ? eq(results.status, statusFilter as any) : undefined
      ),
      orderBy: (results, { asc }) => [asc(results.createdAt)],
    });

    // Enrich each result
    const enriched = [];
    for (const r of allResults) {
      const student = await db.query.students.findFirst({
        where: eq(students.id, r.studentId),
      });

      if (levelId && student?.currentLevelId !== levelId) continue;

      const user = student
        ? await db.query.users.findFirst({
            where: eq(users.id, student.userId),
            columns: {
              firstName: true,
              lastName: true,
              arabicName: true,
              profilePhoto: true,
            },
          })
        : null;

      const assignment = await db.query.courseAssignments.findFirst({
        where: eq(courseAssignments.id, r.courseAssignmentId),
      });

      const course = assignment
        ? await db.query.courses.findFirst({
            where: eq(courses.id, assignment.courseId),
            columns: { name: true, arabicName: true, code: true },
          })
        : null;

      const classRecord = assignment
        ? await db.query.classes.findFirst({
            where: eq(classes.id, assignment.classId),
          })
        : null;

      const level = classRecord
        ? await db.query.levels.findFirst({
            where: eq(levels.id, classRecord.levelId),
            columns: { name: true, arabicName: true },
          })
        : null;

      enriched.push({
        id: r.id,
        status: r.status,
        caScore: r.caScore,
        examScore: r.examScore,
        totalScore: r.totalScore,
        grade: r.grade,
        gradePoint: r.gradePoint,
        teacherRemarks: r.teacherRemarks,
        submittedAt: r.submittedAt,
        approvedAt: r.approvedAt,
        publishedAt: r.publishedAt,
        student: {
          id: r.studentId,
          studentId: student?.studentId || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          arabicName: user?.arabicName || null,
          profilePhoto: user?.profilePhoto || null,
          levelId: student?.currentLevelId,
        },
        course: course || null,
        level: level || null,
      });
    }

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error("List results error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load results" },
      { status: 500 }
    );
  }
}