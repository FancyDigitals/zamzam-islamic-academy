import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const { db } = await import("@/lib/db");
    const { announcements } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.titleArabic !== undefined) updateData.titleArabic = body.titleArabic;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.contentArabic !== undefined) updateData.contentArabic = body.contentArabic;
    if (body.target !== undefined) updateData.target = body.target;
    if (body.targetId !== undefined) updateData.targetId = body.targetId;

    if (body.isPublished !== undefined) {
      updateData.isPublished = !!body.isPublished;
      if (body.isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(announcements)
      .set(updateData)
      .where(eq(announcements.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, announcement: updated });
  } catch (error) {
    console.error("Update announcement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params;

    const { db } = await import("@/lib/db");
    const { announcements } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    await db.delete(announcements).where(eq(announcements.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}