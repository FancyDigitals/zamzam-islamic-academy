import Link from "next/link";
import {
  BookOpen,
  Star,
  Users,
  Award,
  ArrowRight,
  Heart,
  Lightbulb,
  Shield,
} from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "Authentic Islamic Knowledge",
    arabic: "العلم الشرعي",
    description:
      "We root every aspect of our curriculum in the authentic sources of Islamic knowledge — the Qur'an, the Sunnah, and the scholarly tradition.",
  },
  {
    icon: Star,
    title: "Arabic Excellence",
    arabic: "التميز في اللغة العربية",
    description:
      "Arabic is the language of the Qur'an and the gateway to Islamic scholarship. We teach Arabic with rigour, structure, and purpose.",
  },
  {
    icon: Shield,
    title: "Academic Discipline",
    arabic: "الانضباط الأكاديمي",
    description:
      "We believe in the value of structured academic discipline — regular assessment, consistent study, and academic responsibility.",
  },
  {
    icon: Heart,
    title: "Character Development",
    arabic: "تزكية النفس",
    description:
      "Knowledge without character is incomplete. We cultivate students of excellent conduct, strong values, and sincere intention.",
  },
  {
    icon: Lightbulb,
    title: "Spiritual Growth",
    arabic: "النمو الروحي",
    description:
      "The goal of Islamic education is not simply to pass examinations but to develop a relationship with Allah through knowledge and practice.",
  },
  {
    icon: Users,
    title: "Community",
    arabic: "المجتمع",
    description:
      "We are a community of students, teachers, and families committed to the pursuit of Islamic knowledge and righteous living.",
  },
];

