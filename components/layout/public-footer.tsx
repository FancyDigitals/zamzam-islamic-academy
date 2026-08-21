"use client";

import Link from "next/link";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "hsl(0, 0%, 6%)", color: "hsl(40, 20%, 75%)" }}>
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(38, 60%, 45%, 0.6) 50%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 pb-10" style={{ borderBottom: "1px solid hsl(0, 0%, 14%)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-5">
                <img
                  src="/logo.png"
                  alt="Zamzam College of Islamic and Arabic Studies"
                  style={{
                    width: "72px",
                    height: "72px",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
                <div>
                  <h2
                    style={{
                      color: "hsl(40, 40%, 97%)",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    Zamzam College of Islamic and Arabic Studies
                  </h2>
                  <p
                    className="arabic-text mt-1"
                    style={{
                      color: "hsl(38, 60%, 55%)",
                      fontSize: "1rem",
                    }}
                  >
                    أكاديمية زمزم الإسلامية
                  </p>
                  <p
                    className="mt-2"
                    style={{
                      color: "hsl(38, 60%, 45%)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Est. Nigeria · Islamic Education
                  </p>
                </div>
              </div>
              <p
                className="max-w-lg text-sm"
                style={{
                  color: "hsl(40, 20%, 68%)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.65,
                }}
              >
                Authentic Islamic education, structured Arabic learning, and academic excellence — delivered through a modern digital platform. Producing students of knowledge, character, and discipline.
              </p>
            </div>

            <div
              className="rounded-lg p-6"
              style={{
                background: "hsl(0, 0%, 10%)",
                border: "1px solid hsl(0, 0%, 15%)",
              }}
            >
              <p
                className="text-xs uppercase mb-2"
                style={{
                  color: "hsl(38, 60%, 55%)",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                }}
              >
                Join the Academy
              </p>
              <h3
                style={{
                  color: "hsl(40, 40%, 97%)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  marginBottom: "10px",
                }}
              >
                Applications open for the current session.
              </h3>
              <p
                className="text-xs mb-4"
                style={{
                  color: "hsl(40, 20%, 60%)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.5,
                }}
              >
                Begin your journey in Islamic and Arabic scholarship.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/admissions"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm transition-colors"
                  style={{
                    background: "hsl(38, 60%, 45%)",
                    color: "hsl(0, 0%, 8%)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Apply for Admission
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm transition-colors"
                  style={{
                    color: "hsl(40, 40%, 97%)",
                    border: "1px solid hsl(0, 0%, 22%)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Student Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 mb-12">
          <div>
            <h4
              className="text-xs uppercase mb-4"
              style={{
                color: "hsl(38, 60%, 55%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Programmes
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Idadiyyah", href: "/programmes" },
                { name: "Thanawiyyah", href: "/programmes" },
                { name: "Arabic Studies", href: "/programmes" },
                { name: "Islamic Studies", href: "/programmes" },
                { name: "Admissions", href: "/admissions" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "hsl(40, 20%, 68%)",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "hsl(38, 60%, 55%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "hsl(40, 20%, 68%)";
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs uppercase mb-4"
              style={{
                color: "hsl(38, 60%, 55%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Academy
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "About Us", href: "/about" },
                { name: "Faculty", href: "/faculty" },
                { name: "Digital Library", href: "/resources" },
                { name: "Events", href: "/events" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "hsl(40, 20%, 68%)",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "hsl(38, 60%, 55%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "hsl(40, 20%, 68%)";
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs uppercase mb-4"
              style={{
                color: "hsl(38, 60%, 55%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Student
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Student Portal", href: "/login" },
                { name: "New Registration", href: "/signup" },
                { name: "Apply Now", href: "/admissions" },
                { name: "Contact Support", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{
                      color: "hsl(40, 20%, 68%)",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "hsl(38, 60%, 55%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "hsl(40, 20%, 68%)";
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-xs uppercase mb-4"
              style={{
                color: "hsl(38, 60%, 55%)",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "hsl(38, 60%, 55%)" }}
                />
                <span
                  className="text-sm"
                  style={{
                    color: "hsl(40, 20%, 68%)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.5,
                  }}
                >
                  Nigeria
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "hsl(38, 60%, 55%)" }}
                />
                <a
                  href="mailto:info@zamzamacademy.ng"
                  className="text-sm transition-colors break-all"
                  style={{
                    color: "hsl(40, 20%, 68%)",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "hsl(38, 60%, 55%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "hsl(40, 20%, 68%)";
                  }}
                >
                  info@zamzamacademy.ng
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: "hsl(38, 60%, 55%)" }}
                />
                <span
                  className="text-sm"
                  style={{
                    color: "hsl(40, 20%, 68%)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Coming soon
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="text-center py-8 px-6 mb-10 rounded-lg"
          style={{
            background: "hsl(0, 0%, 9%)",
            border: "1px solid hsl(0, 0%, 14%)",
          }}
        >
          <p
            className="arabic-text mb-3"
            style={{
              color: "hsl(38, 60%, 60%)",
              fontSize: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
          </p>
          <p
            className="text-sm italic"
            style={{
              color: "hsl(40, 20%, 72%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.5,
            }}
          >
            "Seeking knowledge is an obligation upon every Muslim."
          </p>
          <p
            className="text-xs mt-1"
            style={{
              color: "hsl(40, 20%, 55%)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            — Prophet Muhammad ﷺ
          </p>
        </div>

        <div
          className="h-px mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(0, 0%, 20%) 50%, transparent 100%)",
          }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-center md:text-left"
            style={{
              color: "hsl(40, 20%, 55%)",
              letterSpacing: "-0.005em",
            }}
          >
            © {year} Zamzam College of Islamic and Arabic Studies. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs transition-colors"
              style={{
                color: "hsl(40, 20%, 55%)",
                letterSpacing: "-0.005em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "hsl(38, 60%, 55%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "hsl(40, 20%, 55%)";
              }}
            >
              Privacy Policy
            </Link>
            <span style={{ color: "hsl(0, 0%, 20%)" }}>·</span>
            <Link
              href="/terms"
              className="text-xs transition-colors"
              style={{
                color: "hsl(40, 20%, 55%)",
                letterSpacing: "-0.005em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "hsl(38, 60%, 55%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "hsl(40, 20%, 55%)";
              }}
            >
              Terms of Use
            </Link>
          </div>

          <p
            className="text-xs"
            style={{
              color: "hsl(38, 55%, 50%)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Built with care · بإحسان
          </p>
        </div>
      </div>
    </footer>
  );
}