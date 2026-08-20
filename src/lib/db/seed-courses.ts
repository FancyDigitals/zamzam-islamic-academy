import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { programmes, courses } from "./schema";
import { eq, inArray } from "drizzle-orm";

async function seedCourses() {
  console.log("🌱 Seeding Islamic/Arabic courses...");

  // Get programme IDs in one query
  const allProgrammes = await db
    .select({ id: programmes.id, code: programmes.code })
    .from(programmes);

  const idadiyyah = allProgrammes.find((p) => p.code === "IDADIYYAH");
  const thanawiyyah = allProgrammes.find((p) => p.code === "THANAWIYYAH");

  if (!idadiyyah || !thanawiyyah) {
    console.error("❌ Programmes not found. Run npm run db:seed first.");
    process.exit(1);
  }

  console.log(`Found Idadiyyah: ${idadiyyah.id}`);
  console.log(`Found Thanawiyyah: ${thanawiyyah.id}`);

  const courseData = [
    {
      name: "Arabic Grammar",
      arabicName: "النحو",
      code: "ARB-101",
      description: "Foundations of Arabic grammatical structure, sentence construction, and syntactic analysis.",
      arabicDescription: "أسس النحو العربي وتركيب الجمل والتحليل النحوي.",
      programmeId: idadiyyah.id,
      creditUnits: 3,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Arabic Morphology",
      arabicName: "الصرف",
      code: "ARB-102",
      description: "Study of Arabic word formation, root patterns, verb conjugation, and morphological analysis.",
      arabicDescription: "دراسة اشتقاق الكلمات العربية وأوزانها وتصريف الأفعال.",
      programmeId: idadiyyah.id,
      creditUnits: 3,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Arabic Literature",
      arabicName: "الأدب",
      code: "ARB-103",
      description: "Classical and contemporary Arabic literary texts, poetry, prose, and rhetorical devices.",
      arabicDescription: "النصوص الأدبية العربية الكلاسيكية والمعاصرة والشعر والنثر.",
      programmeId: idadiyyah.id,
      creditUnits: 2,
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Arabic Composition",
      arabicName: "الإنشاء",
      code: "ARB-104",
      description: "Practical Arabic writing skills — essays, letters, summaries, and structured composition.",
      arabicDescription: "مهارات الكتابة العربية العملية من مقالات ورسائل وملخصات.",
      programmeId: idadiyyah.id,
      creditUnits: 2,
      sortOrder: 4,
      isActive: true,
    },
    {
      name: "Qur'an Recitation",
      arabicName: "التلاوة",
      code: "QUR-101",
      description: "Proper Qur'anic recitation with Tajweed rules, pronunciation, and melodic recitation.",
      arabicDescription: "تلاوة القرآن الكريم بأحكام التجويد والنطق السليم.",
      programmeId: idadiyyah.id,
      creditUnits: 2,
      sortOrder: 5,
      isActive: true,
    },
    {
      name: "Qur'an Memorization",
      arabicName: "الحفظ",
      code: "QUR-102",
      description: "Systematic memorization of selected Surahs and Juz' of the Holy Qur'an with retention review.",
      arabicDescription: "الحفظ المنهجي لسور وأجزاء من القرآن الكريم مع المراجعة.",
      programmeId: idadiyyah.id,
      creditUnits: 3,
      sortOrder: 6,
      isActive: true,
    },
    {
      name: "Tafsir",
      arabicName: "التفسير",
      code: "ISL-101",
      description: "Exegesis of the Holy Qur'an — understanding meanings, contexts, and scholarly interpretation.",
      arabicDescription: "تفسير القرآن الكريم وفهم معانيه وأسباب نزوله.",
      programmeId: idadiyyah.id,
      creditUnits: 3,
      sortOrder: 7,
      isActive: true,
    },
    {
      name: "Hadith",
      arabicName: "الحديث",
      code: "ISL-102",
      description: "Study of Prophetic traditions — text, chain of narration, classification, and application.",
      arabicDescription: "دراسة الحديث النبوي متناً وسنداً وتصنيفاً وتطبيقاً.",
      programmeId: idadiyyah.id,
      creditUnits: 3,
      sortOrder: 8,
      isActive: true,
    },
    {
      name: "Fiqh",
      arabicName: "الفقه",
      code: "ISL-103",
      description: "Islamic jurisprudence covering worship, transactions, and personal conduct according to the Maliki school.",
      arabicDescription: "الفقه الإسلامي في العبادات والمعاملات وفق المذهب المالكي.",
      programmeId: idadiyyah.id,
      creditUnits: 3,
      sortOrder: 9,
      isActive: true,
    },
    {
      name: "Aqeedah",
      arabicName: "العقيدة",
      code: "ISL-104",
      description: "Islamic creed and theology — the fundamentals of belief, divine attributes, and articles of faith.",
      arabicDescription: "العقيدة الإسلامية وأصول الإيمان وصفات الله تعالى.",
      programmeId: idadiyyah.id,
      creditUnits: 2,
      sortOrder: 10,
      isActive: true,
    },
    {
      name: "Sirah",
      arabicName: "السيرة",
      code: "ISL-105",
      description: "Biography of the Prophet Muhammad ﷺ — his life, character, missions, and lasting legacy.",
      arabicDescription: "سيرة النبي محمد ﷺ حياته وشخصيته ورسالته وإرثه.",
      programmeId: idadiyyah.id,
      creditUnits: 2,
      sortOrder: 11,
      isActive: true,
    },
    {
      name: "Islamic History",
      arabicName: "التاريخ الإسلامي",
      code: "ISL-106",
      description: "Survey of Islamic civilisation from the early caliphates through the classical period to the modern era.",
      arabicDescription: "تاريخ الحضارة الإسلامية من الخلافة الراشدة حتى العصر الحديث.",
      programmeId: thanawiyyah.id,
      creditUnits: 2,
      sortOrder: 12,
      isActive: true,
    },
  ];

  // Check which codes already exist — ONE query
  const codes = courseData.map((c) => c.code);
  const existing = await db
    .select({ code: courses.code })
    .from(courses)
    .where(inArray(courses.code, codes));

  const existingCodes = new Set(existing.map((e) => e.code));

  const toInsert = courseData.filter((c) => {
    if (existingCodes.has(c.code)) {
      console.log(`  ⏭  Skipping ${c.code} — already exists`);
      return false;
    }
    return true;
  });

  if (toInsert.length === 0) {
    console.log("");
    console.log("✅ All courses already exist. Nothing to insert.");
    return;
  }

  // Insert ALL remaining courses in ONE query
  const inserted = await db.insert(courses).values(toInsert).returning({
    code: courses.code,
    name: courses.name,
    arabicName: courses.arabicName,
  });

  for (const c of inserted) {
    console.log(`  ✅ Created: ${c.code} — ${c.name} (${c.arabicName})`);
  }

  console.log("");
  console.log(`✅ Done! Created: ${inserted.length}, Skipped: ${existingCodes.size}`);
}

seedCourses().catch((error) => {
  console.error("❌ Course seeding failed:", error);
  process.exit(1);
});