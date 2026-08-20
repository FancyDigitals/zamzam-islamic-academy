import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";

interface AuditEvent {
  userId?: string;
  userRole?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: event.userId,
      userRole: event.userRole as any,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      details: event.details,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}