import { NextRequest, NextResponse } from "next/server";

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
    const { admissionId, password } = body;

    if (!admissionId) {
      return NextResponse.json(
        { success: false, error: "admissionId is required" },
        { status: 400 }
      );
    }

    const tempPassword =
      typeof password === "string" && password.length >= 8
        ? password
        : `Zamzam${new Date().getFullYear()}!`;

    const { db } = await import("@/lib/db");
    const {
      admissions,
      users,
      students,
      academicSessions,
    } = await import("@/lib/db/schema");
    const { eq, and, sql, like } = await import("drizzle-orm");
    const { hashPassword } = await import("@/lib/auth/password");

    const admission = await db.query.admissions.findFirst({
      where: eq(admissions.id, admissionId),
    });

    if (!admission) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    if (admission.status !== "accepted") {
      return NextResponse.json(
        {
          success: false,
          error: "Only accepted applications can be converted to students.",
        },
        { status: 400 }
      );
    }

    if (admission.convertedToStudentId) {
      return NextResponse.json(
        {
          success: false,
          error: "This application has already been converted to a student.",
        },
        { status: 409 }
      );
    }

    if (!admission.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Application has no email. Add an email before converting.",
        },
        { status: 400 }
      );
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, admission.email.toLowerCase()),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "A user with this email already exists. Link manually or use another email.",
        },
        { status: 409 }
      );
    }

    // Arabic name: use provided, or null (signup transliteration is separate)
    const arabicName = admission.arabicName || null;

    // Generate Student ID: ZIA-YEAR-####
    const year = new Date().getFullYear();
    const prefix = `ZIA-${year}-`;
    const yearStudents = await db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(like(students.studentId, `${prefix}%`));

    const nextSeq = Number(yearStudents[0]?.count || 0) + 1;
    const studentId = `${prefix}${String(nextSeq).padStart(4, "0")}`;

    const currentSession = await db.query.academicSessions.findFirst({
      where: eq(academicSessions.isCurrent, true),
    });

    const passwordHash = await hashPassword(tempPassword);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: admission.email.toLowerCase().trim(),
        passwordHash,
        role: "student",
        firstName: admission.firstName,
        lastName: admission.lastName,
        arabicName,
        phone: admission.phone,
        isActive: true,
      })
      .returning();

    // Create student
    const admissionDate = new Date().toISOString().slice(0, 10);

    const [newStudent] = await db
      .insert(students)
      .values({
        userId: newUser.id,
        studentId,
        dateOfBirth: admission.dateOfBirth,
        gender: admission.gender,
        address: admission.address,
        admissionDate,
        currentProgrammeId: admission.programmAppliedId,
        currentLevelId: admission.preferredLevelId,
        currentSessionId: currentSession?.id || admission.sessionId,
        isActive: true,
        notes: `Converted from application ${admission.applicationNumber}`,
      })
      .returning();

    // Mark admission converted + keep accepted
    await db
      .update(admissions)
      .set({
        status: "accepted",
        convertedToStudentId: newStudent.id,
        reviewedBy: session.userId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(admissions.id, admission.id));

    // Optional: create guardian record if name exists
    if (admission.guardianName) {
      try {
        const { guardians } = await import("@/lib/db/schema");
        const nameParts = admission.guardianName.trim().split(/\s+/);
        const gFirst = nameParts[0] || admission.guardianName;
        const gLast = nameParts.slice(1).join(" ") || "—";

        await db.insert(guardians).values({
          studentId: newStudent.id,
          firstName: gFirst,
          lastName: gLast,
          relationship: admission.guardianRelationship || "Guardian",
          phone: admission.guardianPhone,
          email: admission.guardianEmail,
          isPrimary: true,
        });
      } catch (gErr) {
        console.error("Guardian create skipped:", gErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Student account created successfully.",
      data: {
        studentId: newStudent.studentId,
        studentRecordId: newStudent.id,
        userId: newUser.id,
        email: newUser.email,
        temporaryPassword: tempPassword,
      },
    });
  } catch (error) {
    console.error("Convert admission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to convert application." },
      { status: 500 }
    );
  }
}