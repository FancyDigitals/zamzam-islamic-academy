import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { db } = await import("@/lib/db");
    const { admissions, academicSessions } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    // Get current session
    const currentSession = await db.query.academicSessions.findFirst({
      where: eq(academicSessions.isCurrent, true),
    });

    // Generate Application Number: ZIA-APP-YYYY-XXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `ZIA-APP-${year}-${randomSuffix}`;

    const [newApplication] = await db
      .insert(admissions)
      .values({
        applicationNumber,
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        arabicName: body.arabicName?.trim() || null,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        gender: body.gender || null,
        dateOfBirth: body.dateOfBirth || null,
        address: body.address?.trim() || null,
        
        // Guardian Info
        guardianName: body.guardianName.trim(),
        guardianRelationship: body.guardianRelationship.trim(),
        guardianPhone: body.guardianPhone.trim(),
        guardianEmail: body.guardianEmail?.trim() || null,
        
        // Academic Info
        previousEducation: null,
        programmAppliedId: body.programmAppliedId || null,
        sessionId: currentSession?.id || null,
        status: "submitted",
      })
      .returning();

    return NextResponse.json({
      success: true,
      applicationNumber: newApplication.applicationNumber,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}