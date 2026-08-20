import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, arabicName, code, description, arabicDescription, programmeId, creditUnits } = body;

    if (!name || !code) {
      return NextResponse.json({ success: false, error: "Course name and code are required." }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    const { courses } = await import("@/lib/db/schema");
    const { eq, sql } = await import("drizzle-orm");

    const existing = await db.query.courses.findFirst({
      where: eq(courses.code, code.toUpperCase()),
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "A course with this code already exists." }, { status: 409 });
    }

    const [maxSort] = await db.select({ max: sql<number>`coalesce(max(sort_order), 0)` }).from(courses);
    const nextSort = Number(maxSort.max) + 1;

    const [newCourse] = await db.insert(courses).values({
      name: name.trim(),
      arabicName: arabicName?.trim() || null,
      code: code.toUpperCase().trim(),
      description: description?.trim() || null,
      arabicDescription: arabicDescription?.trim() || null,
      programmeId: programmeId || null,
      creditUnits: creditUnits ? parseInt(creditUnits) : 1,
      isActive: true,
      sortOrder: nextSort,
    }).returning();

    return NextResponse.json({
      success: true,
      data: { id: newCourse.id, name: newCourse.name },
      message: "Course created successfully.",
    });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ success: false, error: "Failed to create course." }, { status: 500 });
  }
}