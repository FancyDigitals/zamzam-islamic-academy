import Link from "next/link";
import {
  BookOpen,
  Star,
  Users,
  Award,
  ArrowRight,
  ChevronRight,
  Heart,
  Lightbulb,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      "We believe in the value of structured academic discipline — regular assessment, consistent study, and a culture of academic responsibility.",
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
    duration: "Multi-year programme",
    href: "/programmes#idadiyyah",
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
    duration: "Multi-year programme",
    href: "/programmes#thanawiyyah",
  },
];

const stats = [
  { label: "Structured Programmes", value: "2+" },
  { label: "Islamic Subjects", value: "10+" },
  { label: "Years of Tradition", value: "Est." },
  { label: "Students Served", value: "100s" },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ================================================
          HERO SECTION
      ================================================ */}
      <section className="relative gradient-hero min-h-screen flex items-center">
        {/* Background geometric pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-emerald-700/10 blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-800/5 blur-3xl" />

          {/* Geometric lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Arabic bismillah */}
            <div className="mb-8">
              <p className="arabic-text text-emerald-300 text-2xl mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-emerald-500 text-xs tracking-wider uppercase">
                In the Name of Allah
              </p>
            </div>

            {/* Main heading */}
            <div className="mb-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                Zamzam
                <span className="block text-emerald-400">
                  Islamic Academy
                </span>
              </h1>
              <p className="arabic-text text-emerald-300 text-xl mb-4">
                أكاديمية زمزم الإسلامية
              </p>
            </div>

            <p className="text-emerald-100 text-xl sm:text-2xl leading-relaxed max-w-2xl mx-auto mb-4">
              A modern Islamic and Arabic education platform rooted in
              authentic knowledge.
            </p>
            <p className="text-emerald-400 text-base leading-relaxed max-w-xl mx-auto mb-12">
              Providing structured Idadiyyah and Thanawiyyah programmes
              for students committed to Islamic and Arabic excellence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/admissions">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-base shadow-lg shadow-emerald-900/50"
                >
                  Apply for Admission
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-200 hover:bg-emerald-800/50 px-8 py-6 text-base"
                >
                  Student Portal
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/programmes">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-emerald-300 hover:text-white hover:bg-emerald-800/30 px-8 py-6 text-base"
                >
                  Explore Programmes
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-emerald-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          PROGRAMMES SECTION
      ================================================ */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Academic Programmes
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Programmes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Structured Islamic and Arabic education programmes designed
              to produce scholars of knowledge and character.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programmes.map((programme) => (
              <div
                key={programme.name}
                className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-2xl" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {programme.name}
                      </h3>
                      <p className="arabic-text text-emerald-600 text-lg">
                        {programme.arabic}
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                      {programme.duration}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {programme.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Subjects Include:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {programme.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={programme.href}>
                    <Button
                      variant="ghost"
                      className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 p-0 h-auto font-semibold group-hover:gap-3 transition-all"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/programmes">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white">
                View All Programmes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          VALUES SECTION
      ================================================ */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-3">
              What We Stand For
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The principles that guide every aspect of education at
              Zamzam College Of Islamic And Arabic Studies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {value.title}
                  </h3>
                  <p className="arabic-text text-emerald-600 text-sm mb-3">
                    {value.arabic}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================
          MISSION & VISION
      ================================================ */}
      <section className="py-24 bg-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="islamic-geo"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="40,0 80,20 80,60 40,80 0,60 0,20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-geo)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Vision */}
            <div>
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-4">
                Our Vision
              </p>
              <h2 className="text-3xl font-bold text-white mb-6">
                To be one of Nigeria's leading Islamic and Arabic
                academic institutions.
              </h2>
              <p className="text-emerald-300 leading-relaxed mb-4">
                Zamzam College Of Islamic And Arabic Studies envisions a future where authentic
                Islamic and Arabic education is accessible, structured,
                and digitally empowered — producing graduates who are
                grounded in their deen, fluent in Arabic, and equipped
                to contribute meaningfully to their communities.
              </p>
              <p className="text-emerald-400 leading-relaxed">
                We aim to build a genuine digital educational institution
                that preserves the tradition of Islamic scholarship while
                embracing the tools of modernity.
              </p>
            </div>

            {/* Mission */}
            <div>
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl font-bold text-white mb-6">
                Developing scholars of knowledge, character, and
                discipline.
              </h2>
              <ul className="space-y-4">
                {[
                  "Teach authentic Islamic sciences through structured, assessable programmes",
                  "Develop strong Arabic language competency as the foundation of Islamic scholarship",
                  "Build character, discipline, and spiritual awareness alongside academic achievement",
                  "Provide a modern digital platform that makes quality Islamic education accessible",
                  "Prepare students for continued Islamic study and positive contribution to society",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-emerald-300 text-sm leading-relaxed">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          CTA SECTION
      ================================================ */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="arabic-text text-emerald-600 text-2xl mb-4">
            طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
          </p>
          <p className="text-gray-500 text-sm mb-10 italic">
            "Seeking knowledge is an obligation upon every Muslim."
            <span className="text-gray-400"> — Prophet Muhammad ﷺ</span>
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Begin Your Academic Journey
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Join Zamzam College Of Islamic And Arabic Studies and embark on a structured path
            of Islamic and Arabic education designed for academic
            excellence and spiritual growth.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admissions">
              <Button
                size="lg"
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-10 py-6 text-base"
              >
                Apply for Admission
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 text-base"
              >
                Contact the Academy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}