import { NextRequest, NextResponse } from "next/server";

// Simple English to Arabic name transliteration map
function transliterateToArabic(name: string): string {
  const map: Record<string, string> = {
    "abdullah": "عبد الله",
    "abdullahi": "عبد الله",
    "abdul": "عبد",
    "abdulrahman": "عبد الرحمن",
    "abdulkarim": "عبد الكريم",
    "abdulmalik": "عبد الملك",
    "abdulaziz": "عبد العزيز",
    "abdulsalam": "عبد السلام",
    "abdulwahab": "عبد الوهاب",
    "abdulhakeem": "عبد الحكيم",
    "abdulbaasit": "عبد الباسط",
    "abdulqadir": "عبد القادر",
    "abdulhamid": "عبد الحميد",
    "abduljalil": "عبد الجليل",
    "abdullateef": "عبد اللطيف",
    "abdulfattah": "عبد الفتاح",
    "abdulrasheed": "عبد الرشيد",
    "abdulrashid": "عبد الرشيد",
    "abdulwahid": "عبد الواحد",
    "abdulbasit": "عبد الباسط",
    "abdulmumin": "عبد المؤمن",
    "abdulhadi": "عبد الهادي",
    "abdulsamad": "عبد الصمد",
    "abdulkareem": "عبد الكريم",
    "abdulganiy": "عبد الغني",
    "abdulganiyu": "عبد الغني",
    "ibrahim": "إبراهيم",
    "ibraheem": "إبراهيم",
    "muhammad": "محمد",
    "mohammed": "محمد",
    "mohamed": "محمد",
    "muhamad": "محمد",
    "ahmad": "أحمد",
    "ahmed": "أحمد",
    "ali": "علي",
    "omar": "عمر",
    "umar": "عمر",
    "uthman": "عثمان",
    "osman": "عثمان",
    "usman": "عثمان",
    "othman": "عثمان",
    "hassan": "حسن",
    "hasan": "حسن",
    "hussein": "حسين",
    "husain": "حسين",
    "hussain": "حسين",
    "husayn": "حسين",
    "yusuf": "يوسف",
    "yusuff": "يوسف",
    "yousuf": "يوسف",
    "yunus": "يونس",
    "ismail": "إسماعيل",
    "ismaeel": "إسماعيل",
    "ismael": "إسماعيل",
    "ishaq": "إسحاق",
    "ishak": "إسحاق",
    "idris": "إدريس",
    "idrees": "إدريس",
    "isa": "عيسى",
    "eisa": "عيسى",
    "musa": "موسى",
    "moosa": "موسى",
    "dawud": "داود",
    "dawood": "داود",
    "daud": "داود",
    "sulaiman": "سليمان",
    "suleiman": "سليمان",
    "sulayman": "سليمان",
    "solomon": "سليمان",
    "yakub": "يعقوب",
    "yaqub": "يعقوب",
    "yaqoob": "يعقوب",
    "abubakar": "أبو بكر",
    "abubakarl": "أبو بكر",
    "abubakarr": "أبو بكر",
    "bakr": "بكر",
    "bilal": "بلال",
    "bilaal": "بلال",
    "hamza": "حمزة",
    "hamzah": "حمزة",
    "khalid": "خالد",
    "khaalid": "خالد",
    "khaleed": "خالد",
    "khaleel": "خليل",
    "khalil": "خليل",
    "salim": "سالم",
    "saleem": "سليم",
    "salman": "سلمان",
    "saeed": "سعيد",
    "said": "سعيد",
    "sayeed": "سعيد",
    "sadiq": "صادق",
    "sadeeq": "صادق",
    "siddiq": "صديق",
    "siddique": "صديق",
    "tariq": "طارق",
    "tarek": "طارق",
    "tareq": "طارق",
    "zaid": "زيد",
    "zayd": "زيد",
    "zubayr": "زبير",
    "zubair": "زبير",
    "anas": "أنس",
    "amr": "عمرو",
    "aminu": "أمين",
    "amin": "أمين",
    "ameen": "أمين",
    "amir": "أمير",
    "ameer": "أمير",
    "ashraf": "أشرف",
    "ayub": "أيوب",
    "ayyub": "أيوب",
    "bashir": "بشير",
    "basheer": "بشير",
    "bashar": "بشار",
    "faruq": "فاروق",
    "faruk": "فاروق",
    "farooq": "فاروق",
    "faisal": "فيصل",
    "faysal": "فيصل",
    "fatima": "فاطمة",
    "fatimah": "فاطمة",
    "faatima": "فاطمة",
    "aisha": "عائشة",
    "ayesha": "عائشة",
    "aishat": "عائشة",
    "khadija": "خديجة",
    "khadijah": "خديجة",
    "khadijat": "خديجة",
    "maryam": "مريم",
    "mariam": "مريم",
    "maryama": "مريم",
    "zainab": "زينب",
    "zaynab": "زينب",
    "zaineb": "زينب",
    "hafsa": "حفصة",
    "hafsah": "حفصة",
    "hafsat": "حفصة",
    "ruqayya": "رقية",
    "ruqayyah": "رقية",
    "safiyya": "صفية",
    "safiyyah": "صفية",
    "sumayya": "سمية",
    "sumayyah": "سمية",
    "aminah": "آمنة",
    "amina": "آمنة",
    "aminat": "آمنة",
    "halima": "حليمة",
    "halimah": "حليمة",
    "halimat": "حليمة",
    "jamil": "جميل",
    "jameel": "جميل",
    "kamal": "كمال",
    "kamaal": "كمال",
    "jamal": "جمال",
    "jamaal": "جمال",
    "haruna": "هارون",
    "harun": "هارون",
    "haroon": "هارون",
    "imran": "عمران",
    "imraan": "عمران",
    "luqman": "لقمان",
    "lukman": "لقمان",
    "mustapha": "مصطفى",
    "mustafa": "مصطفى",
    "nasir": "ناصر",
    "nasser": "ناصر",
    "nasr": "نصر",
    "nuhu": "نوح",
    "nuh": "نوح",
    "nooh": "نوح",
    "rabi": "ربيع",
    "rabiu": "ربيع",
    "rashid": "رشيد",
    "rasheed": "رشيد",
    "ridwan": "رضوان",
    "ridwaan": "رضوان",
    "saheed": "شهيد",
    "shaheed": "شهيد",
    "sharif": "شريف",
    "shareef": "شريف",
    "shukri": "شكري",
    "tijani": "تجاني",
    "tijjani": "تجاني",
    "wahab": "وهاب",
    "waheed": "وحيد",
    "wahid": "وحيد",
    "yahya": "يحيى",
    "yahaya": "يحيى",
    "zakariya": "زكريا",
    "zakariyya": "زكريا",
    "zakari": "زكريا",
    "abdur": "عبد",
    "nur": "نور",
    "noor": "نور",
    "nurudeen": "نور الدين",
    "nuruddeen": "نور الدين",
    "nooredin": "نور الدين",
    "lateef": "لطيف",
    "latif": "لطيف",
    "ganiy": "غني",
    "ghani": "غني",
    "kabir": "كبير",
    "kabeer": "كبير",
    "salihu": "صالح",
    "salih": "صالح",
    "saleh": "صالح",
    "sufiyan": "سفيان",
    "sufyan": "سفيان",
    "mu'azu": "معاذ",
    "muaz": "معاذ",
    "muadh": "معاذ",
    "mujahid": "مجاهد",
    "munir": "منير",
    "muneer": "منير",
    "nabeel": "نبيل",
    "nabil": "نبيل",
    "rauf": "رؤوف",
    "ra'uf": "رؤوف",
    "samad": "صمد",
    "shakir": "شاكر",
    "shukur": "شكور",
    "taha": "طه",
    "taofiq": "توفيق",
    "tawfiq": "توفيق",
    "tawfeeq": "توفيق",
    "wadud": "ودود",
    "walid": "وليد",
    "waleed": "وليد",
    "yaqeen": "يقين",
    "yasir": "ياسر",
    "yasser": "ياسر",
    "zaki": "زكي",
    "zakiy": "زكي",
    "zuberu": "زبير",
  };

  const lower = name.toLowerCase().trim();
  return map[lower] || "";
}

