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
      results,
      courseAssignments,
      courses,
      terms,
      academicSessions,
    } = await import("@/lib/db/schema");
    const { eq, and } = await import("drizzle-orm");

    // Get student record
    const student = await db.query.students.findFirst({
      where: eq(students.userId, session.userId),
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student record not found" },
        { status: 404 }
      );
    }

    // Get ONLY published results for this student
    const publishedResults = await db.query.results.findMany({
      where: and(
        eq(results.studentId, student.id),
        eq(results.status, "published")
      ),
      orderBy: (results, { desc }) => [desc(results.publishedAt)],
    });

    // Enrich each result
    const enriched = [];
    for (const r of publishedResults) {
      const assignment = await db.query.courseAssignments.findFirst({
        where: eq(courseAssignments.id, r.courseAssignmentId),
      });

      const course = assignment
        ? await db.query.courses.findFirst({
            where: eq(courses.id, assignment.courseId),
            columns: {
              name: true,
              arabicName: true,
              code: true,
              creditUnits: true,
            },
          })
        : null;

      const term = await db.query.terms.findFirst({
        where: eq(terms.id, r.termId),
        columns: { name: true, termNumber: true },
      });

      const academicSession = await db.query.academicSessions.findFirst({
        where: eq(academicSessions.id, r.sessionId),
        columns: { name: true },
      });

      enriched.push({
        id: r.id,
        caScore: r.caScore,
        examScore: r.examScore,
        totalScore: r.totalScore,
        grade: r.grade,
        gradePoint: r.gradePoint,
        teacherRemarks: r.teacherRemarks,
        publishedAt: r.publishedAt,
        course: course || null,
        term: term || null,
        session: academicSession || null,
      });
    }

    // Group by session → term
    const grouped: Record<
      string,
      {
        sessionName: string;
        terms: Record<
          string,
          { termName: string; termNumber: number; results: typeof enriched }
        >;
      }
    > = {};

    for (const r of enriched) {
      const sKey = r.session?.name || "Unknown Session";
      const tKey = r.term?.name || "Unknown Term";

      if (!grouped[sKey]) {
        grouped[sKey] = { sessionName: sKey, terms: {} };
      }
      if (!grouped[sKey].terms[tKey]) {
        grouped[sKey].terms[tKey] = {
          termName: tKey,
          termNumber: r.term?.termNumber || 0,
          results: [],
        };
      }
      grouped[sKey].terms[tKey].results.push(r);
    }

    return NextResponse.json({
      success: true,
      data: {
        studentId: student.studentId,
        results: enriched,
        grouped,
      },
    });
  } catch (error) {
    console.error("Student results error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load results" },
      { status: 500 }
    );
  }
}