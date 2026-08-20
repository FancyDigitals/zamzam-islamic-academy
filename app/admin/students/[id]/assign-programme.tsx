"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Programme {
  id: string;
  name: string;
  arabicName?: string | null;
}

interface Level {
  id: string;
  name: string;
  programmeId: string;
  arabicName?: string | null;
}

interface AssignProgrammeClientProps {
  studentId: string;
  currentProgrammeId?: string | null;
  currentLevelId?: string | null;
  programmes: Programme[];
  levels: Level[];
}

export function AssignProgrammeClient({
  studentId,
  currentProgrammeId,
  currentLevelId,
  programmes = [],
  levels = [],
}: AssignProgrammeClientProps) {
  const [selectedProgramme, setSelectedProgramme] = useState(currentProgrammeId || "");
  const [selectedLevel, setSelectedLevel] = useState(currentLevelId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredLevels = levels.filter((l) => l.programmeId === selectedProgramme);

  const handleAssign = async () => {
    if (!selectedProgramme) {
      setError("Please select a programme.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/students/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          programmeId: selectedProgramme,
          levelId: selectedLevel || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to assign programme.");
        return;
      }

      setMessage("Programme assigned successfully! • تم تعيين البرنامج بنجاح");
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {message && (
        <div
          className="flex items-center gap-3 p-4 rounded-md text-sm font-semibold"
          style={{
            background: "hsl(155, 30%, 92%)",
            color: "hsl(155, 40%, 32%)",
            border: "1px solid hsl(155, 35%, 82%)",
          }}
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-md text-sm font-semibold"
          style={{
            background: "hsl(0, 50%, 95%)",
            color: "hsl(0, 60%, 42%)",
            border: "1px solid hsl(0, 45%, 85%)",
          }}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Select Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-[10px] uppercase font-bold tracking-widest mb-2"
            style={{ color: "hsl(0, 0%, 18%)" }}
          >
            Programme / اختر البرنامج *
          </label>
          <select
            value={selectedProgramme}
            onChange={(e) => {
              setSelectedProgramme(e.target.value);
              setSelectedLevel("");
            }}
            className="w-full h-11 px-3 rounded-md text-sm font-semibold transition outline-none"
            style={{
              border: "1.5px solid hsl(35, 20%, 82%)",
              background: "white",
              color: "hsl(0, 0%, 8%)",
            }}
          >
            <option value="">— Select Programme —</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.arabicName ? `(${p.arabicName})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-[10px] uppercase font-bold tracking-widest mb-2"
            style={{ color: "hsl(0, 0%, 18%)" }}
          >
            Level / اختر المستوى
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            disabled={!selectedProgramme}
            className="w-full h-11 px-3 rounded-md text-sm font-semibold transition outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              border: "1.5px solid hsl(35, 20%, 82%)",
              background: "white",
              color: "hsl(0, 0%, 8%)",
            }}
          >
            <option value="">— Select Level —</option>
            {filteredLevels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} {l.arabicName ? `(${l.arabicName})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Trigger */}
      <div className="pt-2">
        <button
          onClick={handleAssign}
          disabled={isLoading || !selectedProgramme}
          className="px-6 py-3 rounded-md text-xs uppercase font-extrabold tracking-wider transition flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "hsl(0, 0%, 8%)",
            color: "white",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Assigning... • جارٍ التعيين...</span>
            </>
          ) : (
            <span>Assign Programme • تعيين البرنامج</span>
          )}
        </button>
      </div>
    </div>
  );
}