"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Save,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";

interface Props {
  currentSession: { id: string; name: string };
  currentTerm: { id: string; name: string } | null;
  allTerms: { id: string; name: string; termNumber: number }[];
  allLevels: {
    id: string;
    name: string;
    arabicName: string | null;
    programmeId: string;
  }[];
  allProgrammes: { id: string; name: string; arabicName: string | null }[];
}

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  arabicName: string | null;
  profilePhoto: string | null;
  programme: { name: string; arabicName: string | null } | null;
  level: { name: string; arabicName: string | null } | null;
  currentLevelId: string | null;
  currentProgrammeId: string | null;
}

interface Course {
  id: string;
  name: string;
  arabicName: string | null;
  code: string;
  creditUnits: number | null;
}

interface SaveState {
  status: "idle" | "saving" | "saved" | "error";
  message: string;
}

export function ResultsEntryForm({
  currentSession,
  currentTerm,
  allTerms,
  allLevels,
  allProgrammes,
}: Props) {
  // Selection state
  const [selectedTermId, setSelectedTermId] = useState(
    currentTerm?.id || allTerms[0]?.id || ""
  );
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Score state
  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [teacherRemarks, setTeacherRemarks] = useState("");

  // Save state
  const [saveState, setSaveState] = useState<SaveState>({
    status: "idle",
    message: "",
  });

  // Search
  const [studentSearch, setStudentSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  // Load students when level changes
  useEffect(() => {
    if (!selectedLevelId) {
      setStudents([]);
      setSelectedStudent(null);
      return;
    }

    setLoadingStudents(true);
    fetch(`/api/admin/results/students?levelId=${selectedLevelId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStudents(data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingStudents(false));
  }, [selectedLevelId]);

  // Load courses when student changes (use their programme)
  useEffect(() => {
    if (!selectedStudent?.currentProgrammeId) {
      setCourses([]);
      setSelectedCourse(null);
      return;
    }

    setLoadingCourses(true);
    fetch(
      `/api/admin/results/courses?programmeId=${selectedStudent.currentProgrammeId}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCourses(data.data);
      })
      .catch(console.error)
      .finally(() => setLoadingCourses(false));
  }, [selectedStudent]);

  // Reset scores when student or course changes
  useEffect(() => {
    setCaScore("");
    setExamScore("");
    setTeacherRemarks("");
    setSaveState({ status: "idle", message: "" });
  }, [selectedStudent, selectedCourse]);

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q)
    );
  });

  const totalScore =
    (parseFloat(caScore) || 0) + (parseFloat(examScore) || 0);

  const getGradeDisplay = (total: number) => {
    if (caScore === "" && examScore === "") return { grade: "—", color: "#94a3b8" };
    if (total >= 75) return { grade: "A", color: "hsl(162,55%,28%)" };
    if (total >= 65) return { grade: "B", color: "hsl(220,70%,48%)" };
    if (total >= 55) return { grade: "C", color: "hsl(42,78%,40%)" };
    if (total >= 45) return { grade: "D", color: "hsl(25,80%,45%)" };
    return { grade: "F", color: "hsl(0,70%,48%)" };
  };

  const gradeDisplay = getGradeDisplay(totalScore);

  const handleSave = async (submitForReview = false) => {
    if (!selectedStudent || !selectedCourse || !selectedTermId) {
      setSaveState({
        status: "error",
        message: "Please select a student, course, and term.",
      });
      return;
    }

    if (caScore === "" && examScore === "") {
      setSaveState({
        status: "error",
        message: "Please enter at least one score (CA or Exam).",
      });
      return;
    }

    setSaveState({ status: "saving", message: "" });

    try {
      const res = await fetch("/api/admin/results/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          courseId: selectedCourse.id,
          termId: selectedTermId,
          sessionId: currentSession.id,
          caScore: caScore !== "" ? caScore : undefined,
          examScore: examScore !== "" ? examScore : undefined,
          teacherRemarks: teacherRemarks || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSaveState({
          status: "saved",
          message: data.message || "Result saved successfully.",
        });

        // If submitting for review, update status
        if (submitForReview && data.data?.id) {
          const statusRes = await fetch("/api/admin/results/update-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resultIds: [data.data.id],
              newStatus: "submitted",
            }),
          });
          const statusData = await statusRes.json();
          if (statusData.success) {
            setSaveState({
              status: "saved",
              message: "Result saved and submitted for review.",
            });
          }
        }
      } else {
        setSaveState({
          status: "error",
          message: data.error || "Failed to save result.",
        });
      }
    } catch {
      setSaveState({
        status: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  const selectedTerm = allTerms.find((t) => t.id === selectedTermId);

  return (
    <div className="space-y-6">
      {/* Step 1 — Select Term & Level */}
      <div
        className="rounded-xl border p-6"
        style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
      >
        <h2 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "hsl(162,55%,28%)" }}
          >
            1
          </span>
          Select Term & Level
        </h2>
        <p className="arabic-text text-xs text-gray-400 mb-4 ml-7">
          اختر الفصل الدراسي والمستوى
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Term selector */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Term / الفصل الدراسي
            </label>
            <select
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2"
              style={{
                borderColor: "hsl(214,32%,91%)",
                color: "hsl(215,28%,17%)",
              }}
            >
              <option value="">Select term...</option>
              {allTerms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {currentSession.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level selector */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Level / المستوى
            </label>
            <select
              value={selectedLevelId}
              onChange={(e) => {
                setSelectedLevelId(e.target.value);
                setSelectedStudent(null);
                setStudentSearch("");
              }}
              className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2"
              style={{
                borderColor: "hsl(214,32%,91%)",
                color: "hsl(215,28%,17%)",
              }}
            >
              <option value="">Select level...</option>
              {allProgrammes.map((prog) => {
                const progLevels = allLevels.filter(
                  (l) => l.programmeId === prog.id
                );
                if (progLevels.length === 0) return null;
                return (
                  <optgroup key={prog.id} label={prog.name}>
                    {progLevels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2 — Select Student */}
      {selectedLevelId && (
        <div
          className="rounded-xl border p-6"
          style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              2
            </span>
            Select Student
          </h2>
          <p className="arabic-text text-xs text-gray-400 mb-4 ml-7">
            اختر الطالب
          </p>

          {loadingStudents ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div
              className="rounded-lg p-4 text-sm"
              style={{ background: "hsl(210,20%,97%)" }}
            >
              <p className="text-gray-500">
                No students found at this level. Assign students to this level
                first.
              </p>
              <p className="arabic-text text-xs text-gray-400 mt-1">
                لا يوجد طلاب في هذا المستوى
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Selected student display */}
              {selectedStudent ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer"
                  style={{ borderColor: "hsl(162,40%,80%)", background: "hsl(162,40%,96%)" }}
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentSearch("");
                    setShowStudentDropdown(true);
                  }}
                >
                  {selectedStudent.profilePhoto ? (
                    <img
                      src={selectedStudent.profilePhoto}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "hsl(162,55%,28%)" }}
                    >
                      {selectedStudent.firstName.charAt(0)}
                      {selectedStudent.lastName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    {selectedStudent.arabicName && (
                      <p
                        className="arabic-text text-xs"
                        style={{ color: "hsl(162,55%,30%)" }}
                      >
                        {selectedStudent.arabicName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-mono">
                      {selectedStudent.studentId}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Click to change</span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setShowStudentDropdown(true);
                      }}
                      onFocus={() => setShowStudentDropdown(true)}
                      className="w-full text-sm border rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2"
                      style={{ borderColor: "hsl(214,32%,91%)" }}
                    />
                  </div>

                  {showStudentDropdown && (
                    <div
                      className="absolute z-10 w-full mt-1 rounded-lg border shadow-lg overflow-hidden"
                      style={{
                        background: "white",
                        borderColor: "hsl(214,32%,91%)",
                        maxHeight: "280px",
                        overflowY: "auto",
                      }}
                    >
                      {filteredStudents.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No students match your search
                        </div>
                      ) : (
                        filteredStudents.map((s) => (
                          <button
                            key={s.id}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left transition-colors"
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowStudentDropdown(false);
                              setStudentSearch("");
                            }}
                          >
                            {s.profilePhoto ? (
                              <img
                                src={s.profilePhoto}
                                alt=""
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                style={{ background: "hsl(162,55%,28%)" }}
                              >
                                {s.firstName.charAt(0)}
                                {s.lastName.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {s.firstName} {s.lastName}
                              </p>
                              {s.arabicName && (
                                <p
                                  className="arabic-text text-xs"
                                  style={{ color: "hsl(162,55%,30%)" }}
                                >
                                  {s.arabicName}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 font-mono">
                                {s.studentId}
                              </p>
                            </div>
                            {s.level && (
                              <span className="text-xs text-gray-400 shrink-0">
                                {s.level.name}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Select Course */}
      {selectedStudent && (
        <div
          className="rounded-xl border p-6"
          style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              3
            </span>
            Select Course
          </h2>
          <p className="arabic-text text-xs text-gray-400 mb-4 ml-7">
            اختر المادة الدراسية
          </p>

          {loadingCourses ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div
              className="rounded-lg p-4 text-sm"
              style={{ background: "hsl(210,20%,97%)" }}
            >
              <p className="text-gray-500">
                No courses found for this student's programme.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="flex items-center justify-between p-3 rounded-lg border text-left transition-all"
                  style={{
                    borderColor:
                      selectedCourse?.id === course.id
                        ? "hsl(162,55%,40%)"
                        : "hsl(214,32%,91%)",
                    background:
                      selectedCourse?.id === course.id
                        ? "hsl(162,40%,94%)"
                        : "white",
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {course.name}
                    </p>
                    {course.arabicName && (
                      <p
                        className="arabic-text text-xs"
                        style={{ color: "hsl(162,55%,30%)" }}
                      >
                        {course.arabicName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {course.code}
                    </p>
                  </div>
                  {selectedCourse?.id === course.id && (
                    <CheckCircle
                      className="w-4 h-4 shrink-0"
                      style={{ color: "hsl(162,55%,28%)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Enter Scores */}
      {selectedStudent && selectedCourse && (
        <div
          className="rounded-xl border p-6"
          style={{ background: "white", borderColor: "hsl(214,32%,91%)" }}
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              4
            </span>
            Enter Scores
          </h2>
          <p className="arabic-text text-xs text-gray-400 mb-4 ml-7">
            إدخال الدرجات
          </p>

          {/* Summary bar */}
          <div
            className="rounded-lg p-3 mb-4 flex flex-wrap items-center gap-3 text-xs"
            style={{ background: "hsl(210,20%,97%)" }}
          >
            <span className="font-medium text-gray-700">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </span>
            <span className="text-gray-400">•</span>
            <span
              className="font-medium"
              style={{ color: "hsl(162,55%,28%)" }}
            >
              {selectedCourse.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 font-mono">
              {selectedTerm?.name || ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* CA Score */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Continuous Assessment (CA)
                <span className="text-gray-400 ml-1">/ out of 40</span>
              </label>
              <input
                type="number"
                min="0"
                max="40"
                step="0.5"
                placeholder="0 – 40"
                value={caScore}
                onChange={(e) => setCaScore(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 font-mono text-center"
                style={{
                  borderColor: "hsl(214,32%,91%)",
                  fontSize: "1.1rem",
                }}
              />
              <p className="arabic-text text-xs text-gray-400 mt-1 text-center">
                التقييم المستمر — 40 درجة
              </p>
            </div>

            {/* Exam Score */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Examination Score
                <span className="text-gray-400 ml-1">/ out of 60</span>
              </label>
              <input
                type="number"
                min="0"
                max="60"
                step="0.5"
                placeholder="0 – 60"
                value={examScore}
                onChange={(e) => setExamScore(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 font-mono text-center"
                style={{
                  borderColor: "hsl(214,32%,91%)",
                  fontSize: "1.1rem",
                }}
              />
              <p className="arabic-text text-xs text-gray-400 mt-1 text-center">
                درجة الامتحان — 60 درجة
              </p>
            </div>
          </div>

          {/* Total + Grade preview */}
          {(caScore !== "" || examScore !== "") && (
            <div
              className="flex items-center justify-between rounded-lg p-4 mb-4"
              style={{ background: "hsl(162,40%,96%)", border: "1px solid hsl(162,40%,85%)" }}
            >
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Total Score</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "hsl(162,55%,22%)" }}
                >
                  {totalScore.toFixed(1)}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    / 100
                  </span>
                </p>
                <p className="arabic-text text-xs text-gray-400">
                  مجموع الدرجات
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-0.5">Grade</p>
                <p
                  className="text-4xl font-black"
                  style={{ color: gradeDisplay.color }}
                >
                  {gradeDisplay.grade}
                </p>
                <p className="arabic-text text-xs text-gray-400">التقدير</p>
              </div>
            </div>
          )}

          {/* Teacher Remarks */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Teacher Remarks{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Optional remarks about the student's performance..."
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: "hsl(214,32%,91%)" }}
            />
            <p className="arabic-text text-xs text-gray-400 mt-1">
              ملاحظات المعلم — اختياري
            </p>
          </div>

          {/* Save state feedback */}
          {saveState.status === "saved" && (
            <div
              className="flex items-center gap-2 rounded-lg p-3 mb-4 text-sm"
              style={{
                background: "hsl(162,40%,94%)",
                color: "hsl(162,55%,22%)",
              }}
            >
              <CheckCircle className="w-4 h-4" />
              {saveState.message}
            </div>
          )}

          {saveState.status === "error" && (
            <div
              className="flex items-center gap-2 rounded-lg p-3 mb-4 text-sm"
              style={{
                background: "hsl(0,70%,97%)",
                color: "hsl(0,60%,40%)",
              }}
            >
              <AlertCircle className="w-4 h-4" />
              {saveState.message}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saveState.status === "saving"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
              style={{
                borderColor: "hsl(162,40%,80%)",
                color: "hsl(162,55%,28%)",
                background: "white",
              }}
            >
              {saveState.status === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save as Draft
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={saveState.status === "saving"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ background: "hsl(162,55%,28%)" }}
            >
              {saveState.status === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Save & Submit for Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}