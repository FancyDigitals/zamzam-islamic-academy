"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

interface Programme {
  id: string;
  name: string;
  arabicName: string | null;
}

export function AdmissionForm({ programmes }: { programmes: Programme[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successAppNumber, setSuccessAppNumber] = useState<string | null>(null);

  const [form, setForm] = useState({
    // Student
    firstName: "",
    lastName: "",
    arabicName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    // Guardian
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianEmail: "",
    // Academic
    programmAppliedId: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admissions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to submit application.");
        setIsLoading(false);
        return;
      }

      setSuccessAppNumber(result.applicationNumber);
    } catch (err) {
      setError("A network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (successAppNumber) {
    return (
      <div
        className="rounded-lg p-10 text-center"
        style={{
          background: "hsl(0, 0%, 100%)",
          border: "1px solid hsl(35, 20%, 85%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "hsl(155, 40%, 32%)" }}
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2
          className="text-2xl font-extrabold mb-2"
          style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.02em" }}
        >
          Application Submitted
        </h2>
        <p className="arabic-text text-lg mb-6" style={{ color: "hsl(35, 65%, 32%)" }}>
          تم تقديم الطلب بنجاح
        </p>

        <div
          className="rounded-md p-6 mb-8 inline-block mx-auto text-left"
          style={{ background: "hsl(40, 40%, 97%)", border: "1px solid hsl(35, 20%, 82%)" }}
        >
          <p className="text-xs uppercase font-bold text-gray-500 mb-1 tracking-wider">
            Your Application Number
          </p>
          <p className="text-3xl font-mono font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>
            {successAppNumber}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Please save this number. We will contact you via email or phone regarding your admission status.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-white font-semibold transition-all"
            style={{ background: "hsl(0, 0%, 8%)" }}
          >
            Return to Homepage
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg p-6 sm:p-10"
      style={{
        background: "hsl(0, 0%, 100%)",
        border: "1px solid hsl(35, 20%, 85%)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
      }}
    >
      {error && (
        <div
          className="p-4 rounded-md text-sm mb-8 font-medium"
          style={{
            background: "hsl(0, 50%, 96%)",
            border: "1px solid hsl(0, 60%, 85%)",
            color: "hsl(0, 60%, 40%)",
          }}
        >
          {error}
        </div>
      )}

      {/* --- Section 1: Student Details --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-black">
            1
          </span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>Applicant Information</h3>
            <p className="arabic-text text-xs" style={{ color: "hsl(35, 65%, 32%)" }}>معلومات المتقدم</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="First Name" arabic="الاسم الأول" required value={form.firstName} onChange={(v) => updateForm("firstName", v)} />
          <FormInput label="Last Name" arabic="اسم العائلة" required value={form.lastName} onChange={(v) => updateForm("lastName", v)} />
          <FormInput label="Arabic Name (Optional)" arabic="الاسم باللغة العربية" value={form.arabicName} onChange={(v) => updateForm("arabicName", v)} />
          <FormInput label="Email Address" arabic="البريد الإلكتروني" type="email" value={form.email} onChange={(v) => updateForm("email", v)} />
          <FormInput label="Phone Number" arabic="رقم الهاتف" type="tel" value={form.phone} onChange={(v) => updateForm("phone", v)} />
          
          <div>
            <FormLabel label="Gender" arabic="الجنس" required />
            <select
              required
              value={form.gender}
              onChange={(e) => updateForm("gender", e.target.value)}
              className="w-full h-11 px-3.5 rounded-md text-sm outline-none transition-all"
              style={{ background: "hsl(40, 40%, 97%)", border: "1px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <FormInput label="Date of Birth" arabic="تاريخ الميلاد" type="date" required value={form.dateOfBirth} onChange={(v) => updateForm("dateOfBirth", v)} />
        </div>
        <div className="mt-5">
          <FormLabel label="Home Address" arabic="العنوان" required />
          <textarea
            required
            rows={2}
            value={form.address}
            onChange={(e) => updateForm("address", e.target.value)}
            className="w-full px-3.5 py-3 rounded-md text-sm outline-none transition-all resize-none"
            style={{ background: "hsl(40, 40%, 97%)", border: "1px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
          />
        </div>
      </div>

      <hr style={{ borderColor: "hsl(35, 20%, 85%)", margin: "2rem 0" }} />

      {/* --- Section 2: Guardian Details --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-black">
            2
          </span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>Guardian Information</h3>
            <p className="arabic-text text-xs" style={{ color: "hsl(35, 65%, 32%)" }}>معلومات ولي الأمر</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="Guardian Full Name" arabic="اسم ولي الأمر" required value={form.guardianName} onChange={(v) => updateForm("guardianName", v)} />
          <FormInput label="Relationship to Applicant" arabic="صلة القرابة" required placeholder="e.g. Father, Mother, Uncle" value={form.guardianRelationship} onChange={(v) => updateForm("guardianRelationship", v)} />
          <FormInput label="Guardian Phone" arabic="هاتف ولي الأمر" type="tel" required value={form.guardianPhone} onChange={(v) => updateForm("guardianPhone", v)} />
          <FormInput label="Guardian Email (Optional)" arabic="بريد ولي الأمر" type="email" value={form.guardianEmail} onChange={(v) => updateForm("guardianEmail", v)} />
        </div>
      </div>

      <hr style={{ borderColor: "hsl(35, 20%, 85%)", margin: "2rem 0" }} />

      {/* --- Section 3: Academic Details --- */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-black">
            3
          </span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "hsl(0, 0%, 8%)" }}>Academic Information</h3>
            <p className="arabic-text text-xs" style={{ color: "hsl(35, 65%, 32%)" }}>المعلومات الأكاديمية</p>
          </div>
        </div>

        <div className="mb-5">
          <FormLabel label="Programme Applied For" arabic="البرنامج المطلوب" required />
          <select
            required
            value={form.programmAppliedId}
            onChange={(e) => updateForm("programmAppliedId", e.target.value)}
            className="w-full h-11 px-3.5 rounded-md text-sm outline-none transition-all"
            style={{ background: "hsl(40, 40%, 97%)", border: "1px solid hsl(35, 20%, 82%)", color: "hsl(0, 0%, 8%)" }}
          >
            <option value="">Select Programme</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.arabicName ? `— ${p.arabicName}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-md mb-8" style={{ background: "hsl(38, 45%, 94%)", border: "1px solid hsl(35, 20%, 85%)" }}>
        <input type="checkbox" required id="consent" className="mt-1" />
        <label htmlFor="consent" className="text-sm" style={{ color: "hsl(0, 0%, 25%)" }}>
          I confirm that all information provided in this application is accurate. I understand that submitting this form does not guarantee admission.
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-md text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: "hsl(0, 0%, 8%)", fontSize: "1rem" }}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
      </button>
    </form>
  );
}

function FormLabel({ label, arabic, required }: { label: string; arabic: string; required?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="block text-xs uppercase font-bold tracking-wider" style={{ color: "hsl(0, 0%, 25%)" }}>
        {label} {required && <span style={{ color: "hsl(38, 60%, 45%)" }}>*</span>}
      </label>
      <span className="arabic-text text-xs" style={{ color: "hsl(35, 65%, 32%)" }}>
        {arabic}
      </span>
    </div>
  );
}

function FormInput({
  label,
  arabic,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  arabic: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <FormLabel label={label} arabic={arabic} required={required} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 px-3.5 rounded-md text-sm outline-none transition-all"
        style={{
          background: "hsl(40, 40%, 97%)",
          border: "1px solid hsl(35, 20%, 82%)",
          color: "hsl(0, 0%, 8%)",
          colorScheme: type === "date" ? "light" : "auto",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "hsl(38, 60%, 45%)";
          e.currentTarget.style.background = "hsl(0, 0%, 100%)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "hsl(35, 20%, 82%)";
          e.currentTarget.style.background = "hsl(40, 40%, 97%)";
        }}
      />
    </div>
  );
}