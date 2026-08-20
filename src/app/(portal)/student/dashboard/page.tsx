import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { students, users, academicSessions, programmes, levels, classes, results, courses, courseAssignments, announcements } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getGreeting } from "@/lib/utils";
import { BookOpen, TrendingUp, Bell, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getStudentDashboardData(userId: string) {
  // Get student record
  const student = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!student) return null;

  // Get user details
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      firstName: true,
      lastName: true,
      arabicName: true,
      profilePhoto: true,
    },
  });

  // Get programme
  const programme = student.currentProgrammeId
    ? await db.query.programmes.findFirst({
        where: eq(programmes.id, student.currentProgrammeId),
      })
    : null;

  // Get level
  const level = student.currentLevelId
    ? await db.query.levels.findFirst({
        where: eq(levels.id, student.currentLevelId),
      })
    : null;

  // Get current session
  const currentSession = await db.query.academicSessions.findFirst({
    where: eq(academicSessions.isCurrent, true),
  });

  // Get recent published results
  const recentResults = student.currentSessionId
    ? await db.query.results.findMany({
        where: and(
          eq(results.studentId, student.id),
          eq(results.status, "published"),
          eq(results.sessionId, student.currentSessionId)
        ),
        limit: 5,
        orderBy: desc(results.publishedAt),
      })
    : [];

  // Get announcements targeted to everyone or this programme/level
  const recentAnnouncements = await db.query.announcements.findMany({
    where: and(
      eq(announcements.isPublished, true),
      eq(announcements.target, "everyone")
    ),
    limit: 4,
    orderBy: desc(announcements.createdAt),
  });

  return {
    student,
    user,
    programme,
    level,
    currentSession,
    recentResults,
    recentAnnouncements,
  };
}

export default async function StudentDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const data = await getStudentDashboardData(session.userId);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Profile Setup Required
          </h2>
          <p className="text-gray-500">
            Your student profile is being configured. Please contact
            the academy.
          </p>
        </div>
      </div>
    );
  }

  const { student, user, programme, level, currentSession, recentResults, recentAnnouncements } = data;

  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <p className="text-emerald-200 text-sm mb-1">{greeting},</p>
        <h1 className="text-2xl font-bold mb-1">
          {user?.firstName} {user?.lastName}
        </h1>
        {user?.arabicName && (
          <p className="arabic-text text-emerald-200 text-base mb-3">
            {user.arabicName}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {programme && (
            <Badge className="bg-white/20 text-white border-0">
              {programme.name}
            </Badge>
          )}
          {level && (
            <Badge className="bg-white/20 text-white border-0">
              {level.name}
            </Badge>
          )}
          {currentSession && (
            <Badge className="bg-white/20 text-white border-0">
              {currentSession.name} Academic Session
            </Badge>
          )}
          <Badge className="bg-white/20 text-white border-0 font-mono text-xs">
            {student.studentId}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: "Current Courses",
            value: "—",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            icon: Award,
            label: "Results Published",
            value: recentResults.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: TrendingUp,
            label: "Academic Progress",
            value: "Active",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            icon: Bell,
            label: "Announcements",
            value: recentAnnouncements.length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentResults.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No published results yet
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Results will appear here once published by the academy
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          Course Result
                        </p>
                        <p className="text-gray-500 text-xs">
                          {result.totalScore
                            ? `Total: ${result.totalScore}`
                            : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        {result.grade && (
                          <Badge
                            variant={
                              result.grade === "A"
                                ? "success"
                                : result.grade === "B"
                                ? "info"
                                : "secondary"
                            }
                          >
                            Grade {result.grade}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAnnouncements.length === 0 ? (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    No announcements
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {announcement.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}