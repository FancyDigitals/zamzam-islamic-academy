import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, programmeId, levelId } = body;

    if (!studentId || !programmeId) {
      return NextResponse.json({ success: false, error: "Student and programme are required." }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    const { students } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    await db
      .update(students)
      .set({
        currentProgrammeId: programmeId,
        currentLevelId: levelId || null,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    return NextResponse.json({
      success: true,
      message: "Programme assigned successfully.",
    });
  } catch (error) {
    console.error("Assign error:", error);
    return NextResponse.json({ success: false, error: "Failed to assign programme." }, { status: 500 });
  }
}