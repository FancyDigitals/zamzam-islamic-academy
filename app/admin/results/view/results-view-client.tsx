"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  ChevronDown,
  Award,
} from "lucide-react";

interface ResultItem {
  id: string;
  status: string;
  caScore: string | null;
  examScore: string | null;
  totalScore: string | null;
  grade: string | null;
  gradePoint: string | null;
  teacherRemarks: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  student: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    arabicName: string | null;
    profilePhoto: string | null;
    levelId: string | null;
  };
  course: {
    name: string;
    arabicName: string | null;
    code: string;
  } | null;
  level: { name: string; arabicName: string | null } | null;
}

interface Props {
  termId: string;
  sessionId: string;
  termName: string;
  sessionName: string;
  allLevels: { id: string; name: string; arabicName: string | null }[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; arabic: string; color: string; bg: string; icon: any }
> = {
  draft: {
    label: "Draft",
    arabic: "مسودة",
    color: "hsl(215,16%,47%)",
    bg: "hsl(210,20%,96%)",
    icon: FileText,
  },
  submitted: {
    label: "Submitted",
    arabic: "مُقدَّم",
    color: "hsl(42,78%,40%)",
    bg: "hsl(41,85%,93%)",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    arabic: "مُعتمَد",
    color: "hsl(220,70%,48%)",
    bg: "hsl(220,70%,95%)",
    icon: CheckCircle,
  },
  published: {
    label: "Published",
    arabic: "منشور",
    color: "hsl(162,55%,28%)",
    bg: "hsl(162,40%,94%)",
    icon: Eye,
  },
};

const GRADE_COLORS: Record<string, string> = {
  A: "hsl(162,55%,28%)",
  B: "hsl(220,70%,48%)",
  C: "hsl(42,78%,40%)",
  D: "hsl(25,80%,45%)",
  F: "hsl(0,70%,48%)",
};

export function ResultsViewClient({
  termId,
  sessionId,
  termName,
  sessionName,
  allLevels,
}: Props) {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionState, setActionState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const fetchResults = () => {
    setLoading(true);
    const params = new URLSearchParams({ termId, sessionId });
    if (levelFilter) params.set("levelId", levelFilter);
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/results/list?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setResults(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
    setSelectedIds(new Set());
  }, [termId, sessionId, levelFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === results.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(results.map((r) => r.id)));
    }
  };

  const handleBulkAction = async (newStatus: string) => {
    if (selectedIds.size === 0) return;

    setActionState({ status: "loading", message: "" });

    try {
      const res = await fetch("/api/admin/results/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultIds: Array.from(selectedIds),
          newStatus,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setActionState({
          status: "success",
          message: data.message,
        });
        setSelectedIds(new Set());
        fetchResults();
      } else {
        setActionState({
          status: "error",
          message: data.error || "Action failed",
        });
      }
    } catch {
      setActionState({ status: "error", message: "Network error" });
    }

    setTimeout(
      () => setActionState({ status: "idle", message: "" }),
      4000
    );
  };