function generateArabicFullName(firstName: string, lastName: string): string {
  const arabicFirst = transliterateToArabic(firstName);
  const arabicLast = transliterateToArabic(lastName);

  if (!arabicFirst && !arabicLast) return "";
  if (!arabicFirst) return arabicLast;
  if (!arabicLast) return arabicFirst;

  return `${arabicFirst} ${arabicLast}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, arabicName, email, password, phone, gender, dateOfBirth, profilePhoto } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "First name, last name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const { users, students } = await import("@/lib/db/schema");
    const { hashPassword } = await import("@/lib/auth/password");
    const { createSession, setSessionCookie } = await import("@/lib/auth/session");
    const { eq, sql } = await import("drizzle-orm");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Auto-generate Arabic name
    const generatedArabicName = generateArabicFullName(firstName, lastName, arabicName);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "student",
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        arabicName: generatedArabicName || null,
        phone: phone?.trim() || null,
        profilePhoto: profilePhoto || null,
        isActive: true,
      })
      .returning();

    const currentYear = new Date().getFullYear();

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(sql`${students.studentId} LIKE ${"ZIA-" + currentYear + "-%"}`);

    const nextSequence = Number(countResult[0]?.count || 0) + 1;
    const studentId = `ZIA-${currentYear}-${String(nextSequence).padStart(4, "0")}`;

    await db.insert(students).values({
      userId: newUser.id,
      studentId,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      admissionDate: new Date().toISOString().split("T")[0],
      isActive: true,
    });

    const token = await createSession({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        arabicName: generatedArabicName,
        studentId,
      },
      message: `Account created successfully. Your Student ID is ${studentId}`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}