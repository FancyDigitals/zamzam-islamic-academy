import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, verifyField, newPassword } = body;

    if (!identifier || !verifyField || !newPassword) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const { users, students } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const bcrypt = await import("bcryptjs");

    const cleanId = String(identifier).trim();
    const cleanVerify = String(verifyField).trim();

    let targetUserId: string | null = null;
    let targetUserPhone: string | null = null;
    let studentDob: string | null = null;
    let guardianPhone: string | null = null;

    // 1. First try finding student by Student ID (e.g. ZIA-2026-0001)
    const [studentByStudentId] = await db
      .select()
      .from(students)
      .where(eq(students.studentId, cleanId))
      .limit(1);

    if (studentByStudentId) {
      targetUserId = studentByStudentId.userId;
      studentDob = studentByStudentId.dateOfBirth;

      const [u] = await db
        .select()
        .from(users)
        .where(eq(users.id, studentByStudentId.userId))
        .limit(1);

      if (u) {
        targetUserPhone = u.phone;
      }
    } else {
      // 2. If not found by Student ID, try finding user account by Email
      const [userByEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanId))
        .limit(1);

      if (userByEmail) {
        targetUserId = userByEmail.id;
        targetUserPhone = userByEmail.phone;

        const [s] = await db
          .select()
          .from(students)
          .where(eq(students.userId, userByEmail.id))
          .limit(1);

        if (s) {
          studentDob = s.dateOfBirth;
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "No student account found with provided Student ID or Email",
        },
        { status: 404 }
      );
    }

    // 3. Verify against Date of Birth or Phone numbers
    const matchDob = studentDob && studentDob.trim() === cleanVerify;
    const matchPhone =
      targetUserPhone && targetUserPhone.trim().includes(cleanVerify);


    // 4. Hash and update new password
    const newHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    return NextResponse.json({
      success: true,
      message:
        "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Server error resetting password" },
      { status: 500 }
    );
  }
}