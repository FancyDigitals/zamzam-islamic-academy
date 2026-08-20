import { db } from "./index";
import {
  users,
  programmes,
  academicSessions,
  terms,
  levels,
  gradingScales,
  siteContent,
} from "./schema";
import { hashPassword } from "../auth/password";

async function seed() {
  console.log("🌱 Seeding Zamzam Islamic Academy database...");

  // ============================================================
  // 1. Create Super Admin
  // ============================================================
  console.log("Creating super admin...");
  const adminPassword = await hashPassword("ZamzamAdmin2026!");

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@zamzamacademy.ng",
      passwordHash: adminPassword,
      role: "super_admin",
      firstName: "Academy",
      lastName: "Administrator",
      isActive: true,
    })
    .returning()
    .onConflictDoNothing();

  // ============================================================
  // 2. Create Programmes
  // ============================================================
  console.log("Creating programmes...");
  const [idadiyyah, thanawiyyah] = await db
    .insert(programmes)
    .values([
      {
        name: "Idadiyyah",
        arabicName: "الإعدادية",
        code: "IDADIYYAH",
        description:
          "Foundation and intermediate Islamic and Arabic education. Students develop the core linguistic and religious foundations necessary for advanced Islamic study.",
        durationYears: 3,
        objectives:
          "Develop foundational Arabic language skills, introduce core Islamic sciences, establish academic discipline and religious character.",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Thanawiyyah",
        arabicName: "الثانوية",
        code: "THANAWIYYAH",
        description:
          "Advanced Islamic and Arabic studies. Students engage with classical Islamic texts, advanced Arabic language, and the full spectrum of Islamic sciences.",
        durationYears: 3,
        objectives:
          "Achieve advanced Arabic language proficiency, master core Islamic sciences, engage with classical scholarly texts, develop capacity for independent Islamic study.",
        isActive: true,
        sortOrder: 2,
      },
    ])
    .returning()
    .onConflictDoNothing();

  // ============================================================
  // 3. Create Academic Session
  // ============================================================
  console.log("Creating academic session...");
  const [currentSession] = await db
    .insert(academicSessions)
    .values({
      name: "2026/2027",
      startDate: "2026-09-01",
      endDate: "2027-06-30",
      status: "active",
      isCurrent: true,
    })
    .returning()
    .onConflictDoNothing();

  // ============================================================
  // 4. Create Terms
  // ============================================================
  if (currentSession) {
    console.log("Creating terms...");
    await db
      .insert(terms)
      .values([
        {
          sessionId: currentSession.id,
          name: "First Term",
          termNumber: 1,
          startDate: "2026-09-01",
          endDate: "2026-12-15",
          status: "active",
          isCurrent: true,
        },
        {
          sessionId: currentSession.id,
          name: "Second Term",
          termNumber: 2,
          startDate: "2027-01-10",
          endDate: "2027-03-28",
          status: "upcoming",
          isCurrent: false,
        },
        {
          sessionId: currentSession.id,
          name: "Third Term",
          termNumber: 3,
          startDate: "2027-04-14",
          endDate: "2027-06-30",
          status: "upcoming",
          isCurrent: false,
        },
      ])
      .onConflictDoNothing();
  }

  // ============================================================
  // 5. Create Levels
  // ============================================================
  if (idadiyyah && thanawiyyah) {
    console.log("Creating levels...");
    await db
      .insert(levels)
      .values([
        {
          programmeId: idadiyyah.id,
          name: "Idadiyyah 1",
          arabicName: "الإعدادية الأولى",
          levelNumber: 1,
          description: "First year of the Idadiyyah programme",
          isActive: true,
          sortOrder: 1,
        },
        {
          programmeId: idadiyyah.id,
          name: "Idadiyyah 2",
          arabicName: "الإعدادية الثانية",
          levelNumber: 2,
          description: "Second year of the Idadiyyah programme",
          isActive: true,
          sortOrder: 2,
        },
        {
          programmeId: idadiyyah.id,
          name: "Idadiyyah 3",
          arabicName: "الإعدادية الثالثة",
          levelNumber: 3,
          description: "Third year of the Idadiyyah programme",
          isActive: true,
          sortOrder: 3,
        },
        {
          programmeId: thanawiyyah.id,
          name: "Thanawiyyah 1",
          arabicName: "الثانوية الأولى",
          levelNumber: 1,
          description: "First year of the Thanawiyyah programme",
          isActive: true,
          sortOrder: 4,
        },
        {
          programmeId: thanawiyyah.id,
          name: "Thanawiyyah 2",
          arabicName: "الثانوية الثانية",
          levelNumber: 2,
          description: "Second year of the Thanawiyyah programme",
          isActive: true,
          sortOrder: 5,
        },
        {
          programmeId: thanawiyyah.id,
          name: "Thanawiyyah 3",
          arabicName: "الثانوية الثالثة",
          levelNumber: 3,
          description: "Third year of the Thanawiyyah programme",
          isActive: true,
          sortOrder: 6,
        },
      ])
      .onConflictDoNothing();
  }

  // ============================================================
  // 6. Create Grading Scale
  // ============================================================
  console.log("Creating grading scale...");
  await db
    .insert(gradingScales)
    .values([
      { name: "Distinction", minScore: "75", maxScore: "100", grade: "A", gradePoint: "4.00", remark: "Excellent" },
      { name: "Merit", minScore: "65", maxScore: "74.99", grade: "B", gradePoint: "3.00", remark: "Very Good" },
      { name: "Credit", minScore: "55", maxScore: "64.99", grade: "C", gradePoint: "2.00", remark: "Good" },
      { name: "Pass", minScore: "45", maxScore: "54.99", grade: "D", gradePoint: "1.00", remark: "Pass" },
      { name: "Fail", minScore: "0", maxScore: "44.99", grade: "F", gradePoint: "0.00", remark: "Fail" },
    ])
    .onConflictDoNothing();

  // ============================================================
  // 7. Create Site Content
  // ============================================================
  console.log("Creating site content...");
  await db
    .insert(siteContent)
    .values([
      {
        key: "about_intro",
        title: "About Zamzam Islamic Academy",
        content:
          "Zamzam Islamic Academy is a structured Islamic and Arabic educational institution committed to producing students of authentic knowledge, strong character, and academic discipline. We combine the rigour of traditional Islamic scholarship with the accessibility of modern educational tools.",
        isPublished: true,
      },
      {
        key: "vision",
        title: "Our Vision",
        content:
          "To become one of Nigeria's leading Islamic and Arabic academic institutions — producing graduates who are grounded in their deen, fluent in Arabic, and equipped to contribute meaningfully to their communities and to the advancement of Islamic knowledge.",
        isPublished: true,
      },
      {
        key: "mission",
        title: "Our Mission",
        content:
          "To provide structured, assessable, and digitally accessible Islamic and Arabic education that develops the whole student — intellectually, spiritually, linguistically, and in character — through authentic Islamic scholarship and modern pedagogical excellence.",
        isPublished: true,
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Database seeded successfully!");
  console.log("");
  console.log("🔑 Admin credentials:");
  console.log("   Email: admin@zamzamacademy.ng");
  console.log("   Password: ZamzamAdmin2026!");
  console.log("");
  console.log("⚠️  Change the admin password immediately after first login!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});