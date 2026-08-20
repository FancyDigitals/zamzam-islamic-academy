import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      titleArabic,
      content,
      contentArabic,
      target,
      targetId,
      isPublished,
    } = body;

    if (!title || !content || !target) {
      return NextResponse.json(
        { success: false, error: "Title, content and target are required" },
        { status: 400 }
      );
    }

    const validTargets = ["everyone", "students", "teachers", "programme", "level", "class"];
    if (!validTargets.includes(target)) {
      return NextResponse.json(
        { success: false, error: "Invalid target" },
        { status: 400 }
      );
    }

    if (["programme", "level", "class"].includes(target) && !targetId) {
      return NextResponse.json(
        { success: false, error: "Target ID is required for programme/level/class" },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const { announcements } = await import("@/lib/db/schema");

    const [created] = await db
      .insert(announcements)
      .values({
        title,
        titleArabic: titleArabic || null,
        content,
        contentArabic: contentArabic || null,
        target,
        targetId: targetId || null,
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null,
        createdBy: session.userId,
      })
      .returning();

    return NextResponse.json({ success: true, announcement: created });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { db } = await import("@/lib/db");
    const { announcements } = await import("@/lib/db/schema");
    const { desc } = await import("drizzle-orm");

    const list = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));

    return NextResponse.json({ success: true, announcements: list });
  } catch (error) {
    console.error("List announcements error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list announcements" },
      { status: 500 }
    );
  }
}