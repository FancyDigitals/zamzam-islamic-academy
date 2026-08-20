import { z } from "zod";

export const scoreEntrySchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
  score: z
    .number()
    .min(0, "Score cannot be negative")
    .max(1000, "Score seems too high"),
  remarks: z.string().max(500).optional(),
});

export const resultSubmissionSchema = z.object({
  courseAssignmentId: z.string().uuid(),
  termId: z.string().uuid(),
  scores: z.array(scoreEntrySchema),
});

export const assessmentScoreSchema = z.object({
  score: z.number().min(0, "Score cannot be negative"),
  remarks: z.string().max(500).optional(),
});

export type ScoreEntry = z.infer<typeof scoreEntrySchema>;
export type ResultSubmission = z.infer<typeof resultSubmissionSchema>;