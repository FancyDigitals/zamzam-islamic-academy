import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { db } = await import("@/lib/db");
    const { programmes } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const allProgrammes = await db.query.programmes.findMany({
      where: eq(programmes.isActive, true),
      orderBy: (programmes: any, { asc }: any) => [asc(programmes.sortOrder)],
    });

    return NextResponse.json({ success: true, data: allProgrammes });
  } catch (error) {
    console.error("List programmes error:", error);
    return NextResponse.json({ success: false, error: "Failed to load." }, { status: 500 });
  }
}