const programmes = [
  {
    name: "Idadiyyah",
    arabic: "الإعدادية",
    description:
      "Foundation and intermediate Islamic and Arabic education. Students develop the core linguistic and religious foundations necessary for advanced Islamic study.",
    subjects: [
      "Arabic Grammar (النحو)",
      "Arabic Morphology (الصرف)",
      "Qur'an Recitation",
      "Aqeedah",
      "Fiqh",
      "Sirah",
    ],
    duration: "3-Year Programme",
  },
  {
    name: "Thanawiyyah",
    arabic: "الثانوية",
    description:
      "Advanced Islamic and Arabic studies. Students engage with classical Islamic texts, advanced Arabic language, and the full spectrum of Islamic sciences.",
    subjects: [
      "Advanced Arabic Literature",
      "Tafsir",
      "Hadith Sciences",
      "Advanced Fiqh",
      "Islamic History",
      "Usul al-Fiqh",
    ],
    duration: "3-Year Programme",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">

      {/* ═══════════════════════════════════════════
          HERO
          Background image (public/hero-bg.jpg) + pattern + cream overlay
          ═══════════════════════════════════════════ */}
      <section
        className="relative min-h-[85vh] flex items-center"
        style={{ background: "hsl(40, 40%, 97%)" }}
      >
        {/* Layer 1: Background image (if exists) */}
        <div className="hero-bg-image" />

        {/* Layer 2: Islamic geometric pattern */}
        <div className="hero-bg-pattern" />

        {/* Layer 3: Cream overlay for text clarity */}
        <div className="hero-bg-overlay" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center">

            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img
                src="/logo.png"
                alt="Zamzam Islamic Academy"
                style={{ width: "130px", height: "150px" }}
              />
            </div>

            {/* Arabic name */}
            <p
              className="arabic-text mb-3"
              style={{
                fontSize: "1.4rem",
                color: "hsl(35, 65%, 32%)",
                fontWeight: 500,
              }}
            >
              أكاديمية زمزم الإسلامية
            </p>

            {/* Main heading */}
            <h1
              className="mb-5"
              style={{
                fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
                color: "hsl(0, 0%, 6%)",
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1,
              }}
            >
              Zamzam
              <br />
              <span className="text-gradient-gold" style={{ fontWeight: 900 }}>
                Islamic Academy
              </span>
            </h1>

            {/* Tagline */}
            <p
              className="mb-3 max-w-xl mx-auto"
              style={{
                fontSize: "1.1rem",
                color: "hsl(0, 0%, 20%)",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.4,
              }}
            >
              A modern Islamic and Arabic education platform rooted in authentic knowledge.
            </p>
            <p
              className="mb-10 max-w-lg mx-auto text-sm"
              style={{
                color: "hsl(0, 0%, 40%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.55,
              }}
            >
              Structured Idadiyyah and Thanawiyyah programmes for students committed to Islamic and Arabic excellence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-white transition-all hover:opacity-90"
                style={{
                  background: "hsl(0, 0%, 8%)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Apply for Admission
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md transition-all"
                style={{
                  color: "hsl(0, 0%, 8%)",
                  border: "1.5px solid hsl(0, 0%, 8%)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Student Portal
              </Link>
              <Link
                href="/programmes"
                className="inline-flex items-center gap-1 px-3 py-3 transition-colors"
                style={{
                  color: "hsl(35, 65%, 32%)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Explore Programmes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROGRAMMES
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <p
              className="text-xs uppercase mb-3"
              style={{
                color: "hsl(38, 60%, 45%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Academic Programmes
            </p>
            <h2
              className="mb-3"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
              }}
            >
              Our Programmes
            </h2>
            <p
              className="max-w-xl mx-auto text-sm"
              style={{
                color: "hsl(0, 0%, 45%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.55,
              }}
            >
              Structured Islamic and Arabic education programmes designed to produce scholars of knowledge and character.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programmes.map((programme) => (
              <div
                key={programme.name}
                className="paper-card p-8 rounded-lg transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3
                      style={{
                        fontSize: "1.75rem",
                        color: "hsl(0, 0%, 8%)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                      }}
                    >
                      {programme.name}
                    </h3>
                    <p
                      className="arabic-text mt-1"
                      style={{
                        color: "hsl(35, 65%, 32%)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {programme.arabic}
                    </p>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full whitespace-nowrap"
                    style={{
                      background: "hsl(42, 75%, 88%)",
                      color: "hsl(35, 65%, 30%)",
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {programme.duration}
                  </span>
                </div>

                <p
                  className="mb-5 text-sm"
                  style={{
                    color: "hsl(0, 0%, 30%)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.55,
                  }}
                >
                  {programme.description}
                </p>

                <div className="mb-5">
                  <p
                    className="text-xs uppercase mb-2.5"
                    style={{
                      color: "hsl(0, 0%, 45%)",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                    }}
                  >
                    Subjects Include
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {programme.subjects.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2.5 py-1 rounded"
                        style={{
                          background: "hsl(40, 40%, 95%)",
                          color: "hsl(0, 0%, 25%)",
                          border: "1px solid hsl(35, 25%, 88%)",
                          fontWeight: 500,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/programmes"
                  className="inline-flex items-center gap-1 text-sm transition-colors"
                  style={{
                    color: "hsl(0, 0%, 8%)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white transition-colors"
              style={{
                background: "hsl(0, 0%, 8%)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "-0.01em",
              }}
            >
              View All Programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALUES
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "hsl(38, 45%, 94%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
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
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                color: "hsl(0, 0%, 8%)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
              }}
            >
              Our Values
            </h2>
            <p
              className="max-w-xl mx-auto text-sm"
              style={{
                color: "hsl(0, 0%, 45%)",
                letterSpacing: "-0.005em",
                lineHeight: 1.55,
              }}
            >
              The principles that guide every aspect of education at Zamzam Islamic Academy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="paper-card p-6 rounded-lg">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "hsl(42, 75%, 88%)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "hsl(35, 65%, 32%)" }} />
                  </div>
                  <h3
                    className="mb-1"
                    style={{
                      fontSize: "1.05rem",
                      color: "hsl(0, 0%, 8%)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="arabic-text mb-2"
                    style={{
                      color: "hsl(35, 65%, 32%)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {v.arabic}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "hsl(0, 0%, 40%)",
                      letterSpacing: "-0.005em",
                      lineHeight: 1.55,
                    }}
                  >
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VISION & MISSION
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: "hsl(0, 0%, 8%)" }}>
        <div
  className="absolute inset-0 opacity-[0.05] pointer-events-none"
  style={{
    backgroundImage: "url('/pattern-white.svg')",
    backgroundSize: "80px 80px",
    backgroundRepeat: "repeat",
  }}
/>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Vision */}
            <div>
              <p
                className="text-xs uppercase mb-3"
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
                  lineHeight: 1.15,
                }}
              >
                To be one of Nigeria's leading Islamic and Arabic academic institutions.
              </h3>
              <p
                className="text-sm"
                style={{
                  color: "hsl(40, 20%, 70%)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.6,
                }}
              >
                Zamzam Islamic Academy envisions a future where authentic Islamic and Arabic education is accessible, structured, and digitally empowered — producing graduates who are grounded in their deen, fluent in Arabic, and equipped to contribute meaningfully to their communities.
              </p>
            </div>

            {/* Mission */}
            <div>
              <p
                className="text-xs uppercase mb-3"
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
                  lineHeight: 1.15,
                }}
              >
                Developing scholars of knowledge, character, and discipline.
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Teach authentic Islamic sciences through structured, assessable programmes",
                  "Develop strong Arabic language competency as the foundation of Islamic scholarship",
                  "Build character, discipline, and spiritual awareness alongside academic achievement",
                  "Provide a modern digital platform that makes quality Islamic education accessible",
                  "Prepare students for continued Islamic study and contribution to society",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs mt-0.5"
                      style={{
                        background: "hsl(38, 60%, 45%)",
                        color: "hsl(0, 0%, 8%)",
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color: "hsl(40, 20%, 75%)",
                        letterSpacing: "-0.005em",
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hadith */}
          <div
            className="text-center mt-14 pt-8"
            style={{ borderTop: "1px solid hsl(0, 0%, 20%)" }}
          >
            <p
              className="arabic-text mb-2"
              style={{
                color: "hsl(38, 60%, 55%)",
                fontSize: "1.35rem",
              }}
            >
              طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
            </p>
            <p
              className="text-sm italic"
              style={{
                color: "hsl(40, 20%, 65%)",
                letterSpacing: "-0.005em",
              }}
            >
              "Seeking knowledge is an obligation upon every Muslim." — Prophet Muhammad ﷺ
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="mb-3"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              color: "hsl(0, 0%, 8%)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            Begin Your Academic Journey
          </h2>
          <p
            className="mb-8 max-w-xl mx-auto text-sm"
            style={{
              color: "hsl(0, 0%, 45%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.55,
            }}
          >
            Join Zamzam Islamic Academy and embark on a structured path of Islamic and Arabic education designed for academic excellence and spiritual growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white transition-colors"
              style={{
                background: "hsl(0, 0%, 8%)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "-0.01em",
              }}
            >
              Apply for Admission <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md transition-colors"
              style={{
                color: "hsl(0, 0%, 8%)",
                border: "1.5px solid hsl(0, 0%, 8%)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "-0.01em",
              }}
            >
              Contact the Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}