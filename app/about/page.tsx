import {
  BookOpen,
  Star,
  Shield,
  Heart,
  Lightbulb,
  Users,
  Award,
  Target,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About | Zamzam Islamic Academy",
  description:
    "Learn about Zamzam Islamic Academy, our vision, mission, Mudir, philosophy, and values.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "hsl(40, 40%, 97%)" }}>

      {/* HERO */}
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
            عن الأكاديمية
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
            About Zamzam Islamic Academy
          </h1>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            A modern Islamic and Arabic educational institution committed to producing
            students of authentic knowledge, strong character, and academic discipline.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p
              className="text-xs uppercase mb-2"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Who We Are
            </p>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              An institution rooted in tradition, built for today.
            </h2>
          </div>

          <div className="space-y-5">
            <p
              className="text-base"
              style={{
                color: "hsl(0, 0%, 30%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.75,
              }}
            >
              Zamzam Islamic Academy is a structured Islamic and Arabic educational
              institution based in Nigeria. We are dedicated to providing quality
              Islamic education that combines the rigour of traditional Islamic
              scholarship with the accessibility and sophistication of modern
              educational tools.
            </p>
            <p
              className="text-base"
              style={{
                color: "hsl(0, 0%, 30%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.75,
              }}
            >
              Our academy offers two core academic programmes —{" "}
              <strong style={{ color: "hsl(0, 0%, 8%)" }}>Idadiyyah</strong>{" "}
              (Foundation / Intermediate) and{" "}
              <strong style={{ color: "hsl(0, 0%, 8%)" }}>Thanawiyyah</strong>{" "}
              (Advanced) — designed to take students on a comprehensive journey
              through Islamic sciences and Arabic language mastery.
            </p>
            <p
              className="text-base"
              style={{
                color: "hsl(0, 0%, 30%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.75,
              }}
            >
              We believe that authentic Islamic knowledge must be taught with
              academic discipline, assessed with fairness, and delivered through
              platforms that match the expectations of today&apos;s learners without
              compromising the integrity and depth of the knowledge itself.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE MUDIR
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "hsl(38, 45%, 94%)" }}>
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
              Leadership
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
              The Mudir
            </h2>
            <p
              className="arabic-text"
              style={{ color: "hsl(35, 65%, 32%)", fontSize: "1.1rem" }}
            >
              المدير
            </p>
          </div>

          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "hsl(0, 0%, 100%)",
              border: "1px solid hsl(35, 20%, 85%)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-5">

              {/* Photo column */}
              <div
                className="md:col-span-2 relative min-h-[320px] md:min-h-full"
                style={{ background: "hsl(0, 0%, 8%)" }}
              >
                <img
                  src="/mudir.jpg"
                  alt="As-Sheikh (Dr.) Muneerudeen Salahudeen (AR-RIYAADY) — Mudir of Zamzam Islamic Academy"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{
                    objectPosition: "center top",
                  }}
                />
                {/* Soft gradient at bottom of photo on mobile */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 md:hidden"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(0,0%,8%) 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Content column */}
              <div className="md:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">

                <h3
                  style={{
                    fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
                    color: "hsl(0, 0%, 8%)",
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                    marginBottom: "8px",
                  }}
                >
                  As-Sheikh (Dr.) Muneerudeen Salahudeen
                </h3>

                <p
                  className="mb-1"
                  style={{
                    color: "hsl(35, 65%, 32%)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  AR-RIYAADY
                </p>

                <p
                  className="arabic-text mb-5"
                  style={{
                    color: "hsl(38, 60%, 40%)",
                    fontSize: "1.05rem",
                  }}
                >
                  الشيخ الدكتور منير الدين صلاح الدين الرياضي
                </p>

                <div
                  className="h-px w-16 mb-5"
                  style={{ background: "hsl(38, 60%, 45%)" }}
                />

                <p
                  className="text-sm mb-4"
                  style={{
                    color: "hsl(0, 0%, 30%)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.7,
                  }}
                >
                  The Mudir of Zamzam Islamic Academy provides spiritual and academic
                  leadership for the institution. Under his guidance, the academy
                  upholds authentic Islamic scholarship, structured Arabic education,
                  and the formation of students of knowledge and character.
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "hsl(0, 0%, 40%)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.7,
                  }}
                >
                  His vision anchors the academy&apos;s commitment to excellence in
                  Islamic sciences, Arabic language mastery, and disciplined academic
                  progression for every student.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-md"
                    style={{
                      background: "hsl(38, 45%, 94%)",
                      color: "hsl(35, 65%, 28%)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Mudir of the Academy
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-md"
                    style={{
                      background: "hsl(0, 0%, 8%)",
                      color: "hsl(40, 40%, 97%)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Academic & Spiritual Leadership
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional short note under card */}
          <p
            className="text-center text-xs mt-6 max-w-xl mx-auto"
            style={{
              color: "hsl(0, 0%, 45%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.6,
            }}
          >
            The Mudir oversees the academic direction, scholarly standards, and
            overall mission of Zamzam Islamic Academy.
          </p>
        </div>
      </section>

      {/* VISION & MISSION */}
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

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                style={{ background: "hsl(38, 60%, 45%)" }}
              >
                <Target className="w-5 h-5" style={{ color: "hsl(0, 0%, 8%)" }} />
              </div>
              <p
                className="text-xs uppercase mb-2"
                style={{
                  color: "hsl(38, 60%, 55%)",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                }}
              >
                Our Vision
              </p>
              <h3
                className="mb-4"
                style={{
                  fontSize: "1.6rem",
                  color: "hsl(40, 40%, 97%)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                }}
              >
                To be Nigeria&apos;s leading Islamic and Arabic academy.
              </h3>
              <p
                className="text-sm"
                style={{
                  color: "hsl(40, 20%, 72%)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.7,
                }}
              >
                Producing graduates who are grounded in their deen, fluent in
                Arabic, and equipped to contribute meaningfully to their
                communities and to the advancement of Islamic knowledge.
              </p>
            </div>

            <div>
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                style={{ background: "hsl(38, 60%, 45%)" }}
              >
                <Award className="w-5 h-5" style={{ color: "hsl(0, 0%, 8%)" }} />
              </div>
              <p
                className="text-xs uppercase mb-2"
                style={{
                  color: "hsl(38, 60%, 55%)",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                }}
              >
                Our Mission
              </p>
              <h3
                className="mb-4"
                style={{
                  fontSize: "1.6rem",
                  color: "hsl(40, 40%, 97%)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                }}
              >
                Developing the whole student knowledge, character, and discipline.
              </h3>
              <p
                className="text-sm"
                style={{
                  color: "hsl(40, 20%, 72%)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.7,
                }}
              >
                To provide structured, assessable, and digitally accessible Islamic
                and Arabic education that develops the student intellectually,
                spiritually, linguistically, and morally — through authentic
                scholarship and modern pedagogical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-20" style={{ background: "hsl(0, 0%, 100%)" }}>
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
              Our Approach
            </p>
            <h2
              className="mb-3"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Educational Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Islamic Sciences",
                arabic: "العلوم الإسلامية",
                desc: "Comprehensive study of Qur'an, Hadith, Fiqh, Aqeedah, Tafsir, and Sirah through structured curricula.",
              },
              {
                title: "Arabic Language",
                arabic: "اللغة العربية",
                desc: "Rigorous Arabic grammar, morphology, literature, and composition to build true linguistic competency.",
              },
              {
                title: "Structured Assessment",
                arabic: "التقييم المنظم",
                desc: "Continuous assessments, examinations, and grading systems that track genuine academic progress.",
              },
              {
                title: "Character Building",
                arabic: "بناء الشخصية",
                desc: "Emphasis on adab, discipline, spiritual growth, and the practical application of knowledge.",
              },
              {
                title: "Digital Platform",
                arabic: "المنصة الرقمية",
                desc: "A modern student portal for courses, results, resources, and academic records.",
              },
              {
                title: "Academic Progression",
                arabic: "التقدم الأكاديمي",
                desc: "Clear levels from Idadiyyah through Thanawiyyah with defined learning objectives.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg p-6"
                style={{
                  background: "hsl(40, 40%, 97%)",
                  border: "1px solid hsl(35, 20%, 85%)",
                }}
              >
                <h4
                  style={{
                    fontSize: "1rem",
                    color: "hsl(0, 0%, 8%)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  className="arabic-text mb-2"
                  style={{ color: "hsl(35, 65%, 32%)", fontSize: "0.9rem" }}
                >
                  {item.arabic}
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: "hsl(0, 0%, 40%)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20" style={{ background: "hsl(38, 45%, 94%)" }}>
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
              What We Stand For
            </p>
            <h2
              className="mb-3"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: BookOpen,
                title: "Authentic Knowledge",
                arabic: "العلم الشرعي",
                desc: "Rooted in the Qur'an, Sunnah, and the scholarly tradition.",
              },
              {
                icon: Star,
                title: "Arabic Excellence",
                arabic: "التميز العربي",
                desc: "Arabic as the language of the Qur'an and Islamic scholarship.",
              },
              {
                icon: Shield,
                title: "Academic Discipline",
                arabic: "الانضباط",
                desc: "Structured learning, regular assessment, and accountability.",
              },
              {
                icon: Heart,
                title: "Character",
                arabic: "الأخلاق",
                desc: "Developing students of excellent conduct and strong values.",
              },
              {
                icon: Lightbulb,
                title: "Spiritual Growth",
                arabic: "التزكية",
                desc: "Connecting knowledge to worship, practice, and devotion.",
              },
              {
                icon: Users,
                title: "Community",
                arabic: "المجتمع",
                desc: "A supportive community united in the pursuit of knowledge.",
              },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="paper-card rounded-lg p-6">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center mb-3"
                    style={{ background: "hsl(42, 75%, 88%)" }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    />
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      color: "hsl(0, 0%, 8%)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {value.title}
                  </h4>
                  <p
                    className="arabic-text mb-2"
                    style={{ color: "hsl(35, 65%, 32%)", fontSize: "0.9rem" }}
                  >
                    {value.arabic}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "hsl(0, 0%, 40%)",
                      letterSpacing: "-0.005em",
                      lineHeight: 1.6,
                    }}
                  >
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
          </p>
          <p
            className="text-sm italic mb-8"
            style={{ color: "hsl(0, 0%, 40%)" }}
          >
            &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo; — Prophet Muhammad ﷺ
          </p>
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white text-sm font-semibold"
            style={{ background: "hsl(0, 0%, 8%)" }}
          >
            Apply for Admission
          </Link>
        </div>
      </section>
    </div>
  );
}