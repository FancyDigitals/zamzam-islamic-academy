import { BookOpen, FileText, Headphones, Video, Globe, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

const resourceCategories = [
  {
    name: "Qur'anic Resources",
    arabic: "مصادر قرآنية",
    icon: BookOpen,
    color: "hsl(162,55%,28%)",
    bg: "hsl(162,40%,94%)",
    resources: [
      { title: "Tajweed Rules Guide", type: "PDF", description: "Comprehensive guide to the rules of Qur'anic recitation." },
      { title: "Memorization Schedule Template", type: "PDF", description: "Structured daily and weekly memorization plan for students." },
      { title: "Common Recitation Mistakes", type: "PDF", description: "Guide to avoiding common errors in Qur'anic recitation." },
    ],
  },
  {
    name: "Arabic Language",
    arabic: "اللغة العربية",
    icon: FileText,
    color: "hsl(220,70%,50%)",
    bg: "hsl(220,70%,95%)",
    resources: [
      { title: "Arabic Grammar Foundations", type: "PDF", description: "Introduction to Arabic grammar covering basic sentence structures." },
      { title: "Arabic Morphology Charts", type: "PDF", description: "Reference charts for Arabic verb conjugations and word patterns." },
      { title: "Arabic Vocabulary Builder", type: "PDF", description: "Essential Arabic vocabulary for Islamic studies students." },
    ],
  },
  {
    name: "Islamic Sciences",
    arabic: "العلوم الشرعية",
    icon: Globe,
    color: "hsl(42,78%,45%)",
    bg: "hsl(41,85%,92%)",
    resources: [
      { title: "Introduction to Fiqh", type: "PDF", description: "Overview of Islamic jurisprudence and its major schools." },
      { title: "Aqeedah Study Notes", type: "PDF", description: "Core Islamic creed concepts for Idadiyyah students." },
      { title: "Sirah Timeline", type: "PDF", description: "Chronological timeline of the life of Prophet Muhammad ﷺ." },
    ],
  },
];

const futureResources = [
  { icon: Headphones, title: "Audio Lectures", description: "Recorded lectures from our faculty on Islamic sciences and Arabic." },
  { icon: Video, title: "Video Lessons", description: "Structured video lessons for remote and supplementary learning." },
  { icon: Download, title: "Course Materials", description: "Downloadable textbooks, worksheets, and study aids for each course." },
  { icon: BookOpen, title: "Digital Library", description: "Access to classical Arabic and Islamic texts in digital format." },
];

function getTypeStyle(type: string) {
  switch (type) {
    case "PDF":
      return { bg: "hsl(0,70%,95%)", color: "hsl(0,60%,45%)" };
    case "Audio":
      return { bg: "hsl(270,60%,95%)", color: "hsl(270,60%,45%)" };
    case "Video":
      return { bg: "hsl(220,70%,95%)", color: "hsl(220,70%,45%)" };
    default:
      return { bg: "hsl(210,20%,94%)", color: "hsl(210,20%,45%)" };
  }
}

export default function ResourcesPage() {
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
          المكتبة الرقمية
        </p>
        <h1 style={{ color: "white", fontSize: "44px", fontWeight: "700", marginBottom: "16px" }}>
          Resources
        </h1>
        <p style={{ color: "hsl(162,35%,65%)", fontSize: "18px", maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
          Educational resources, study materials, and references for Islamic and Arabic studies.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Resource Categories */}
        {resourceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.name}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "36px",
                marginBottom: "24px",
              }}
            >
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: category.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: "24px", height: "24px", color: category.color }} />
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "2px" }}>
                    {category.name}
                  </h2>
                  <p className="arabic-text" style={{ color: category.color, fontSize: "15px" }}>
                    {category.arabic}
                  </p>
                </div>
              </div>

              {/* Resources grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                {category.resources.map((resource) => {
                  const typeStyle = getTypeStyle(resource.type);
                  return (
                    <div
                      key={resource.title}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <FileText style={{ width: "18px", height: "18px", color: "#94a3b8" }} />
                        <span
                          style={{
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          {resource.type}
                        </span>
                      </div>
                      <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "6px" }}>
                        {resource.title}
                      </h4>
                      <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6 }}>
                        {resource.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Coming Soon */}
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "36px",
            marginBottom: "48px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", textAlign: "center" }}>
            Coming Soon
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", marginBottom: "28px" }}>
            We are building a comprehensive digital resource library for our students.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {futureResources.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    background: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "24px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "hsl(210,20%,92%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: "20px", height: "20px", color: "#94a3b8" }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Portal CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, hsl(162,72%,10%) 0%, hsl(162,60%,18%) 100%)",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            color: "white",
          }}
        >
          <p className="arabic-text" style={{ fontSize: "20px", color: "hsl(162,50%,65%)", marginBottom: "12px" }}>
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>
          <p style={{ fontSize: "13px", color: "hsl(162,35%,55%)", fontStyle: "italic", marginBottom: "24px" }}>
            "Read in the name of your Lord who created." — Surah Al-Alaq, 96:1
          </p>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>
            Access More Resources
          </h2>
          <p style={{ color: "hsl(162,35%,70%)", fontSize: "15px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
            Students can access course-specific materials, notes, and resources through the Student Portal.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/login"
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                background: "hsl(162,55%,30%)",
                color: "white",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Student Portal
              <ArrowRight style={{ width: "18px", height: "18px" }} />
            </Link>
            <Link
              href="/admissions"
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "hsl(162,40%,75%)",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              Apply for Admission
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}