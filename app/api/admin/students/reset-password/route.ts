import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    if (!session || (session.role !== "super_admin" && session.role !== "academy_admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { studentDbId, newPassword } = await request.json();

    if (!studentDbId || !newPassword) {
      return NextResponse.json({ success: false, error: "Student ID and new password required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    const { students, users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const bcrypt = await import("bcryptjs");

    const [student] = await db
      .select({ userId: students.userId })
      .from(students)
      .where(eq(students.id, studentDbId))
      .limit(1);

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, student.userId));

    return NextResponse.json({ success: true, message: "Student password updated successfully" });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
  }
}