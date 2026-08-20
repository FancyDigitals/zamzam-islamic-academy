import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { admissionId, status, notes } = body;

    if (!admissionId || !status) {
      return NextResponse.json({ success: false, error: "Admission ID and status are required." }, { status: 400 });
    }

    const validStatuses = ["submitted", "under_review", "accepted", "rejected", "waitlisted"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    const { admissions } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    await db
      .update(admissions)
      .set({
        status,
        reviewNotes: notes?.trim() || null,
        reviewedBy: session.userId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(admissions.id, admissionId));

    return NextResponse.json({ success: true, message: "Status updated." });
  } catch (error) {
    console.error("Update admission error:", error);
    return NextResponse.json({ success: false, error: "Failed to update." }, { status: 500 });
  }
}