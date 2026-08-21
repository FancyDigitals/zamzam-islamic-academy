"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const SCHOOL_NAME = "ZAMZAM COLLEGE OF ISLAMIC AND ARABIC STUDIES";
const SCHOOL_NAME_ARABIC = "كلية زمزم للدراسات الإسلامية والعربية";

const navLinks = [
  { name: "Home", arabic: "الرئيسية", href: "/" },
  { name: "About", arabic: "من نحن", href: "/about" },
  { name: "Programmes", arabic: "البرامج", href: "/programmes" },
  { name: "Admissions", arabic: "القبول", href: "/admissions" },
  { name: "Faculty", arabic: "المعلمون", href: "/faculty" },
  { name: "Library", arabic: "المكتبة", href: "/resources" },
  { name: "Events", arabic: "الفعاليات", href: "/events" },
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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close drawer when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Slim notice */}
        <div
          className="w-full flex items-center justify-center gap-x-1.5 px-3"
          style={{
            height: "28px",
            background: "hsl(0, 0%, 7%)",
            borderBottom: "1px solid hsl(38, 40%, 18%)",
          }}
        >
          <span
            className="hidden sm:inline text-[10px] sm:text-[11px] tracking-wide"
            style={{ color: "hsl(40, 15%, 62%)", fontWeight: 500 }}
          >
            Limited edition prototype
          </span>
          <span
            className="sm:hidden text-[10px] tracking-wide"
            style={{ color: "hsl(40, 15%, 62%)", fontWeight: 500 }}
          >
            Prototype
          </span>
          <span
            className="text-[10px] sm:text-[11px]"
            style={{ color: "hsl(0, 0%, 28%)" }}
            aria-hidden
          >
            ·
          </span>
          <a
            href="https://fancydigitals.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-[11px] font-semibold tracking-wide transition-opacity hover:opacity-80"
            style={{ color: "hsl(38, 55%, 58%)" }}
          >
            FancyDigitals
          </a>
        </div>

        {/* Main bar */}
        <div
          style={{
            background: scrolled
              ? "rgba(250, 245, 235, 0.97)"
              : "hsl(40, 40%, 97%)",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
            borderBottom: scrolled
              ? "1px solid hsl(35, 20%, 84%)"
              : "1px solid hsl(35, 25%, 90%)",
            boxShadow: scrolled ? "0 1px 10px rgba(0,0,0,0.04)" : "none",
            transition: "box-shadow 0.25s ease, border-color 0.25s ease",
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
            <div className="flex items-center justify-between gap-2 lg:gap-3 h-[68px] sm:h-[72px] min-w-0">
              {/* Brand */}
              <Link
                href="/"
                className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0 max-w-[42%] lg:max-w-[34%]"
              >
                <img
                  src="/logo.png"
                  alt={SCHOOL_NAME}
                  className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 object-contain"
                />
                <div className="hidden sm:flex flex-col min-w-0 overflow-hidden leading-none">
                  <span
                    className="block truncate"
                    style={{
                      color: "hsl(0, 0%, 8%)",
                      fontWeight: 800,
                      fontSize: "clamp(0.58rem, 0.85vw, 0.72rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                    }}
                    title={SCHOOL_NAME}
                  >
                    {SCHOOL_NAME}
                  </span>
                  <span
                    className="arabic-text block truncate mt-0.5"
                    dir="rtl"
                    style={{
                      color: "hsl(35, 65%, 32%)",
                      fontSize: "clamp(0.55rem, 0.8vw, 0.65rem)",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                    title={SCHOOL_NAME_ARABIC}
                  >
                    {SCHOOL_NAME_ARABIC}
                  </span>
                </div>
              </Link>

              {/* Desktop nav — shows from lg (1024px), NOT only xl */}
              <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0 gap-0.5 px-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="relative px-1.5 xl:px-2.5 py-2 rounded-md transition-colors whitespace-nowrap"
                      style={{
                        color: active ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 28%)",
                        fontWeight: active ? 700 : 500,
                        fontSize: "0.75rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {link.name}
                      <span
                        className="absolute left-1.5 right-1.5 xl:left-2.5 xl:right-2.5 bottom-1 h-[2px] rounded-full transition-opacity"
                        style={{
                          background: "hsl(38, 60%, 45%)",
                          opacity: active ? 1 : 0,
                        }}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop CTAs — lg and up */}
              <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
                <Link
                  href="/admissions"
                  className="text-[0.75rem] xl:text-[0.8125rem] px-2.5 xl:px-3.5 py-2 rounded-md whitespace-nowrap transition-colors"
                  style={{
                    color: "hsl(0, 0%, 8%)",
                    border: "1.5px solid hsl(0, 0%, 12%)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Apply Now
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[0.75rem] xl:text-[0.8125rem] px-2.5 xl:px-3.5 py-2 rounded-md text-white whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{
                    background: "hsl(0, 0%, 8%)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Student Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Hamburger — ONLY below lg */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-md shrink-0 -mr-1"
                style={{ color: "hsl(0, 0%, 8%)" }}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay — mobile/tablet only */}
      <div
        className="lg:hidden fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      {/* Drawer — mobile/tablet only */}
      <aside
        className="lg:hidden fixed top-0 right-0 bottom-0 z-[70] flex flex-col transition-transform duration-300 ease-out"
        style={{
          width: "min(88vw, 340px)",
          maxWidth: "100vw",
          background: "hsl(40, 40%, 98%)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: mobileOpen ? "-12px 0 40px rgba(0,0,0,0.12)" : "none",
        }}
        aria-hidden={!mobileOpen}
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-4"
          style={{ borderBottom: "1px solid hsl(35, 20%, 88%)" }}
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 min-w-0 flex-1"
          >
            <img
              src="/logo.png"
              alt=""
              className="w-9 h-9 shrink-0 object-contain"
            />
            <div className="min-w-0 overflow-hidden">
              <span
                className="block truncate text-[0.65rem] font-extrabold leading-tight"
                style={{ color: "hsl(0, 0%, 8%)", letterSpacing: "-0.02em" }}
              >
                {SCHOOL_NAME}
              </span>
              <span
                className="arabic-text block truncate text-[0.6rem] font-bold mt-0.5 leading-tight"
                dir="rtl"
                style={{ color: "hsl(35, 65%, 32%)" }}
              >
                {SCHOOL_NAME_ARABIC}
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md shrink-0"
            style={{ color: "hsl(0, 0%, 25%)" }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div
          className="px-4 py-2 text-center"
          style={{
            background: "hsl(38, 40%, 95%)",
            borderBottom: "1px solid hsl(35, 25%, 90%)",
          }}
        >
          <a
            href="https://fancydigitals.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-medium"
            style={{ color: "hsl(35, 40%, 40%)" }}
          >
            Prototype by{" "}
            <span style={{ color: "hsl(38, 55%, 38%)", fontWeight: 700 }}>
              FancyDigitals
            </span>
          </a>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between gap-3 px-3 py-3 rounded-lg mb-0.5"
                style={{
                  background: active ? "hsl(38, 45%, 94%)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: active
                        ? "hsl(38, 60%, 45%)"
                        : "transparent",
                    }}
                  />
                  <span
                    className="truncate text-[0.9375rem]"
                    style={{
                      color: active ? "hsl(0, 0%, 8%)" : "hsl(0, 0%, 28%)",
                      fontWeight: active ? 700 : 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {link.name}
                  </span>
                </div>
                <span
                  className="arabic-text shrink-0 text-sm"
                  dir="rtl"
                  style={{
                    color: active ? "hsl(35, 65%, 32%)" : "hsl(0, 0%, 55%)",
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
            borderTop: "1px solid hsl(35, 20%, 88%)",
            background: "hsl(38, 42%, 96%)",
          }}
        >
          <Link
            href="/admissions"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center px-4 py-3 rounded-md text-sm font-semibold"
            style={{
              color: "hsl(0, 0%, 8%)",
              border: "1.5px solid hsl(0, 0%, 10%)",
            }}
          >
            Apply for Admission
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-semibold text-white"
            style={{ background: "hsl(0, 0%, 8%)" }}
          >
            Student Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}