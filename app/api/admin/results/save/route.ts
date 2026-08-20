import { NextRequest, NextResponse } from "next/server";

// Calculate grade from score using grading scale
function calculateGrade(
  score: number,
  scale: Array<{
    grade: string;
    gradePoint: string | null;
    minScore: string;
    maxScore: string;
    remark: string | null;
  }>
): { grade: string; gradePoint: string } {
  for (const entry of scale) {
    const min = parseFloat(entry.minScore);
    const max = parseFloat(entry.maxScore);
    if (score >= min && score <= max) {
      return {
        grade: entry.grade,
        gradePoint: entry.gradePoint || "0.00",
      };
    }
  }
  return { grade: "F", gradePoint: "0.00" };
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      studentId,
      courseId,
      termId,
      sessionId,
      caScore,
      examScore,
      teacherRemarks,
    } = body;

    // Validate required fields
    if (!studentId || !courseId || !termId || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "studentId, courseId, termId, sessionId are required",
        },
        { status: 400 }
      );
    }

    if (caScore === undefined && examScore === undefined) {
      return NextResponse.json(
        { success: false, error: "At least one score (CA or Exam) is required" },
        { status: 400 }
      );
    }

    const ca = caScore !== undefined && caScore !== "" ? parseFloat(caScore) : null;
    const exam = examScore !== undefined && examScore !== "" ? parseFloat(examScore) : null;

    if (ca !== null && (isNaN(ca) || ca < 0 || ca > 40)) {
      return NextResponse.json(
        { success: false, error: "CA score must be between 0 and 40" },
        { status: 400 }
      );
    }

    if (exam !== null && (isNaN(exam) || exam < 0 || exam > 60)) {
      return NextResponse.json(
        { success: false, error: "Exam score must be between 0 and 60" },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const {
      teachers,
      classes,
      courseAssignments,
      results,
      gradingScales,
      students,
    } = await import("@/lib/db/schema");
    const { eq, and } = await import("drizzle-orm");

    // 1. Get the student to find their level/class
    const student = await db.query.students.findFirst({
      where: eq(students.id, studentId),
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    if (!student.currentLevelId) {
      return NextResponse.json(
        {
          success: false,
          error: "Student has no level assigned. Assign a programme and level first.",
        },
        { status: 400 }
      );
    }

    // 2. Get or create admin teacher record
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
    }

    // 3. Get or create class for this level + session
    let classRecord = await db.query.classes.findFirst({
      where: and(
        eq(classes.levelId, student.currentLevelId),
        eq(classes.sessionId, sessionId)
      ),
    });

    if (!classRecord) {
      const { levels } = await import("@/lib/db/schema");
      const level = await db.query.levels.findFirst({
        where: eq(levels.id, student.currentLevelId),
      });

      const { academicSessions } = await import("@/lib/db/schema");
      const academicSession = await db.query.academicSessions.findFirst({
        where: eq(academicSessions.id, sessionId),
      });

      const [newClass] = await db
        .insert(classes)
        .values({
          levelId: student.currentLevelId,
          sessionId: sessionId,
          name: `${level?.name || "Level"} — ${academicSession?.name || "Session"}`,
          capacity: 40,
          isActive: true,
        })
        .returning();
      classRecord = newClass;
    }

    // 4. Get or create course assignment
    let assignment = await db.query.courseAssignments.findFirst({
      where: and(
        eq(courseAssignments.courseId, courseId),
        eq(courseAssignments.classId, classRecord.id),
        eq(courseAssignments.sessionId, sessionId),
        eq(courseAssignments.termId, termId)
      ),
    });

    if (!assignment) {
      const [newAssignment] = await db
        .insert(courseAssignments)
        .values({
          courseId: courseId,
          teacherId: teacherRecord.id,
          classId: classRecord.id,
          sessionId: sessionId,
          termId: termId,
          isActive: true,
        })
        .returning();
      assignment = newAssignment;
    }

    // 5. Calculate total and grade
    const total = (ca ?? 0) + (exam ?? 0);

    const gradingScale = await db.query.gradingScales.findMany({
      where: eq(gradingScales.isActive, true),
      orderBy: (gs, { desc }) => [desc(gs.minScore)],
    });

    const { grade, gradePoint } =
      ca !== null || exam !== null
        ? calculateGrade(total, gradingScale)
        : { grade: null, gradePoint: null };

    // 6. Upsert the result
    const existingResult = await db.query.results.findFirst({
      where: and(
        eq(results.studentId, studentId),
        eq(results.courseAssignmentId, assignment.id),
        eq(results.termId, termId)
      ),
    });

    if (existingResult) {
      // Only allow editing draft or submitted results
      if (
        existingResult.status === "approved" ||
        existingResult.status === "published"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot edit a result that is already ${existingResult.status}.`,
          },
          { status: 400 }
        );
      }

      const [updated] = await db
        .update(results)
        .set({
          caScore: ca !== null ? ca.toString() : null,
          examScore: exam !== null ? exam.toString() : null,
          totalScore: total.toString(),
          grade: grade,
          gradePoint: gradePoint,
          teacherRemarks: teacherRemarks || null,
          status: "draft",
          updatedAt: new Date(),
        })
        .where(eq(results.id, existingResult.id))
        .returning();

      return NextResponse.json({
        success: true,
        data: updated,
        message: "Result updated successfully.",
      });
    } else {
      const [newResult] = await db
        .insert(results)
        .values({
          studentId,
          courseAssignmentId: assignment.id,
          termId,
          sessionId,
          caScore: ca !== null ? ca.toString() : null,
          examScore: exam !== null ? exam.toString() : null,
          totalScore: total.toString(),
          grade: grade,
          gradePoint: gradePoint,
          teacherRemarks: teacherRemarks || null,
          status: "draft",
        })
        .returning();

      return NextResponse.json({
        success: true,
        data: newResult,
        message: "Result saved as draft.",
      });
    }
  } catch (error) {
    console.error("Save result error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save result" },
      { status: 500 }
    );
  }
}