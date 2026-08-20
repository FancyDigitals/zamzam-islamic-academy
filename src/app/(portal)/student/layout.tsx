import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentHeader } from "@/components/student/student-header";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "student") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader session={session} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}