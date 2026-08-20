"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Home", arabic: "الرئيسية", href: "/" },
  { name: "About", arabic: "من نحن", href: "/about" },
  { name: "Programmes", arabic: "البرامج", href: "/programmes" },
  { name: "Admissions", arabic: "القبول", href: "/admissions" },
  { name: "Library", arabic: "المكتبة", href: "/resources" },
  { name: "Contact", arabic: "اتصل بنا", href: "/contact" },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/student") ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return null;
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: "hsl(40, 40%, 97%)",
          borderBottom: scrolled
            ? "1px solid hsl(35, 20%, 82%)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 1px 12px rgba(0, 0, 0, 0.04)"
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[80px]">

            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/logo.png"
                alt="Zamzam Islamic Academy"
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "contain",
                }}
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span
                  style={{
                    color: "hsl(0, 0%, 8%)",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  ZAMZAM ISLAMIC ACADEMY
                </span>
                <span
                  className="mt-1"
                  style={{
                    color: "hsl(38, 60%, 45%)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Est. Nigeria · Islamic Education
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-3 py-2 rounded-md transition-all group"
                    style={{
                      color: active ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 25%)",
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.875rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span className="relative">
                      {link.name}
                      <span
                        className="absolute left-0 right-0 -bottom-1 h-[2px] transition-all"
                        style={{
                          background: active
                            ? "hsl(38, 60%, 45%)"
                            : "transparent",
                        }}
                      />
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link
                href="/admissions"
                className="text-sm px-4 py-2 rounded-md transition-all"
                style={{
                  color: "hsl(0, 0%, 8%)",
                  border: "1.5px solid hsl(0, 0%, 8%)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(0, 0%, 8%)";
                  e.currentTarget.style.color = "hsl(40, 40%, 97%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "hsl(0, 0%, 8%)";
                }}
              >
                Apply Now
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md transition-all text-white"
                style={{
                  background: "hsl(0, 0%, 8%)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(38, 60%, 45%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "hsl(0, 0%, 8%)";
                }}
              >
                Student Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: "hsl(0, 0%, 8%)" }}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div
          className="h-[1px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(38, 60%, 45%, 0.25) 50%, transparent 100%)",
            opacity: scrolled ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        />
      </header>

      <div
        className="lg:hidden fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className="lg:hidden fixed top-0 right-0 bottom-0 z-[70] flex flex-col transition-transform duration-300 ease-out"
        style={{
          width: "min(88vw, 360px)",
          background: "hsl(40, 40%, 97%)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid hsl(35, 20%, 85%)" }}
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Zamzam Islamic Academy"
              style={{
                width: "38px",
                height: "38px",
                objectFit: "contain",
              }}
            />
            <div className="flex flex-col leading-none">
              <span
                style={{
                  color: "hsl(0, 0%, 8%)",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  letterSpacing: "-0.01em",
                }}
              >
                ZAMZAM ISLAMIC
              </span>
              <span
                style={{
                  color: "hsl(38, 60%, 45%)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  marginTop: "2px",
                }}
              >
                ACADEMY
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md"
            style={{ color: "hsl(0, 0%, 20%)" }}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" strokeWidth={2.2} />
          </button>
        </div>

        <div
          className="px-5 py-3 text-center"
          style={{ background: "hsl(38, 45%, 94%)" }}
        >
          <span
            className="arabic-text inline-block"
            style={{
              fontSize: "1rem",
              color: "hsl(35, 65%, 32%)",
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-3.5 rounded-lg transition-colors mb-0.5"
                style={{
                  background: active ? "hsl(38, 45%, 94%)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      background: active
                        ? "hsl(38, 60%, 45%)"
                        : "transparent",
                    }}
                  />
                  <span
                    style={{
                      color: active ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 25%)",
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.95rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {link.name}
                  </span>
                </div>
                <span
                  className="arabic-text"
                  style={{
                    color: active
                      ? "hsl(35, 65%, 32%)"
                      : "hsl(0, 0%, 55%)",
                    fontSize: "0.85rem",
                  }}
                >
                  {link.arabic}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className="p-4 flex flex-col gap-2"
          style={{
            borderTop: "1px solid hsl(35, 20%, 85%)",
            background: "hsl(38, 45%, 96%)",
          }}
        >
          <Link
            href="/admissions"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center px-4 py-3 rounded-md transition-colors"
            style={{
              color: "hsl(0, 0%, 8%)",
              border: "1.5px solid hsl(0, 0%, 8%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "-0.01em",
            }}
          >
            Apply for Admission
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white transition-colors"
            style={{
              background: "hsl(0, 0%, 8%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "-0.01em",
            }}
          >
            Student Portal
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p
            className="text-center mt-2 text-xs"
            style={{
              color: "hsl(0, 0%, 45%)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            © {new Date().getFullYear()} Zamzam Islamic Academy
          </p>
        </div>
      </aside>
    </>
  );
}