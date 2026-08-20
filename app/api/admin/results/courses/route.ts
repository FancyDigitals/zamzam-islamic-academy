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
    const programmeId = searchParams.get("programmeId");

    const { db } = await import("@/lib/db");
    const { courses } = await import("@/lib/db/schema");
    const { eq, and } = await import("drizzle-orm");

    const allCourses = await db.query.courses.findMany({
      where: and(
        eq(courses.isActive, true),
        programmeId ? eq(courses.programmeId, programmeId) : undefined
      ),
      orderBy: (courses, { asc }) => [asc(courses.sortOrder)],
    });

    return NextResponse.json({ success: true, data: allCourses });
  } catch (error) {
    console.error("Get courses for results error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load courses" },
      { status: 500 }
    );
  }
}