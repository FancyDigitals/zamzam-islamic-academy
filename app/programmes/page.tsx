import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Programmes | Zamzam College of Islamic and Arabic Studies",
  description:
    "Explore Idadiyyah and Thanawiyyah — structured Islamic and Arabic programmes at Zamzam College Of Islamic And Arabic Studies.",
};

const programmes = [
  {
    name: "Idadiyyah",
    arabic: "الإعدادية",
    code: "IDADIYYAH",
    duration: "3 Years",
    level: "Foundation & Intermediate",
    levelArabic: "التأسيس والمتوسط",
    description:
      "Foundation and intermediate Islamic and Arabic education. Students develop the core linguistic and religious foundations necessary for advanced Islamic study.",
    objectives: [
      "Build strong foundations in Arabic grammar and morphology",
      "Introduce core Islamic sciences with structured assessment",
      "Establish Qur'anic recitation and memorization habits",
      "Develop academic discipline and Islamic character",
    ],
    subjects: [
      { en: "Arabic Grammar", ar: "النحو" },
      { en: "Arabic Morphology", ar: "الصرف" },
      { en: "Arabic Literature", ar: "الأدب" },
      { en: "Arabic Composition", ar: "الإنشاء" },
      { en: "Qur'an Recitation", ar: "التلاوة" },
      { en: "Qur'an Memorization", ar: "الحفظ" },
      { en: "Tafsir", ar: "التفسير" },
      { en: "Hadith", ar: "الحديث" },
      { en: "Fiqh", ar: "الفقه" },
      { en: "Aqeedah", ar: "العقيدة" },
      { en: "Sirah", ar: "السيرة" },
    ],
    levels: [
      { name: "Idadiyyah 1", arabic: "الإعدادية الأولى" },
      { name: "Idadiyyah 2", arabic: "الإعدادية الثانية" },
      { name: "Idadiyyah 3", arabic: "الإعدادية الثالثة" },
    ],
  },
  {
    name: "Thanawiyyah",
    arabic: "الثانوية",
    code: "THANAWIYYAH",
    duration: "3 Years",
    level: "Advanced Studies",
    levelArabic: "الدراسات المتقدمة",
    description:
      "Advanced Islamic and Arabic studies. Students engage with classical Islamic texts, advanced Arabic language, and the full spectrum of Islamic sciences.",
    objectives: [
      "Achieve advanced Arabic language proficiency",
      "Master core Islamic sciences at depth",
      "Engage with classical scholarly texts",
      "Develop capacity for independent Islamic study",
    ],
    subjects: [
      { en: "Advanced Arabic Literature", ar: "الأدب المتقدم" },
      { en: "Tafsir", ar: "التفسير" },
      { en: "Hadith Sciences", ar: "علوم الحديث" },
      { en: "Advanced Fiqh", ar: "الفقه المتقدم" },
      { en: "Islamic History", ar: "التاريخ الإسلامي" },
      { en: "Usul al-Fiqh", ar: "أصول الفقه" },
      { en: "Aqeedah", ar: "العقيدة" },
      { en: "Sirah", ar: "السيرة" },
    ],
    levels: [
      { name: "Thanawiyyah 1", arabic: "الثانوية الأولى" },
      { name: "Thanawiyyah 2", arabic: "الثانوية الثانية" },
      { name: "Thanawiyyah 3", arabic: "الثانوية الثالثة" },
    ],
  },
];

