import { BookOpen, Star, Shield, Heart, Lightbulb, Users, Award, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "64px" }}>

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, hsl(162,72%,8%) 0%, hsl(162,60%,15%) 100%)",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <p
          className="arabic-text"
          style={{ color: "hsl(162,50%,65%)", fontSize: "22px", marginBottom: "8px" }}
        >
          عن الأكاديمية
        </p>
        <h1 style={{ color: "white", fontSize: "44px", fontWeight: "700", marginBottom: "16px" }}>
          About Zamzam Islamic Academy
        </h1>
        <p style={{ color: "hsl(162,35%,65%)", fontSize: "18px", maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
          A modern Islamic and Arabic educational institution committed to producing students of authentic knowledge, strong character, and academic discipline.
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Introduction */}
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
            Who We Are
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.9, fontSize: "16px", marginBottom: "16px" }}>
            Zamzam Islamic Academy is a structured Islamic and Arabic educational institution based in Nigeria. We are dedicated to providing quality Islamic education that combines the rigour of traditional Islamic scholarship with the accessibility and sophistication of modern educational tools.
          </p>
          <p style={{ color: "#475569", lineHeight: 1.9, fontSize: "16px", marginBottom: "16px" }}>
            Our academy offers two core academic programmes — <strong>Idadiyyah</strong> (Foundation/Intermediate) and <strong>Thanawiyyah</strong> (Advanced) — designed to take students on a comprehensive journey through Islamic sciences and Arabic language mastery.
          </p>
          <p style={{ color: "#475569", lineHeight: 1.9, fontSize: "16px" }}>
            We believe that authentic Islamic knowledge must be taught with academic discipline, assessed with fairness, and delivered through platforms that match the expectations of today's learners — without compromising the integrity and depth of the knowledge itself.
          </p>
        </div>

        {/* Vision & Mission */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, hsl(162,72%,10%) 0%, hsl(162,60%,18%) 100%)",
              borderRadius: "16px",
              padding: "40px",
              color: "white",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Target style={{ width: "24px", height: "24px" }} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>Our Vision</h3>
            <p style={{ color: "hsl(162,35%,75%)", lineHeight: 1.8, fontSize: "15px" }}>
              To become one of Nigeria's leading Islamic and Arabic academic institutions — producing graduates who are grounded in their deen, fluent in Arabic, and equipped to contribute meaningfully to their communities and to the advancement of Islamic knowledge.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, hsl(162,72%,10%) 0%, hsl(162,60%,18%) 100%)",
              borderRadius: "16px",
              padding: "40px",
              color: "white",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Award style={{ width: "24px", height: "24px" }} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>Our Mission</h3>
            <p style={{ color: "hsl(162,35%,75%)", lineHeight: 1.8, fontSize: "15px" }}>
              To provide structured, assessable, and digitally accessible Islamic and Arabic education that develops the whole student — intellectually, spiritually, linguistically, and in character — through authentic Islamic scholarship and modern pedagogical excellence.
            </p>
          </div>
        </div>

        {/* Educational Philosophy */}
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
            Educational Philosophy
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.9, fontSize: "16px", marginBottom: "20px" }}>
            At Zamzam Islamic Academy, we believe that Islamic education should be both deeply rooted in tradition and practically accessible through modern tools. Our approach combines:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { title: "Islamic Sciences", desc: "Comprehensive study of Qur'an, Hadith, Fiqh, Aqeedah, Tafsir, and Sirah through structured curricula." },
              { title: "Arabic Language", desc: "Rigorous Arabic grammar, morphology, literature, and composition to build true linguistic competency." },
              { title: "Structured Assessment", desc: "Continuous assessments, examinations, and grading systems that track genuine academic progress." },
              { title: "Character Building", desc: "Emphasis on adab, discipline, spiritual growth, and the practical application of knowledge in daily life." },
              { title: "Digital Platform", desc: "A modern student portal for accessing courses, results, resources, and academic records." },
              { title: "Academic Progression", desc: "Clear academic levels from Idadiyyah through Thanawiyyah with defined learning objectives at each stage." },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <h4 style={{ fontSize: "15px", fontWeight: "600", color: "hsl(162,55%,25%)", marginBottom: "6px" }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "40px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "24px" }}>
            Our Values
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {[
              { icon: BookOpen, title: "Authentic Knowledge", arabic: "العلم الشرعي", desc: "Rooted in the Qur'an, Sunnah, and the scholarly tradition." },
              { icon: Star, title: "Arabic Excellence", arabic: "التميز العربي", desc: "Arabic as the language of the Qur'an and Islamic scholarship." },
              { icon: Shield, title: "Academic Discipline", arabic: "الانضباط", desc: "Structured learning, regular assessment, and accountability." },
              { icon: Heart, title: "Character", arabic: "الأخلاق", desc: "Developing students of excellent conduct and strong values." },
              { icon: Lightbulb, title: "Spiritual Growth", arabic: "التزكية", desc: "Connecting knowledge to worship, practice, and devotion." },
              { icon: Users, title: "Community", arabic: "المجتمع", desc: "A supportive community united in the pursuit of knowledge." },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} style={{ textAlign: "center", padding: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "hsl(162,40%,94%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Icon style={{ width: "24px", height: "24px", color: "hsl(162,55%,25%)" }} />
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                    {value.title}
                  </h4>
                  <p className="arabic-text" style={{ color: "hsl(162,55%,30%)", fontSize: "14px", marginBottom: "6px" }}>
                    {value.arabic}
                  </p>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}