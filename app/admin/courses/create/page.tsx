"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, Plus } from "lucide-react";

export default function CreateCoursePage() {
  const [form, setForm] = useState({
    name: "",
    arabicName: "",
    code: "",
    description: "",
    arabicDescription: "",
    programmeId: "",
    creditUnits: "1",
  });
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/programmes/list")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProgrammes(data.data);
      })
      .catch(() => {});
  }, []);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.code) {
      setError("Course name and code are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create course.");
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
    width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px",
    border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", background: "white", color: "#0f172a",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "13px", fontWeight: "500", color: "#475569", marginBottom: "6px",
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "hsl(162,40%,94%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle style={{ width: "32px", height: "32px", color: "hsl(162,55%,28%)" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Course Created!</h1>
          <p className="arabic-text" style={{ color: "hsl(162,55%,30%)", marginBottom: "8px" }}>تم إنشاء المادة بنجاح</p>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>"{form.name}" ({form.code}) has been created.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/admin/courses" style={{ padding: "10px 24px", borderRadius: "8px", background: "hsl(162,55%,28%)", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              View Courses / عرض المواد
            </Link>
            <button
              onClick={() => { setSuccess(false); setForm({ name: "", arabicName: "", code: "", description: "", arabicDescription: "", programmeId: "", creditUnits: "1" }); }}
              style={{ padding: "10px 24px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#475569", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >
              Create Another / إنشاء أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <Link href="/admin/courses" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", textDecoration: "none", marginBottom: "24px" }}>
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to Courses / العودة للمواد
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Create Course</h1>
        <p className="arabic-text" style={{ color: "hsl(162,55%,30%)", fontSize: "16px", marginBottom: "32px" }}>إنشاء مادة دراسية جديدة</p>

        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px" }}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", color: "#dc2626", fontSize: "14px", marginBottom: "20px" }}>
                {error}
              </div>
            )}

            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "hsl(162,55%,28%)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid hsl(162,40%,90%)" }}>
              Course Details / تفاصيل المادة
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Course Name / اسم المادة *</label>
                <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="e.g. Arabic Grammar" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Arabic Name / الاسم بالعربية</label>
                <input type="text" value={form.arabicName} onChange={(e) => updateForm("arabicName", e.target.value)} placeholder="مثل: النحو العربي" dir="rtl" className="arabic-text" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Course Code / رمز المادة *</label>
                <input type="text" value={form.code} onChange={(e) => updateForm("code", e.target.value.toUpperCase())} placeholder="e.g. ARB-101" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Programme / البرنامج</label>
                <select value={form.programmeId} onChange={(e) => updateForm("programmeId", e.target.value)} style={inputStyle}>
                  <option value="">All Programmes / الكل</option>
                  {programmes.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name} {p.arabicName ? `(${p.arabicName})` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Credit Units / الوحدات</label>
                <input type="number" value={form.creditUnits} onChange={(e) => updateForm("creditUnits", e.target.value)} min="1" max="10" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description (English) / الوصف بالإنجليزية</label>
              <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Describe the course..." rows={3} style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={labelStyle}>Description (Arabic) / الوصف بالعربية</label>
              <textarea value={form.arabicDescription} onChange={(e) => updateForm("arabicDescription", e.target.value)} placeholder="وصف المادة بالعربية..." dir="rtl" className="arabic-text" rows={3} style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", fontFamily: "inherit" }} />
            </div>

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
                "Create Course / إنشاء المادة"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}