  const filteredResults = results;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div
        className="rounded-xl border p-4 flex flex-wrap gap-3"
        style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
      >
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="text-sm border rounded-lg px-3 py-2 focus:outline-none"
          style={{ borderColor: "hsl(214,32%,91%)" }}
        >
          <option value="">All Levels</option>
          {allLevels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border rounded-lg px-3 py-2 focus:outline-none"
          style={{ borderColor: "hsl(214,32%,91%)" }}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
        </select>

        <div className="ml-auto text-sm text-gray-500 self-center">
          {results.length} result(s) found
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div
          className="rounded-xl border p-4 flex flex-wrap items-center gap-3"
          style={{
            background: "hsl(162,40%,96%)",
            borderColor: "hsl(162,40%,82%)",
          }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: "hsl(162,55%,22%)" }}
          >
            {selectedIds.size} selected
          </span>
          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction("submitted")}
              disabled={actionState.status === "loading"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
              style={{ background: "hsl(42,78%,40%)" }}
            >
              {actionState.status === "loading" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              Submit for Review
            </button>
            <button
              onClick={() => handleBulkAction("approved")}
              disabled={actionState.status === "loading"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
              style={{ background: "hsl(220,70%,48%)" }}
            >
              {actionState.status === "loading" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              Approve
            </button>
            <button
              onClick={() => handleBulkAction("published")}
              disabled={actionState.status === "loading"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              {actionState.status === "loading" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              Publish to Students
            </button>
          </div>
        </div>
      )}

      {/* Action feedback */}
      {actionState.status === "success" && (
        <div
          className="flex items-center gap-2 rounded-lg p-3 text-sm"
          style={{ background: "hsl(162,40%,94%)", color: "hsl(162,55%,22%)" }}
        >
          <CheckCircle className="w-4 h-4" />
          {actionState.message}
        </div>
      )}
      {actionState.status === "error" && (
        <div
          className="flex items-center gap-2 rounded-lg p-3 text-sm"
          style={{ background: "hsl(0,70%,97%)", color: "hsl(0,60%,40%)" }}
        >
          <AlertCircle className="w-4 h-4" />
          {actionState.message}
        </div>
      )}

      {/* Results table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading results...
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No results found</p>
            <p className="arabic-text text-xs text-gray-400 mt-1">
              لا توجد نتائج
            </p>
            <Link
              href="/admin/results/entry"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium"
              style={{ color: "hsl(162,55%,28%)" }}
            >
              Enter Results →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(214,32%,91%)" }}>
                  <th className="p-3 text-left w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === results.length &&
                        results.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Student
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Course
                  </th>
                  <th className="p-3 text-center font-medium text-gray-600">
                    CA
                  </th>
                  <th className="p-3 text-center font-medium text-gray-600">
                    Exam
                  </th>
                  <th className="p-3 text-center font-medium text-gray-600">
                    Total
                  </th>
                  <th className="p-3 text-center font-medium text-gray-600">
                    Grade
                  </th>
                  <th className="p-3 text-center font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, i) => {
                  const statusConfig =
                    STATUS_CONFIG[result.status] || STATUS_CONFIG.draft;
                  const StatusIcon = statusConfig.icon;
                  const gradeColor =
                    GRADE_COLORS[result.grade || ""] || "#94a3b8";

                  return (
                    <tr
                      key={result.id}
                      style={{
                        borderBottom:
                          i < filteredResults.length - 1
                            ? "1px solid hsl(214,32%,95%)"
                            : "none",
                        background: selectedIds.has(result.id)
                          ? "hsl(162,40%,97%)"
                          : "white",
                      }}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(result.id)}
                          onChange={() => toggleSelect(result.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {result.student.profilePhoto ? (
                            <img
                              src={result.student.profilePhoto}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: "hsl(162,55%,28%)" }}
                            >
                              {result.student.firstName.charAt(0)}
                              {result.student.lastName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {result.student.firstName}{" "}
                              {result.student.lastName}
                            </p>
                            {result.student.arabicName && (
                              <p
                                className="arabic-text text-xs"
                                style={{ color: "hsl(162,55%,30%)" }}
                              >
                                {result.student.arabicName}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 font-mono">
                              {result.student.studentId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-gray-900">
                          {result.course?.name || "—"}
                        </p>
                        {result.course?.arabicName && (
                          <p
                            className="arabic-text text-xs"
                            style={{ color: "hsl(162,55%,30%)" }}
                          >
                            {result.course.arabicName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 font-mono">
                          {result.course?.code || ""}
                        </p>
                      </td>
                      <td className="p-3 text-center font-mono font-medium text-gray-700">
                        {result.caScore ?? "—"}
                      </td>
                      <td className="p-3 text-center font-mono font-medium text-gray-700">
                        {result.examScore ?? "—"}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-gray-900">
                        {result.totalScore ?? "—"}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className="text-lg font-black"
                          style={{ color: gradeColor }}
                        >
                          {result.grade || "—"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: statusConfig.bg,
                              color: statusConfig.color,
                            }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}