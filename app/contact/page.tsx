"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, Loader2, CheckCircle } from "lucide-react";

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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "64px" }}>

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, hsl(162,72%,8%) 0%, hsl(162,60%,15%) 100%)",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <p
          className="arabic-text"
          style={{ color: "hsl(162,50%,65%)", fontSize: "22px", marginBottom: "8px" }}
        >
          تواصل معنا
        </p>
        <h1 style={{ color: "white", fontSize: "44px", fontWeight: "700", marginBottom: "16px" }}>
          Contact Us
        </h1>
        <p style={{ color: "hsl(162,35%,65%)", fontSize: "18px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
          We would love to hear from you. Reach out to us for any inquiries about admissions, programmes, or the academy.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Contact Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
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
              line1: "Contact Academy",
              line2: "Mon - Sat",
            },
            {
              icon: Clock,
              title: "Office Hours",
              line1: "Saturday - Thursday",
              line2: "8:00 AM - 4:00 PM",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "hsl(162,40%,94%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: "hsl(162,55%,28%)" }} />
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "6px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
                  {item.line1}
                  <br />
                  {item.line2}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "40px",
          }}
        >
          {success ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "hsl(162,40%,94%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CheckCircle style={{ width: "32px", height: "32px", color: "hsl(162,55%,28%)" }} />
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                Message Sent!
              </h2>
              <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "8px" }}>
                JazakAllahu Khayran. We have received your message.
              </p>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                The academy will respond to your inquiry as soon as possible.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                }}
                style={{
                  marginTop: "24px",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                Send Us a Message
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px" }}>
                Fill in the form below and we will get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="Full name"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Subject *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => updateForm("subject", e.target.value)}
                      required
                      style={inputStyle}
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

                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Your Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => updateForm("message", e.target.value)}
                    placeholder="Write your message here..."
                    required
                    rows={6}
                    style={{
                      ...inputStyle,
                      height: "auto",
                      padding: "12px",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "8px",
                    background: "hsl(162,55%,28%)",
                    color: "white",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: "18px", height: "18px" }} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Islamic quote */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p
            className="arabic-text"
            style={{ fontSize: "22px", color: "hsl(162,55%,30%)", marginBottom: "8px" }}
          >
            خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ
          </p>
          <p style={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>
            "The best of people are those who are most beneficial to people."
            <span style={{ color: "#cbd5e1" }}> — Prophet Muhammad ﷺ</span>
          </p>
        </div>
      </div>
    </div>
  );
}