export default function ProgrammesPage() {
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
            className="text-xs uppercase mb-3"
            style={{
              color: "hsl(38, 60%, 45%)",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            Academic Programmes
          </p>
          <p
            className="arabic-text mb-3"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            البرامج الأكاديمية
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
            Our Programmes
          </h1>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            Structured Islamic and Arabic education designed to produce scholars of
            knowledge, character, and discipline — from foundation to advanced study.
          </p>
        </div>
      </section>

      {/* OVERVIEW STRIP */}
      <section className="py-10" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: GraduationCap,
                label: "Two Core Pathways",
                arabic: "مساران أساسيان",
                desc: "Idadiyyah & Thanawiyyah",
              },
              {
                icon: Clock,
                label: "Multi-Year Structure",
                arabic: "هيكل متعدد السنوات",
                desc: "3 years per programme",
              },
              {
                icon: BookOpen,
                label: "Full Curriculum",
                arabic: "منهج شامل",
                desc: "Arabic + Islamic sciences",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-lg p-5 flex items-start gap-4"
                  style={{
                    background: "hsl(40, 40%, 97%)",
                    border: "1px solid hsl(35, 20%, 85%)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "hsl(42, 75%, 88%)" }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.02em" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="arabic-text text-xs mb-1"
                      style={{ color: "hsl(35, 65%, 32%)" }}
                    >
                      {item.arabic}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "hsl(0, 0%, 45%)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMME CARDS */}
      <section className="py-16 lg:py-20" style={{ background: "hsl(40, 40%, 97%)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {programmes.map((prog, index) => (
            <article
              key={prog.code}
              className="rounded-xl overflow-hidden"
              style={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 20%, 85%)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.03)",
              }}
            >
              {/* Card header */}
              <div
                className="px-6 sm:px-8 py-6 sm:py-8"
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(135deg, hsl(0,0%,8%) 0%, hsl(0,0%,14%) 70%, hsl(35,65%,18%) 100%)"
                      : "linear-gradient(135deg, hsl(0,0%,10%) 0%, hsl(0,0%,16%) 60%, hsl(38,50%,20%) 100%)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p
                      className="text-xs uppercase mb-2"
                      style={{
                        color: "hsl(38, 60%, 55%)",
                        letterSpacing: "0.15em",
                        fontWeight: 700,
                      }}
                    >
                      {prog.level}
                    </p>
                    <h2
                      style={{
                        fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                        color: "hsl(40, 40%, 97%)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                      }}
                    >
                      {prog.name}
                    </h2>
                    <p
                      className="arabic-text mt-1"
                      style={{
                        color: "hsl(38, 55%, 65%)",
                        fontSize: "1.35rem",
                      }}
                    >
                      {prog.arabic}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-md"
                      style={{
                        background: "hsl(38, 60%, 45%)",
                        color: "hsl(0, 0%, 8%)",
                      }}
                    >
                      {prog.duration}
                    </span>
                    <span
                      className="text-xs font-mono font-semibold px-3 py-1.5 rounded-md"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "hsl(40, 40%, 90%)",
                      }}
                    >
                      {prog.code}
                    </span>
                  </div>
                </div>
                <p
                  className="mt-4 text-sm max-w-2xl"
                  style={{
                    color: "hsl(40, 20%, 75%)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.65,
                  }}
                >
                  {prog.description}
                </p>
              </div>

              {/* Card body */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Objectives */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Layers
                        className="w-4 h-4"
                        style={{ color: "hsl(38, 60%, 45%)" }}
                      />
                      <h3
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: "hsl(0, 0%, 20%)" }}
                      >
                        Learning Objectives
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {prog.objectives.map((obj) => (
                        <li key={obj} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: "hsl(38, 60%, 45%)" }}
                          />
                          <span
                            className="text-sm"
                            style={{
                              color: "hsl(0, 0%, 30%)",
                              letterSpacing: "-0.005em",
                              lineHeight: 1.55,
                            }}
                          >
                            {obj}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Levels */}
                    <div className="mt-8">
                      <h3
                        className="text-sm font-bold uppercase tracking-wider mb-3"
                        style={{ color: "hsl(0, 0%, 20%)" }}
                      >
                        Programme Levels / المستويات
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {prog.levels.map((lv) => (
                          <div
                            key={lv.name}
                            className="px-3 py-2 rounded-md"
                            style={{
                              background: "hsl(40, 40%, 97%)",
                              border: "1px solid hsl(35, 20%, 85%)",
                            }}
                          >
                            <p
                              className="text-xs font-bold"
                              style={{ color: "hsl(0, 0%, 8%)" }}
                            >
                              {lv.name}
                            </p>
                            <p
                              className="arabic-text text-xs"
                              style={{ color: "hsl(35, 65%, 32%)" }}
                            >
                              {lv.arabic}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen
                        className="w-4 h-4"
                        style={{ color: "hsl(38, 60%, 45%)" }}
                      />
                      <h3
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: "hsl(0, 0%, 20%)" }}
                      >
                        Subjects Include
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prog.subjects.map((s) => (
                        <span
                          key={s.en}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md"
                          style={{
                            background: "hsl(38, 45%, 94%)",
                            border: "1px solid hsl(35, 30%, 85%)",
                            color: "hsl(0, 0%, 15%)",
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {s.en}
                          <span
                            className="arabic-text opacity-80"
                            style={{
                              color: "hsl(35, 65%, 32%)",
                              fontWeight: 500,
                            }}
                          >
                            {s.ar}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA row */}
                <div
                  className="mt-8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  style={{ borderTop: "1px solid hsl(35, 20%, 90%)" }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "hsl(0, 0%, 45%)", letterSpacing: "-0.005em" }}
                  >
                    Ready to begin? Applications are open for the current session.
                  </p>
                  <Link
                    href="/admissions"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white shrink-0"
                    style={{ background: "hsl(0, 0%, 8%)" }}
                  >
                    Apply for {prog.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PATH NOTE */}
      <section className="py-16" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="mb-3"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 1.85rem)",
              color: "hsl(0, 0%, 8%)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            A clear path of progression
          </h2>
          <p
            className="text-sm mb-8 max-w-xl mx-auto"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            Students typically begin with Idadiyyah to establish foundations in Arabic
            and Islamic sciences, then progress to Thanawiyyah for advanced study.
            Placement is confirmed during admissions review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white"
              style={{ background: "hsl(0, 0%, 8%)" }}
            >
              Apply for Admission
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold"
              style={{
                color: "hsl(0, 0%, 8%)",
                border: "1.5px solid hsl(0, 0%, 8%)",
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