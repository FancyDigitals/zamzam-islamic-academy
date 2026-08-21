import Link from "next/link";
import { Book, Download, Eye, Search, BookOpen, FileText } from "lucide-react";

export const metadata = {
  title: "Digital Library | Zamzam College Of Islamic And Arabic Studies",
  description:
    "Explore classical Turas, academic resources, and publications by As-Sheikh (Dr.) Muneerudeen Salahudeen (AR-RIYAADY).",
};

// Placeholder data (we will replace this with Database data later)
const mudirBooks = [
  {
    id: 1,
    title: "Foundations of Arabic Rhetoric",
    arabic: "أصول البلاغة العربية",
    type: "Book",
    pages: 142,
    year: "2023",
    desc: "A comprehensive guide to Balagha, written specifically for intermediate students of knowledge.",
  },
  {
    id: 2,
    title: "Understanding the Maliki Madhhab",
    arabic: "المدخل إلى الفقه المالكي",
    type: "Research Paper",
    pages: 45,
    year: "2021",
    desc: "An introductory paper on the principles (Usul) of the Maliki school of jurisprudence.",
  },
];

const classicalTuras = [
  {
    id: 3,
    title: "Al-Ajurrumiyyah",
    arabic: "متن الآجرومية",
    author: "Ibn Da'ud",
    arabicAuthor: "ابن آجروم",
    category: "Arabic Grammar / النحو",
    desc: "The foundational classical text for Arabic grammar.",
  },
  {
    id: 4,
    title: "Al-Arba'in An-Nawawiyyah",
    arabic: "الأربعون النووية",
    author: "Imam An-Nawawi",
    arabicAuthor: "الإمام النووي",
    category: "Hadith / الحديث",
    desc: "The 40 foundational Hadith compiled by Imam An-Nawawi.",
  },
  {
    id: 5,
    title: "Tuhfat al-Atfal",
    arabic: "تحفة الأطفال",
    author: "Sulayman al-Jamzuri",
    arabicAuthor: "سليمان الجمزوري",
    category: "Tajweed / التجويد",
    desc: "A classical poem explaining the foundational rules of Tajweed.",
  },
];

export default function LibraryPage() {
  return (
    <div style={{ minHeight: "100vh", background: "hsl(40, 40%, 97%)" }}>
      {/* ═══════════════════════════════════════════
          HERO
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-xs uppercase mb-3"
            style={{
              color: "hsl(38, 60%, 45%)",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            Resources & Texts
          </p>
          <p
            className="arabic-text mb-3"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            المكتبة الرقمية
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
            Digital Library
          </h1>
          <p
            className="text-base max-w-2xl mx-auto mb-8"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.65,
            }}
          >
            Access classical Turas, academic curriculum texts, and exclusive
            publications. Read online, quote, and download directly.
          </p>

          {/* Search Bar (UI only for now) */}
          <div className="max-w-xl mx-auto relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "hsl(0, 0%, 50%)" }}
            />
            <input
              type="text"
              placeholder="Search library (e.g., 'Ajurrumiyyah', 'Fiqh')..."
              className="w-full h-14 pl-12 pr-4 rounded-full outline-none transition-all"
              style={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 20%, 85%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                color: "hsl(0, 0%, 8%)",
                fontSize: "0.95rem",
              }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MUDIR'S PUBLICATIONS (Featured)
          ═══════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "hsl(0, 0%, 8%)" }}>
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "url('/pattern-white.svg')",
            backgroundSize: "80px 80px",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  color: "hsl(40, 40%, 97%)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Mudir's Publications
              </h2>
              <p
                className="arabic-text mt-1"
                style={{ color: "hsl(38, 60%, 55%)", fontSize: "1.1rem" }}
              >
                مؤلفات الشيخ المدير
              </p>
            </div>
            <p
              className="text-sm"
              style={{ color: "hsl(40, 20%, 65%)", maxWidth: "400px" }}
            >
              Original books, papers, and commentaries written by As-Sheikh (Dr.)
              Muneerudeen Salahudeen (AR-RIYAADY).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mudirBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-xl p-6 sm:p-8 flex flex-col justify-between"
                style={{
                  background: "hsl(0, 0%, 12%)",
                  border: "1px solid hsl(0, 0%, 18%)",
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "hsl(38, 60%, 45%)" }}
                    >
                      <Book style={{ color: "hsl(0, 0%, 8%)" }} />
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "hsl(40, 40%, 97%)",
                      }}
                    >
                      {book.type}
                    </span>
                  </div>
                  <h3
                    className="mb-1"
                    style={{
                      color: "hsl(40, 40%, 97%)",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    className="arabic-text mb-4"
                    style={{ color: "hsl(38, 60%, 55%)", fontSize: "1.05rem" }}
                  >
                    {book.arabic}
                  </p>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "hsl(40, 20%, 70%)", lineHeight: 1.6 }}
                  >
                    {book.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-md text-sm font-bold transition-colors"
                    style={{
                      background: "hsl(38, 60%, 45%)",
                      color: "hsl(0, 0%, 8%)",
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Read Online
                  </button>
                  <button
                    className="inline-flex items-center justify-center w-11 h-11 rounded-md transition-colors"
                    style={{
                      border: "1px solid hsl(0, 0%, 25%)",
                      color: "hsl(40, 40%, 97%)",
                    }}
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CLASSICAL TURAS
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "hsl(0, 0%, 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  color: "hsl(0, 0%, 8%)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Classical Texts (Turas)
              </h2>
              <p
                className="arabic-text mt-1"
                style={{ color: "hsl(35, 65%, 32%)", fontSize: "1.1rem" }}
              >
                كتب التراث الإسلامي
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classicalTuras.map((book) => (
              <div
                key={book.id}
                className="paper-card rounded-lg p-6 flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen
                      className="w-4 h-4"
                      style={{ color: "hsl(38, 60%, 45%)" }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "hsl(0, 0%, 40%)" }}
                    >
                      {book.category}
                    </span>
                  </div>
                  <h3
                    className="mb-1"
                    style={{
                      color: "hsl(0, 0%, 8%)",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    className="arabic-text mb-3"
                    style={{ color: "hsl(35, 65%, 32%)", fontSize: "1rem" }}
                  >
                    {book.arabic}
                  </p>
                  <div
                    className="mb-4 text-sm"
                    style={{
                      color: "hsl(0, 0%, 30%)",
                      borderLeft: "2px solid hsl(38, 60%, 45%)",
                      paddingLeft: "10px",
                    }}
                  >
                    <p className="font-semibold">{book.author}</p>
                    <p className="arabic-text text-xs mt-0.5 opacity-80">
                      {book.arabicAuthor}
                    </p>
                  </div>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "hsl(0, 0%, 45%)", lineHeight: 1.6 }}
                  >
                    {book.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t pt-4" style={{ borderColor: "hsl(35, 20%, 90%)" }}>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded text-xs font-bold transition-colors"
                    style={{
                      background: "hsl(40, 40%, 95%)",
                      color: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(35, 20%, 85%)",
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Read
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded text-xs font-bold transition-colors"
                    style={{
                      background: "hsl(40, 40%, 95%)",
                      color: "hsl(0, 0%, 8%)",
                      border: "1px solid hsl(35, 20%, 85%)",
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}