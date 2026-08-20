"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export function UpdateStatusClient({ admissionId, currentStatus }: { admissionId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/admissions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionId, status, notes }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to update.");
        return;
      }

      setMessage("Status updated successfully! / تم تحديث الحالة بنجاح");
    } catch {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>Update Application Status</h2>
      <p className="arabic-text" style={{ fontSize: "12px", color: "hsl(162,55%,30%)", marginBottom: "20px" }}>تحديث حالة الطلب</p>

      {message && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "hsl(162,40%,94%)", border: "1px solid hsl(162,40%,80%)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
          <CheckCircle style={{ width: "18px", height: "18px", color: "hsl(162,55%,28%)" }} />
          <p style={{ fontSize: "14px", color: "hsl(162,55%,22%)" }}>{message}</p>
        </div>
      )}

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", color: "#dc2626", fontSize: "14px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "6px" }}>
            Status / الحالة
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", background: "white" }}
          >
            <option value="submitted">Submitted / مقدم</option>
            <option value="under_review">Under Review / قيد المراجعة</option>
            <option value="accepted">Accepted / مقبول</option>
            <option value="rejected">Rejected / مرفوض</option>
            <option value="waitlisted">Waitlisted / قائمة الانتظار</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "6px" }}>
            Review Notes / ملاحظات المراجعة
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", background: "white" }}
          />
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isLoading}
        style={{
          padding: "10px 24px", borderRadius: "8px", background: "hsl(162,55%,28%)",
          color: "white", border: "none", fontSize: "14px", fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
          display: "flex", alignItems: "center", gap: "8px",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
            Updating... / جارٍ التحديث...
          </>
        ) : (
          "Update Status / تحديث الحالة"
        )}
      </button>
    </div>
  );
}