"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, Plus, X } from "lucide-react";

export default function CreateProgrammePage() {
  const [form, setForm] = useState({
    name: "",
    arabicName: "",
    code: "",
    description: "",
    durationYears: "",
    objectives: "",
  });
  const [levels, setLevels] = useState<{ name: string; arabicName: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const addLevel = () => {
    const num = levels.length + 1;
    setLevels([...levels, { name: `${form.name || "Level"} ${num}`, arabicName: "" }]);
  };

  const removeLevel = (index: number) => {
    setLevels(levels.filter((_, i) => i !== index));
  };

  const updateLevel = (index: number, field: string, value: string) => {
    const updated = [...levels];
    (updated[index] as any)[field] = value;
    setLevels(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.code) {
      setError("Programme name and code are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/programmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, levels }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create programme.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "42px",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    background: "white",
    color: "#0f172a",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569",
    marginBottom: "6px",
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "hsl(162,40%,94%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle style={{ width: "32px", height: "32px", color: "hsl(162,55%,28%)" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Programme Created!</h1>
          <p className="arabic-text" style={{ color: "hsl(162,55%,30%)", marginBottom: "8px" }}>تم إنشاء البرنامج بنجاح</p>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>The programme "{form.name}" has been created with {levels.length} level(s).</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/admin/programmes" style={{ padding: "10px 24px", borderRadius: "8px", background: "hsl(162,55%,28%)", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              View Programmes / عرض البرامج
            </Link>
            <button
              onClick={() => { setSuccess(false); setForm({ name: "", arabicName: "", code: "", description: "", durationYears: "", objectives: "" }); setLevels([]); }}
              style={{ padding: "10px 24px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#475569", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >
              Create Another / إنشاء آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Back link */}
        <Link href="/admin/programmes" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", textDecoration: "none", marginBottom: "24px" }}>
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to Programmes / العودة للبرامج
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Create Programme</h1>
        <p className="arabic-text" style={{ color: "hsl(162,55%,30%)", fontSize: "16px", marginBottom: "32px" }}>إنشاء برنامج أكاديمي جديد</p>

        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px" }}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", color: "#dc2626", fontSize: "14px", marginBottom: "20px" }}>
                {error}
              </div>
            )}

            {/* Programme Info */}
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "hsl(162,55%,28%)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid hsl(162,40%,90%)" }}>
              Programme Details / تفاصيل البرنامج
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Programme Name / اسم البرنامج *</label>
                <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="e.g. Idadiyyah" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Arabic Name / الاسم بالعربية</label>
                <input type="text" value={form.arabicName} onChange={(e) => updateForm("arabicName", e.target.value)} placeholder="مثل: الإعدادية" dir="rtl" className="arabic-text" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Programme Code / رمز البرنامج *</label>
                <input type="text" value={form.code} onChange={(e) => updateForm("code", e.target.value.toUpperCase())} placeholder="e.g. IDADIYYAH" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Duration (Years) / المدة (سنوات)</label>
                <input type="number" value={form.durationYears} onChange={(e) => updateForm("durationYears", e.target.value)} placeholder="3" min="1" max="10" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description / الوصف</label>
              <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Describe the programme..." rows={3} style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={labelStyle}>Learning Objectives / الأهداف التعليمية</label>
              <textarea value={form.objectives} onChange={(e) => updateForm("objectives", e.target.value)} placeholder="List the programme objectives..." rows={3} style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            {/* Levels */}
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "hsl(162,55%,28%)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid hsl(162,40%,90%)" }}>
              Levels / المستويات
            </h3>

            {levels.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px", textAlign: "center", padding: "20px 0" }}>
                No levels added yet. Click below to add levels. / لم يتم إضافة مستويات بعد
              </p>
            ) : (
              <div style={{ marginBottom: "16px" }}>
                {levels.map((level, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "hsl(162,55%,28%)", width: "24px", textAlign: "center" }}>{i + 1}</span>
                    <input
                      type="text"
                      value={level.name}
                      onChange={(e) => updateLevel(i, "name", e.target.value)}
                      placeholder="Level name"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      value={level.arabicName}
                      onChange={(e) => updateLevel(i, "arabicName", e.target.value)}
                      placeholder="الاسم بالعربية"
                      dir="rtl"
                      className="arabic-text"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button type="button" onClick={() => removeLevel(i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                      <X style={{ width: "18px", height: "18px" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addLevel}
              style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px",
                border: "1px dashed hsl(162,40%,70%)", background: "hsl(162,40%,97%)", color: "hsl(162,55%,28%)",
                fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "32px",
              }}
            >
              <Plus style={{ width: "16px", height: "16px" }} />
              Add Level / إضافة مستوى
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", height: "48px", borderRadius: "8px", background: "hsl(162,55%,28%)",
                color: "white", border: "none", fontSize: "15px", fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
                  Creating... / جارٍ الإنشاء...
                </>
              ) : (
                "Create Programme / إنشاء البرنامج"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}