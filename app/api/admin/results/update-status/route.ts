import { NextRequest, NextResponse } from "next/server";

type ResultStatus = "submitted" | "approved" | "published";

const VALID_TRANSITIONS: Record<string, ResultStatus[]> = {
  draft: ["submitted"],
  submitted: ["approved", "draft"],
  approved: ["published", "submitted"],
  published: [],
};

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
    const { resultIds, newStatus } = body;

    if (
      !resultIds ||
      !Array.isArray(resultIds) ||
      resultIds.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "resultIds array is required" },
        { status: 400 }
      );
    }

    if (!["submitted", "approved", "published"].includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: "newStatus must be submitted, approved, or published",
        },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const { results } = await import("@/lib/db/schema");
    const { eq, inArray } = await import("drizzle-orm");

    // Fetch all results to check transitions
    const existingResults = await db.query.results.findMany({
      where: inArray(results.id, resultIds),
    });

    const errors: string[] = [];
    const toUpdate: string[] = [];

    for (const r of existingResults) {
      const allowed = VALID_TRANSITIONS[r.status] || [];
      if (!allowed.includes(newStatus as ResultStatus)) {
        errors.push(
          `Result ${r.id}: Cannot move from ${r.status} to ${newStatus}`
        );
      } else {
        toUpdate.push(r.id);
      }
    }

    if (errors.length > 0 && toUpdate.length === 0) {
      return NextResponse.json(
        { success: false, error: errors.join("; ") },
        { status: 400 }
      );
    }

    if (toUpdate.length === 0) {
      return NextResponse.json(
        { success: false, error: "No results to update" },
        { status: 400 }
      );
    }

    // Build update payload
    const now = new Date();
    const updatePayload: Record<string, any> = {
      status: newStatus,
      updatedAt: now,
    };

    if (newStatus === "submitted") {
      updatePayload.submittedBy = session.userId;
      updatePayload.submittedAt = now;
    } else if (newStatus === "approved") {
      updatePayload.approvedBy = session.userId;
      updatePayload.approvedAt = now;
    } else if (newStatus === "published") {
      updatePayload.publishedBy = session.userId;
      updatePayload.publishedAt = now;
    }

    await db
      .update(results)
      .set(updatePayload)
      .where(inArray(results.id, toUpdate));

    return NextResponse.json({
      success: true,
      message: `${toUpdate.length} result(s) updated to ${newStatus}.`,
      data: {
        updated: toUpdate.length,
        skipped: resultIds.length - toUpdate.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error("Update result status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update result status" },
      { status: 500 }
    );
  }
}