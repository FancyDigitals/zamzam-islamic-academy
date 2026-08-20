"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, UserPlus, Copy } from "lucide-react";
import Link from "next/link";

export function UpdateStatusClient({
  admissionId,
  currentStatus,
  alreadyConverted,
  hasEmail,
}: {
  admissionId: string;
  currentStatus: string;
  alreadyConverted: boolean;
  hasEmail: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [convertResult, setConvertResult] = useState<{
    studentId: string;
    email: string;
    temporaryPassword: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

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

      setMessage("Status updated successfully.");
      router.refresh();
    } catch {
      setError("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    if (
      !confirm(
        "Create a student portal account from this accepted application?\n\nA temporary password will be shown once. Share it with the student securely."
      )
    ) {
      return;
    }

    setIsConverting(true);
    setError("");
    setMessage("");
    setConvertResult(null);

    try {
      const response = await fetch("/api/admin/admissions/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionId }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Conversion failed.");
        return;
      }

      setConvertResult({
        studentId: result.data.studentId,
        email: result.data.email,
        temporaryPassword: result.data.temporaryPassword,
      });
      setMessage(result.message || "Student created.");
      router.refresh();
    } catch {
      setError("An error occurred during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  const copyCredentials = () => {
    if (!convertResult) return;
    const text = `Zamzam Islamic Academy — Student Portal\nStudent ID: ${convertResult.studentId}\nEmail: ${convertResult.email}\nTemporary Password: ${convertResult.temporaryPassword}\nLogin: /login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canConvert =
    status === "accepted" &&
    currentStatus === "accepted" &&
    !alreadyConverted &&
    hasEmail;

  return (
    <div className="space-y-4">
      {/* Status card */}
      <div
        className="rounded-lg p-6"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(35, 20%, 85%)",
        }}
      >
        <h2
          className="text-base font-bold mb-1"
          style={{ color: "hsl(0, 0%, 8%)" }}
        >
          Update Application Status
        </h2>
        <p
          className="arabic-text text-xs mb-5"
          style={{ color: "hsl(35, 65%, 32%)" }}
        >
          تحديث حالة الطلب
        </p>

        {message && !convertResult && (
          <div
            className="flex items-center gap-2 rounded-md p-3 mb-4 text-sm"
            style={{
              background: "hsl(38, 45%, 94%)",
              color: "hsl(0, 0%, 15%)",
            }}
          >
            <CheckCircle
              className="w-4 h-4 shrink-0"
              style={{ color: "hsl(155, 40%, 32%)" }}
            />
            {message}
          </div>
        )}

        {error && (
          <div
            className="rounded-md p-3 mb-4 text-sm"
            style={{
              background: "hsl(0, 50%, 96%)",
              border: "1px solid hsl(0, 60%, 85%)",
              color: "hsl(0, 60%, 40%)",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "hsl(0, 0%, 35%)" }}
            >
              Status / الحالة
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={alreadyConverted}
              className="w-full h-11 px-3 rounded-md text-sm outline-none"
              style={{
                background: "hsl(40, 40%, 97%)",
                border: "1px solid hsl(35, 20%, 82%)",
                color: "hsl(0, 0%, 8%)",
              }}
            >
              <option value="submitted">Submitted / مقدم</option>
              <option value="under_review">Under Review / قيد المراجعة</option>
              <option value="accepted">Accepted / مقبول</option>
              <option value="rejected">Rejected / مرفوض</option>
              <option value="waitlisted">Waitlisted / قائمة الانتظار</option>
            </select>
          </div>
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "hsl(0, 0%, 35%)" }}
            >
              Review Notes / ملاحظات
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              disabled={alreadyConverted}
              className="w-full h-11 px-3 rounded-md text-sm outline-none"
              style={{
                background: "hsl(40, 40%, 97%)",
                border: "1px solid hsl(35, 20%, 82%)",
                color: "hsl(0, 0%, 8%)",
              }}
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isLoading || alreadyConverted}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "hsl(0, 0%, 8%)" }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </button>
      </div>

      {/* Convert card */}
      <div
        className="rounded-lg p-6"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(35, 20%, 85%)",
        }}
      >
        <h2
          className="text-base font-bold mb-1 flex items-center gap-2"
          style={{ color: "hsl(0, 0%, 8%)" }}
        >
          <UserPlus
            className="w-4 h-4"
            style={{ color: "hsl(38, 60%, 45%)" }}
          />
          Convert to Student Account
        </h2>
        <p
          className="arabic-text text-xs mb-3"
          style={{ color: "hsl(35, 65%, 32%)" }}
        >
          تحويل إلى حساب طالب
        </p>
        <p
          className="text-sm mb-4"
          style={{ color: "hsl(0, 0%, 40%)", lineHeight: 1.55 }}
        >
          Creates a portal login, Student ID, and student record. Only available
          after the application is <strong>Accepted</strong>.
        </p>

        {alreadyConverted && (
          <div
            className="rounded-md p-3 text-sm font-medium mb-3"
            style={{
              background: "hsl(38, 45%, 94%)",
              color: "hsl(0, 0%, 20%)",
            }}
          >
            ✓ Already converted to a student account.
            <Link
              href="/admin/students"
              className="block mt-2 font-bold underline"
              style={{ color: "hsl(35, 65%, 32%)" }}
            >
              View students →
            </Link>
          </div>
        )}

        {!hasEmail && !alreadyConverted && (
          <div
            className="rounded-md p-3 text-sm mb-3"
            style={{
              background: "hsl(40, 70%, 94%)",
              color: "hsl(35, 65%, 28%)",
            }}
          >
            This application has no email. An email is required to create a
            login.
          </div>
        )}

        {currentStatus !== "accepted" && !alreadyConverted && (
          <div
            className="rounded-md p-3 text-sm mb-3"
            style={{
              background: "hsl(40, 40%, 97%)",
              color: "hsl(0, 0%, 40%)",
            }}
          >
            Set status to <strong>Accepted</strong> first, then convert.
          </div>
        )}

        {convertResult && (
          <div
            className="rounded-md p-4 mb-4"
            style={{
              background: "hsl(38, 45%, 94%)",
              border: "1px solid hsl(35, 30%, 82%)",
            }}
          >
            <p className="text-sm font-bold mb-3" style={{ color: "hsl(0, 0%, 8%)" }}>
              Student account created — copy credentials now
            </p>
            <div className="space-y-2 text-sm font-mono" style={{ color: "hsl(0, 0%, 15%)" }}>
              <p>
                <span className="font-sans text-xs text-gray-500 block">Student ID</span>
                {convertResult.studentId}
              </p>
              <p>
                <span className="font-sans text-xs text-gray-500 block">Email</span>
                {convertResult.email}
              </p>
              <p>
                <span className="font-sans text-xs text-gray-500 block">Temporary Password</span>
                {convertResult.temporaryPassword}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCredentials}
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-md"
              style={{
                background: "hsl(0, 0%, 8%)",
                color: "white",
              }}
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy credentials"}
            </button>
            <Link
              href="/admin/students"
              className="ml-3 text-xs font-bold underline"
              style={{ color: "hsl(35, 65%, 32%)" }}
            >
              Open students list
            </Link>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!canConvert || isConverting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canConvert ? "hsl(38, 60%, 45%)" : "hsl(35, 20%, 85%)",
            color: canConvert ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 45%)",
          }}
        >
          {isConverting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating student...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Convert to Student
            </>
          )}
        </button>
      </div>
    </div>
  );
}