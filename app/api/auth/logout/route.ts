import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("zia_session");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Logout failed." },
      { status: 500 }
    );
  }
}