import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function generateStudentId(year: number, sequence: number): string {
  const paddedSeq = String(sequence).padStart(4, "0");
  return `ZIA-${year}-${paddedSeq}`;
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `ZIA-APP-${year}-${random}`;
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatScore(score: string | number | null): string {
  if (score === null || score === undefined) return "-";
  return Number(score).toFixed(1);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Assalamu Alaikum";
  if (hour < 17) return "Assalamu Alaikum";
  return "Assalamu Alaikum";
}

export function calculateGrade(
  score: number,
  gradingScale: Array<{
    minScore: string;
    maxScore: string;
    grade: string;
    remark: string;
  }>
): { grade: string; remark: string } | null {
  for (const scale of gradingScale) {
    if (
      score >= Number(scale.minScore) &&
      score <= Number(scale.maxScore)
    ) {
      return { grade: scale.grade, remark: scale.remark };
    }
  }
  return null;
}