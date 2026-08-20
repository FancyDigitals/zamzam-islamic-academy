import { BookOpen, Award, GraduationCap } from "lucide-react";

const faculty = [
  {
    name: "To Be Announced",
    arabicName: "سيتم الإعلان",
    title: "Head of Islamic Studies",
    department: "Islamic Sciences",
    specialization: "Qur'an, Tafsir, Hadith",
    bio: "The Head of Islamic Studies leads the academy's Islamic sciences curriculum, ensuring all courses are rooted in authentic scholarship and taught with academic rigour.",
  },
  {
    name: "To Be Announced",
    arabicName: "سيتم الإعلان",
    title: "Head of Arabic Department",
    department: "Arabic Language",
    specialization: "Arabic Grammar, Morphology, Literature",
    bio: "The Head of Arabic oversees the Arabic language programme from foundational grammar through advanced literature and composition.",
  },
  {
    name: "To Be Announced",
    arabicName: "سيتم الإعلان",
    title: "Fiqh Instructor",
    department: "Islamic Sciences",
    specialization: "Fiqh, Usul al-Fiqh",
    bio: "Our Fiqh instructor teaches Islamic jurisprudence across both Idadiyyah and Thanawiyyah levels, covering essential rulings and principles.",
  },
  {
    name: "To Be Announced",
    arabicName: "سيتم الإعلان",
    title: "Qur'an Teacher",
    department: "Qur'anic Studies",
    specialization: "Tajweed, Hifz, Qur'anic Recitation",
    bio: "Our Qur'an teacher guides students in proper recitation with tajweed, memorization, and an appreciation for the beauty of the Qur'anic text.",
  },
  {
    name: "To Be Announced",
    arabicName: "سيتم الإعلان",
    title: "Arabic Grammar Instructor",
    department: "Arabic Language",
    specialization: "Nahw, Sarf, I'rab",
    bio: "Responsible for teaching Arabic grammar and morphology from the foundational level through to advanced grammatical analysis.",
  },
  {
    name: "To Be Announced",
    arabicName: "سيتم الإعلان",
    title: "Islamic History Instructor",
    department: "Islamic Sciences",
    specialization: "Sirah, Islamic History, Civilization",
    bio: "Teaches the life of the Prophet ﷺ, the history of the Companions, and the broader history of Islamic civilization.",
  },
];

const departments = [
  {
    name: "Islamic Sciences",
    arabic: "العلوم الشرعية",
    icon: BookOpen,
    subjects: ["Qur'an & Tafsir", "Hadith", "Fiqh", "Aqeedah", "Sirah", "Islamic History"],
  },
  {
    name: "Arabic Language",
    arabic: "اللغة العربية",
    icon: GraduationCap,
    subjects: ["Arabic Grammar (Nahw)", "Morphology (Sarf)", "Literature (Adab)", "Composition (Insha')", "Rhetoric (Balagha)"],
  },
  {
    name: "Qur'anic Studies",
    arabic: "الدراسات القرآنية",
    icon: Award,
    subjects: ["Tajweed", "Memorization (Hifz)", "Qur'anic Recitation", "Tafsir"],
  },
];

export default function FacultyPage() {
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
          هيئة التدريس
        </p>
        <h1 style={{ color: "white", fontSize: "44px", fontWeight: "700", marginBottom: "16px" }}>
          Our Faculty
        </h1>
        <p style={{ color: "hsl(162,35%,65%)", fontSize: "18px", maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
          Qualified Islamic scholars and Arabic language specialists dedicated to providing authentic, structured education.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Departments */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "24px", textAlign: "center" }}>
            Academic Departments
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.name}
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "28px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "hsl(162,40%,94%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <Icon style={{ width: "26px", height: "26px", color: "hsl(162,55%,25%)" }} />
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                    {dept.name}
                  </h3>
                  <p
                    className="arabic-text"
                    style={{ color: "hsl(162,55%,30%)", fontSize: "15px", marginBottom: "16px" }}
                  >
                    {dept.arabic}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
                    {dept.subjects.map((subj) => (
                      <span
                        key={subj}
                        style={{
                          background: "hsl(162,40%,96%)",
                          color: "hsl(162,50%,30%)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Faculty Members */}
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "24px", textAlign: "center" }}>
          Faculty Members
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "48px" }}>
          {faculty.map((member, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "hsl(162,40%,94%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "700", color: "hsl(162,55%,30%)" }}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "2px" }}>
                    {member.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "hsl(162,55%,30%)", fontWeight: "500" }}>
                    {member.department}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, marginBottom: "12px" }}>
                {member.bio}
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "10px 14px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "2px" }}>Specialization</p>
                <p style={{ fontSize: "13px", color: "#334155", fontWeight: "500" }}>{member.specialization}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Join faculty CTA */}
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
            Join Our Faculty
          </h2>
          <p style={{ color: "hsl(162,35%,70%)", fontSize: "15px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
            Zamzam Islamic Academy is always looking for qualified Islamic scholars and Arabic language instructors who share our commitment to authentic education.
          </p>
          <a
            href="mailto:info@zamzamacademy.ng"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              borderRadius: "8px",
              background: "hsl(162,55%,30%)",
              color: "white",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Contact Us
          </a>
        </div>

        {/* Quote */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p
            className="arabic-text"
            style={{ fontSize: "22px", color: "hsl(162,55%,30%)", marginBottom: "8px" }}
          >
            الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ
          </p>
          <p style={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>
            "The scholars are the inheritors of the Prophets."
            <span style={{ color: "#cbd5e1" }}> — Prophet Muhammad ﷺ</span>
          </p>
        </div>
      </div>
    </div>
  );
}