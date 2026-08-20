import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const upcomingEvents = [
  {
    title: "New Academic Session Orientation",
    arabic: "التوجيه للعام الدراسي الجديد",
    date: "September 2026",
    time: "9:00 AM - 12:00 PM",
    location: "Zamzam Islamic Academy Campus",
    description: "Orientation programme for all new and returning students. Parents and guardians are welcome to attend.",
    audience: "All Students & Parents",
    type: "Academic",
  },
  {
    title: "Qur'an Recitation Competition",
    arabic: "مسابقة تلاوة القرآن الكريم",
    date: "October 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Academy Hall",
    description: "Annual Qur'an recitation competition open to all students across Idadiyyah and Thanawiyyah levels. Prizes for the top reciters.",
    audience: "All Students",
    type: "Islamic",
  },
  {
    title: "Arabic Language Week",
    arabic: "أسبوع اللغة العربية",
    date: "November 2026",
    time: "All Week",
    location: "Academy Campus",
    description: "A week-long celebration of Arabic language featuring speeches, poetry, writing competitions, and Arabic-only communication challenges.",
    audience: "All Students",
    type: "Academic",
  },
  {
    title: "First Term Examinations",
    arabic: "امتحانات الفصل الأول",
    date: "December 2026",
    time: "8:00 AM - 12:00 PM Daily",
    location: "Examination Halls",
    description: "End of first term examinations covering all subjects for both Idadiyyah and Thanawiyyah programmes.",
    audience: "All Students",
    type: "Examination",
  },
  {
    title: "Islamic Lecture Series",
    arabic: "سلسلة المحاضرات الإسلامية",
    date: "January 2027",
    time: "4:00 PM - 6:00 PM",
    location: "Academy Lecture Hall",
    description: "Monthly Islamic lecture series featuring guest scholars speaking on topics relevant to students and the community.",
    audience: "Students, Staff & Community",
    type: "Islamic",
  },
  {
    title: "Parent-Teacher Meeting",
    arabic: "اجتماع أولياء الأمور",
    date: "February 2027",
    time: "10:00 AM - 2:00 PM",
    location: "Academy Campus",
    description: "Termly meeting for parents and guardians to discuss student academic progress, results, and development with teachers.",
    audience: "Parents & Teachers",
    type: "Academic",
  },
];

function getTypeColor(type: string) {
  switch (type) {
    case "Islamic":
      return { bg: "hsl(162,40%,94%)", color: "hsl(162,55%,25%)" };
    case "Academic":
      return { bg: "hsl(220,70%,95%)", color: "hsl(220,70%,40%)" };
    case "Examination":
      return { bg: "hsl(0,70%,95%)", color: "hsl(0,60%,45%)" };
    default:
      return { bg: "hsl(210,20%,94%)", color: "hsl(210,20%,40%)" };
  }
}

export default function EventsPage() {
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
          الفعاليات والأنشطة
        </p>
        <h1 style={{ color: "white", fontSize: "44px", fontWeight: "700", marginBottom: "16px" }}>
          Events
        </h1>
        <p style={{ color: "hsl(162,35%,65%)", fontSize: "18px", maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
          Academic events, Islamic programmes, examinations, and community activities at Zamzam Islamic Academy.
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Events list */}
        <div style={{ marginBottom: "48px" }}>
          {upcomingEvents.map((event, i) => {
            const typeStyle = getTypeColor(event.type);
            return (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "32px",
                  marginBottom: "20px",
                  display: "flex",
                  gap: "28px",
                  alignItems: "flex-start",
                }}
              >
                {/* Date badge */}
                <div
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    background: "hsl(162,40%,94%)",
                    borderRadius: "12px",
                    padding: "16px 8px",
                    textAlign: "center",
                  }}
                >
                  <Calendar style={{ width: "20px", height: "20px", color: "hsl(162,55%,30%)", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "hsl(162,55%,25%)", lineHeight: 1.4 }}>
                    {event.date}
                  </p>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                        {event.title}
                      </h3>
                      <p
                        className="arabic-text"
                        style={{ color: "hsl(162,55%,30%)", fontSize: "15px" }}
                      >
                        {event.arabic}
                      </p>
                    </div>
                    <span
                      style={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.type}
                    </span>
                  </div>

                  <p style={{ color: "#475569", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>
                    {event.description}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock style={{ width: "14px", height: "14px", color: "#94a3b8" }} />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>{event.time}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin style={{ width: "14px", height: "14px", color: "#94a3b8" }} />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>{event.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users style={{ width: "14px", height: "14px", color: "#94a3b8" }} />
                      <span style={{ fontSize: "13px", color: "#64748b" }}>{event.audience}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic Calendar Note */}
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "48px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
            Academic Calendar 2026/2027
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { term: "First Term", arabic: "الفصل الأول", start: "September 2026", end: "December 2026", color: "hsl(162,55%,28%)" },
              { term: "Second Term", arabic: "الفصل الثاني", start: "January 2027", end: "March 2027", color: "hsl(220,70%,50%)" },
              { term: "Third Term", arabic: "الفصل الثالث", start: "April 2027", end: "June 2027", color: "hsl(42,78%,45%)" },
            ].map((t) => (
              <div
                key={t.term}
                style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "20px",
                  borderLeft: `4px solid ${t.color}`,
                }}
              >
                <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                  {t.term}
                </h4>
                <p className="arabic-text" style={{ fontSize: "13px", color: t.color, marginBottom: "10px" }}>
                  {t.arabic}
                </p>
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  {t.start} — {t.end}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, hsl(162,72%,10%) 0%, hsl(162,60%,18%) 100%)",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>
            Stay Updated
          </h2>
          <p style={{ color: "hsl(162,35%,70%)", fontSize: "15px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
            Contact the academy to learn about upcoming events, lectures, and academic activities.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
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
              Contact Us
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