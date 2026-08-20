import { AdmissionForm } from "./admission-form";

async function getProgrammes() {
  const { db } = await import("@/lib/db");
  const { programmes } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const activeProgrammes = await db.query.programmes.findMany({
    where: eq(programmes.isActive, true),
    orderBy: (p, { asc }) => [asc(p.sortOrder)],
    columns: {
      id: true,
      name: true,
      arabicName: true,
    },
  });

  return activeProgrammes;
}

export const metadata = {
  title: "Admissions | Apply to Zamzam Islamic Academy",
  description: "Apply for admission to Zamzam Islamic Academy's structured Arabic and Islamic programmes.",
};

export default async function AdmissionsPage() {
  const programmes = await getProgrammes();

  return (
    <div style={{ background: "hsl(40, 40%, 97%)", minHeight: "100vh" }}>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/pattern.svg')",
          backgroundSize: "80px 80px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs uppercase mb-3"
            style={{
              color: "hsl(38, 60%, 45%)",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            Admissions
          </p>
          <h1
            className="mb-3"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              color: "hsl(0, 0%, 8%)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            Apply to Zamzam
          </h1>
          <p
            className="arabic-text mb-4"
            style={{
              color: "hsl(35, 65%, 32%)",
              fontSize: "1.2rem",
            }}
          >
            طلب الالتحاق بالأكاديمية
          </p>
          <p
            className="text-sm max-w-lg mx-auto"
            style={{
              color: "hsl(0, 0%, 40%)",
              letterSpacing: "-0.005em",
              lineHeight: 1.6,
            }}
          >
            Complete the form below to apply for admission. Your application will be reviewed by the academic board, and you will be notified of the status.
          </p>
        </div>

        {/* The Form */}
        <AdmissionForm programmes={programmes} />
        
      </div>
    </div>
  );
}