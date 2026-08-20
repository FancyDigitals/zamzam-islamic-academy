import { NextRequest, NextResponse } from "next/server";

function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `ZIA-APP-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, phone } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { success: false, error: "First name, last name, and phone are required." },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const { admissions } = await import("@/lib/db/schema");

    const applicationNumber = generateApplicationNumber();

    await db.insert(admissions).values({
      applicationNumber,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: body.email?.trim() || null,
      phone: phone.trim(),
      gender: body.gender || null,
      dateOfBirth: body.dateOfBirth || null,
      guardianName: body.guardianName?.trim() || null,
      guardianPhone: body.guardianPhone?.trim() || null,
      guardianRelationship: body.guardianRelationship?.trim() || null,
      previousEducation: body.previousEducation?.trim() || null,
      status: "submitted",
    });

    return NextResponse.json({
      success: true,
      data: { applicationNumber },
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error("Admissions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application." },
      { status: 500 }
    );
  }
}