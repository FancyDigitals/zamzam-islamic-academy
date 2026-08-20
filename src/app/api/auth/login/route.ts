import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account has been deactivated. Please contact the academy.",
        },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      await logAuditEvent({
        userId: user.id,
        userRole: user.role,
        action: "login_failed",
        resourceType: "auth",
        ipAddress: request.ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        details: "Invalid password attempt",
      });

      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Log successful login
    await logAuditEvent({
      userId: user.id,
      userRole: user.role,
      action: "login_success",
      resourceType: "auth",
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    // Set cookie
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}