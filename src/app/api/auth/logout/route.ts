import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST() {
  try {
    const session = await getSession();

    if (session) {
      await logAuditEvent({
        userId: session.userId,
        userRole: session.role,
        action: "logout",
        resourceType: "auth",
      });
    }

    await clearSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}