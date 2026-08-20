import { NextResponse } from "next/server";

export async function GET() {
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

    const { db } = await import("@/lib/db");
    const { academicSessions, terms } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const allSessions = await db.query.academicSessions.findMany({
      orderBy: (s, { desc }) => [desc(s.startDate)],
    });

    const allTerms = await db.query.terms.findMany({
      orderBy: (t, { asc }) => [asc(t.termNumber)],
    });

    return NextResponse.json({
      success: true,
      data: { sessions: allSessions, terms: allTerms },
    });
  } catch (error) {
    console.error("Get terms error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load terms" },
      { status: 500 }
    );
  }
}