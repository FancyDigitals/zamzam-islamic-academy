import { NextResponse } from "next/server";

function transliterateToArabic(name: string): string {
  const map: Record<string, string> = {
    "abdullah": "عبد الله", "abdullahi": "عبد الله", "abdul": "عبد",
    "abdulrahman": "عبد الرحمن", "abdulkarim": "عبد الكريم",
    "abdulmalik": "عبد الملك", "abdulaziz": "عبد العزيز",
    "ibrahim": "إبراهيم", "ibraheem": "إبراهيم",
    "muhammad": "محمد", "mohammed": "محمد", "mohamed": "محمد",
    "ahmad": "أحمد", "ahmed": "أحمد",
    "ali": "علي", "omar": "عمر", "umar": "عمر",
    "uthman": "عثمان", "osman": "عثمان", "usman": "عثمان",
    "hassan": "حسن", "hasan": "حسن",
    "hussein": "حسين", "husain": "حسين", "hussain": "حسين",
    "yusuf": "يوسف", "yusuff": "يوسف", "yousuf": "يوسف",
    "yunus": "يونس",
    "ismail": "إسماعيل", "ismaeel": "إسماعيل", "ismael": "إسماعيل",
    "ishaq": "إسحاق", "idris": "إدريس", "idrees": "إدريس",
    "isa": "عيسى", "musa": "موسى",
    "dawud": "داود", "dawood": "داود",
    "sulaiman": "سليمان", "suleiman": "سليمان",
    "abubakar": "أبو بكر", "bilal": "بلال",
    "hamza": "حمزة", "khalid": "خالد",
    "khalil": "خليل", "salim": "سالم", "saleem": "سليم",
    "salman": "سلمان", "saeed": "سعيد", "said": "سعيد",
    "sadiq": "صادق", "siddiq": "صديق",
    "tariq": "طارق", "zaid": "زيد",
    "anas": "أنس", "aminu": "أمين", "amin": "أمين",
    "ashraf": "أشرف", "ayub": "أيوب",
    "bashir": "بشير", "basheer": "بشير",
    "faruq": "فاروق", "faruk": "فاروق",
    "faisal": "فيصل",
    "fatima": "فاطمة", "fatimah": "فاطمة",
    "aisha": "عائشة", "ayesha": "عائشة", "aishat": "عائشة",
    "khadija": "خديجة", "khadijah": "خديجة",
    "maryam": "مريم", "mariam": "مريم",
    "zainab": "زينب", "zaynab": "زينب",
    "hafsa": "حفصة", "aminah": "آمنة", "amina": "آمنة",
    "halima": "حليمة",
    "jamil": "جميل", "kamal": "كمال", "jamal": "جمال",
    "haruna": "هارون", "harun": "هارون",
    "imran": "عمران", "luqman": "لقمان",
    "mustapha": "مصطفى", "mustafa": "مصطفى",
    "nasir": "ناصر", "nuh": "نوح", "nuhu": "نوح",
    "rashid": "رشيد", "ridwan": "رضوان",
    "sharif": "شريف", "tijani": "تجاني",
    "yahya": "يحيى", "yahaya": "يحيى",
    "zakariya": "زكريا",
    "nur": "نور", "noor": "نور",
    "salihu": "صالح", "salih": "صالح", "saleh": "صالح",
    "taha": "طه", "walid": "وليد",
    "yasir": "ياسر", "yasser": "ياسر",
    "kabir": "كبير", "lateef": "لطيف", "latif": "لطيف",
    "wahab": "وهاب", "wahid": "وحيد",
    "munir": "منير", "nabeel": "نبيل",
    "tawfiq": "توفيق", "taofiq": "توفيق",
    "rabiu": "ربيع", "rabi": "ربيع",
    "test": "اختبار",
  };

  const lower = name.toLowerCase().trim();
  return map[lower] || "";
}

export async function GET() {
  try {
    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { eq, isNull, or } = await import("drizzle-orm");

    // Get all users
    const allUsers = await db.query.users.findMany();

    let updated = 0;

    for (const user of allUsers) {
      const arabicFirst = transliterateToArabic(user.firstName);
      const arabicLast = transliterateToArabic(user.lastName);

      let newArabicName = "";
      if (arabicFirst && arabicLast) {
        newArabicName = `${arabicFirst} ${arabicLast}`;
      } else if (arabicFirst) {
        newArabicName = arabicFirst;
      } else if (arabicLast) {
        newArabicName = arabicLast;
      }

      // Only update if we have a proper Arabic name AND current is missing or is in English
      if (newArabicName) {
        const currentArabic = user.arabicName || "";
        // Check if current arabic name contains latin characters (means it's not really Arabic)
        const hasLatin = /[a-zA-Z]/.test(currentArabic);

        if (!currentArabic || hasLatin) {
          await db
            .update(users)
            .set({ arabicName: newArabicName })
            .where(eq(users.id, user.id));
          updated++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} users with Arabic names.`,
      total: allUsers.length,
    });
  } catch (error) {
    console.error("Fix arabic error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}