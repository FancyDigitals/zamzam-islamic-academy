"use client";

import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccess(true);
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "hsl(40, 40%, 97%)" }}>

      {/* ═══════════════════════════════════════════
          HERO — Cream with Pattern
          ═══════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "url('/pattern.svg')",
            backgroundSize: "80px 80px",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="arabic-text mb-3"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            تواصل معنا
          </p>
          <h1
            className="mb-5"
            style={{
              fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)",
              color: "hsl(0, 0%, 8%)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            Contact the Academy
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            We would love to hear from you. Reach out to us for any inquiries about
            admissions, programmes, or academic support.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════ */}
      <section className="py-12 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                icon: MapPin,
                title: "Location",
                line1: "Nigeria",
                line2: "West Africa",
              },
              {
                icon: Mail,
                title: "Email",
                line1: "info@zamzamacademy.ng",
                line2: "admissions@zamzamacademy.ng",
              },
              {
                icon: Phone,
                title: "Phone",
                line1: "Contact Support",
                line2: "Mon – Sat",
              },
              {
                icon: Clock,
                title: "Office Hours",
                line1: "Saturday – Thursday",
                line2: "8:00 AM – 4:00 PM",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="paper-card rounded-lg p-6 text-center"
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center mx-auto mb-3"
                    style={{ background: "hsl(42, 75%, 88%)" }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "hsl(0, 0%, 8%)",
                      letterSpacing: "-0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs"
                    style={{
                      color: "hsl(0, 0%, 40%)",
                      letterSpacing: "-0.005em",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.line1}
                    <br />
                    {item.line2}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contact Form Card */}
          <div
            className="rounded-lg p-6 sm:p-10"
            style={{
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(35, 20%, 85%)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            }}
          >
            {success ? (
              <div className="text-center py-10">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "hsl(155, 40%, 32%)" }}
                >
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "hsl(0, 0%, 8%)",
                    letterSpacing: "-0.03em",
                    marginBottom: "6px",
                  }}
                >
                  Message Sent!
                </h2>
                <p
                  className="arabic-text text-lg mb-2"
                  style={{ color: "hsl(35, 65%, 32%)" }}
                >
                  جزاكم الله خيراً
                </p>
                <p
                  className="text-sm mb-1"
                  style={{ color: "hsl(0, 0%, 30%)", letterSpacing: "-0.005em" }}
                >
                  JazakAllahu Khayran. We have received your message.
                </p>
                <p
                  className="text-xs mb-8"
                  style={{ color: "hsl(0, 0%, 50%)", letterSpacing: "-0.005em" }}
                >
                  The academy administration will respond to your inquiry as soon as possible.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all"
                  style={{
                    border: "1.5px solid hsl(0, 0%, 8%)",
                    color: "hsl(0, 0%, 8%)",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "hsl(0, 0%, 8%)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      marginBottom: "6px",
                    }}
                  >
                    Send Us a Message
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "-0.005em" }}
                  >
                    Fill in the form below and our administrative team will respond shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <FormLabel label="Your Name" arabic="الاسم" required />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Full name"
                        required
                        className="form-input-style"
                      />
                    </div>
                    <div>
                      <FormLabel label="Email Address" arabic="البريد الإلكتروني" required />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="form-input-style"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <FormLabel label="Phone Number" arabic="رقم الهاتف" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="form-input-style"
                      />
                    </div>
                    <div>
                      <FormLabel label="Subject" arabic="الموضوع" required />
                      <select
                        value={form.subject}
                        onChange={(e) => updateForm("subject", e.target.value)}
                        required
                        className="form-input-style"
                      >
                        <option value="">Select subject</option>
                        <option value="admissions">Admissions Inquiry</option>
                        <option value="programmes">Programme Information</option>
                        <option value="academic">Academic Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="general">General Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <FormLabel label="Your Message" arabic="الرسالة" required />
                    <textarea
                      value={form.message}
                      onChange={(e) => updateForm("message", e.target.value)}
                      placeholder="Write your message here..."
                      required
                      rows={5}
                      className="form-textarea-style"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-md text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      background: "hsl(0, 0%, 8%)",
                      fontSize: "0.95rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Islamic Quote */}
          <div className="text-center mt-16">
            <p
              className="arabic-text mb-2"
              style={{
                fontSize: "1.5rem",
                color: "hsl(35, 65%, 32%)",
                lineHeight: 1.6,
              }}
            >
              خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ
            </p>
            <p
              className="text-sm italic mb-0.5"
              style={{ color: "hsl(0, 0%, 35%)", letterSpacing: "-0.005em" }}
            >
              "The best of people are those who are most beneficial to people."
            </p>
            <p
              className="text-xs"
              style={{ color: "hsl(0, 0%, 50%)", fontWeight: 500 }}
            >
              — Prophet Muhammad ﷺ
            </p>
          </div>

        </div>
      </section>

      {/* Styled JSX Helper for Input Elements */}
      <style jsx>{`
        .form-input-style {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 6px;
          border: 1.5px solid hsl(35, 20%, 82%);
          font-size: 14px;
          outline: none;
          background: hsl(40, 40%, 97%);
          color: hsl(0, 0%, 8%);
          transition: all 0.2s;
        }
        .form-input-style:focus {
          border-color: hsl(38, 60%, 45%);
          background: hsl(0, 0%, 100%);
        }
        .form-textarea-style {
          width: 100%;
          padding: 12px 14px;
          border-radius: 6px;
          border: 1.5px solid hsl(35, 20%, 82%);
          font-size: 14px;
          outline: none;
          background: hsl(40, 40%, 97%);
          color: hsl(0, 0%, 8%);
          transition: all 0.2s;
          resize: vertical;
          font-family: inherit;
        }
        .form-textarea-style:focus {
          border-color: hsl(38, 60%, 45%);
          background: hsl(0, 0%, 100%);
        }
      `}</style>
    </div>
  );
}

function FormLabel({
  label,
  arabic,
  required,
}: {
  label: string;
  arabic: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label
        className="block text-xs uppercase font-bold tracking-wider"
        style={{ color: "hsl(0, 0%, 25%)" }}
      >
        {label} {required && <span style={{ color: "hsl(38, 60%, 45%)" }}>*</span>}
      </label>
      <span
        className="arabic-text text-xs"
        style={{ color: "hsl(35, 65%, 32%)" }}
      >
        {arabic}
      </span>
    </div>
  );
}