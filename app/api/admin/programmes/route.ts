import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, arabicName, code, description, durationYears, objectives, levels: levelData } = body;

    if (!name || !code) {
      return NextResponse.json({ success: false, error: "Programme name and code are required." }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    const { programmes, levels } = await import("@/lib/db/schema");
    const { eq, sql } = await import("drizzle-orm");

    // Check if code already exists
    const existing = await db.query.programmes.findFirst({
      where: eq(programmes.code, code.toUpperCase()),
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "A programme with this code already exists." }, { status: 409 });
    }

    // Get max sort order
    const [maxSort] = await db.select({ max: sql<number>`coalesce(max(sort_order), 0)` }).from(programmes);
    const nextSort = Number(maxSort.max) + 1;

    // Create programme
    const [newProgramme] = await db.insert(programmes).values({
      name: name.trim(),
      arabicName: arabicName?.trim() || null,
      code: code.toUpperCase().trim(),
      description: description?.trim() || null,
      durationYears: durationYears ? parseInt(durationYears) : null,
      objectives: objectives?.trim() || null,
      isActive: true,
      sortOrder: nextSort,
    }).returning();

    // Create levels if provided
    if (levelData && Array.isArray(levelData) && levelData.length > 0) {
      for (let i = 0; i < levelData.length; i++) {
        const lvl = levelData[i];
        await db.insert(levels).values({
          programmeId: newProgramme.id,
          name: lvl.name?.trim() || `${name} ${i + 1}`,
          arabicName: lvl.arabicName?.trim() || null,
          levelNumber: i + 1,
          isActive: true,
          sortOrder: i + 1,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { id: newProgramme.id, name: newProgramme.name },
      message: "Programme created successfully.",
    });
  } catch (error) {
    console.error("Create programme error:", error);
    return NextResponse.json({ success: false, error: "Failed to create programme." }, { status: 500 });
  }
}