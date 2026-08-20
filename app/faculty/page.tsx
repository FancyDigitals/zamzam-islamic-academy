import { BookOpen, Award, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Faculty | Zamzam Islamic Academy",
  description:
    "Meet the qualified Islamic scholars and Arabic language specialists at Zamzam Islamic Academy.",
};

const faculty = [
  {
    title: "Head of Islamic Studies",
    department: "Islamic Sciences",
    arabicDepartment: "العلوم الشرعية",
    specialization: "Qur'an, Tafsir, Hadith",
    bio: "The Head of Islamic Studies leads the academy's Islamic sciences curriculum, ensuring all courses are rooted in authentic scholarship and taught with academic rigour.",
  },
  {
    title: "Head of Arabic Department",
    department: "Arabic Language",
    arabicDepartment: "اللغة العربية",
    specialization: "Arabic Grammar, Morphology, Literature",
    bio: "The Head of Arabic oversees the Arabic language programme from foundational grammar through advanced literature and composition.",
  },
  {
    title: "Fiqh Instructor",
    department: "Islamic Sciences",
    arabicDepartment: "العلوم الشرعية",
    specialization: "Fiqh, Usul al-Fiqh",
    bio: "Our Fiqh instructor teaches Islamic jurisprudence across both Idadiyyah and Thanawiyyah levels, covering essential rulings and principles.",
  },
  {
    title: "Qur'an Teacher",
    department: "Qur'anic Studies",
    arabicDepartment: "الدراسات القرآنية",
    specialization: "Tajweed, Hifz, Qur'anic Recitation",
    bio: "Our Qur'an teacher guides students in proper recitation with tajweed, memorization, and an appreciation for the beauty of the Qur'anic text.",
  },
  {
    title: "Arabic Grammar Instructor",
    department: "Arabic Language",
    arabicDepartment: "اللغة العربية",
    specialization: "Nahw, Sarf, I'rab",
    bio: "Responsible for teaching Arabic grammar and morphology from the foundational level through to advanced grammatical analysis.",
  },
  {
    title: "Islamic History Instructor",
    department: "Islamic Sciences",
    arabicDepartment: "العلوم الشرعية",
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
    subjects: ["Arabic Grammar", "Morphology", "Literature", "Composition", "Rhetoric"],
  },
  {
    name: "Qur'anic Studies",
    arabic: "الدراسات القرآنية",
    icon: Award,
    subjects: ["Tajweed", "Memorization (Hifz)", "Recitation", "Tafsir"],
  },
];

export default function FacultyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "hsl(40, 40%, 97%)" }}>

      {/* ═══════════════════════════════════════════
          HERO — Cream with pattern
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
            className="text-xs uppercase mb-3"
            style={{
              color: "hsl(38, 60%, 45%)",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            Academic Staff
          </p>
          <p
            className="arabic-text mb-3"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            هيئة التدريس
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
            Our Faculty
          </h1>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            Qualified Islamic scholars and Arabic language specialists dedicated to providing
            authentic, structured education with academic discipline.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ACADEMIC DEPARTMENTS
          ═══════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <p
              className="text-xs uppercase mb-3"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Academic Divisions
            </p>
            <h2
              className="mb-2"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Academic Departments
            </h2>
            <p
              className="arabic-text"
              style={{ color: "hsl(35, 65%, 32%)", fontSize: "1.05rem" }}
            >
              الأقسام الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.name}
                  className="paper-card rounded-lg p-6 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-4"
                    style={{ background: "hsl(42, 75%, 88%)" }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      color: "hsl(0, 0%, 8%)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      marginBottom: "2px",
                    }}
                  >
                    {dept.name}
                  </h3>
                  <p
                    className="arabic-text mb-4"
                    style={{ color: "hsl(35, 65%, 32%)", fontSize: "0.95rem" }}
                  >
                    {dept.arabic}
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {dept.subjects.map((subj) => (
                      <span
                        key={subj}
                        className="text-xs px-2.5 py-1 rounded"
                        style={{
                          background: "hsl(38, 45%, 94%)",
                          color: "hsl(0, 0%, 15%)",
                          border: "1px solid hsl(35, 25%, 88%)",
                          fontWeight: 500,
                          letterSpacing: "-0.005em",
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
      </section>

      {/* ═══════════════════════════════════════════
          FACULTY MEMBERS
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "hsl(40, 40%, 97%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <p
              className="text-xs uppercase mb-3"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Instructional Staff
            </p>
            <h2
              className="mb-2"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Faculty Roles & Instructors
            </h2>
            <p
              className="arabic-text"
              style={{ color: "hsl(35, 65%, 32%)", fontSize: "1.05rem" }}
            >
              أعضاء هيئة التدريس
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faculty.map((member, i) => (
              <div
                key={i}
                className="paper-card rounded-lg p-7"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-extrabold text-sm"
                    style={{
                      background: "hsl(42, 75%, 88%)",
                      color: "hsl(35, 65%, 32%)",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        color: "hsl(0, 0%, 8%)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                        marginBottom: "2px",
                      }}
                    >
                      {member.title}
                    </h3>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    >
                      {member.department} ·{" "}
                      <span className="arabic-text inline">{member.arabicDepartment}</span>
                    </p>
                  </div>
                </div>

                <p
                  className="text-sm mb-4"
                  style={{
                    color: "hsl(0, 0%, 35%)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.6,
                  }}
                >
                  {member.bio}
                </p>

                <div
                  className="rounded-md p-3"
                  style={{
                    background: "hsl(40, 40%, 97%)",
                    border: "1px solid hsl(35, 20%, 88%)",
                  }}
                >
                  <p
                    className="text-[10px] uppercase font-bold tracking-wider mb-0.5"
                    style={{ color: "hsl(0, 0%, 45%)" }}
                  >
                    Specialization
                  </p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "hsl(0, 0%, 15%)" }}
                  >
                    {member.specialization}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          JOIN FACULTY CTA — Dark section
          ═══════════════════════════════════════════ */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "hsl(0, 0%, 8%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "url('/pattern-white.svg')",
            backgroundSize: "80px 80px",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-xs uppercase mb-3"
            style={{
              color: "hsl(38, 60%, 55%)",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            Opportunities
          </p>
          <h2
            className="mb-4"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              color: "hsl(40, 40%, 97%)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Join Our Faculty
          </h2>
          <p
            className="text-sm mb-8 max-w-xl mx-auto"
            style={{
              color: "hsl(40, 20%, 75%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            Zamzam Islamic Academy is always looking for qualified Islamic scholars and
            Arabic language instructors who share our commitment to authentic, structured education.
          </p>
          <a
            href="mailto:info@zamzamacademy.ng"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold transition-all hover:opacity-90"
            style={{
              background: "hsl(38, 60%, 45%)",
              color: "hsl(0, 0%, 8%)",
              letterSpacing: "-0.01em",
            }}
          >
            <Mail className="w-4 h-4" />
            Contact Academic Board
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HADITH QUOTE
          ═══════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p
            className="arabic-text mb-3"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            الْعُلَمَاءُ وَرَثَةُ الْأَنْبِيَاءِ
          </p>
          <p
            className="text-sm italic mb-1"
            style={{ color: "hsl(0, 0%, 30%)" }}
          >
            &ldquo;The scholars are the inheritors of the Prophets.&rdquo;
          </p>
          <p
            className="text-xs"
            style={{
              color: "hsl(0, 0%, 45%)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            — Prophet Muhammad ﷺ
          </p>
        </div>
      </section>
    </div>
  );
}