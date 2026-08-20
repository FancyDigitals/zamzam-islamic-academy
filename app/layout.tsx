import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "Zamzam Islamic Academy",
    template: "%s | Zamzam Islamic Academy",
  },
  description:
    "A modern Islamic and Arabic education platform rooted in authentic knowledge. Providing structured Idadiyyah and Thanawiyyah programmes for students in Nigeria.",
  keywords: [
    "Islamic school Nigeria",
    "Arabic school Nigeria",
    "Idadiyyah",
    "Thanawiyyah",
    "Islamic education",
    "Arabic language",
    "Zamzam Islamic Academy",
  ],
  authors: [{ name: "Zamzam Islamic Academy" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Zamzam Islamic Academy",
    title: "Zamzam Islamic Academy",
    description:
      "A modern Islamic and Arabic education platform rooted in authentic knowledge.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf5eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={poppins.variable}
    >
      <body className={`${poppins.className} antialiased`}>
        <PublicNavbar />
        <main className="min-h-screen" style={{ paddingTop: "80px" }}>
          {children}
        </main>
        <PublicFooter />
      </body>
    </html>
  );
}