import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100),
  arabicName: z.string().max(200).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  admissionDate: z.string().min(1, "Admission date is required"),
  programmeId: z.string().uuid("Invalid programme").optional(),
  levelId: z.string().uuid("Invalid level").optional(),
  classId: z.string().uuid("Invalid class").optional(),
  sessionId: z.string().uuid("Invalid session").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export const updateStudentSchema = createStudentSchema.partial().omit({
  password: true,
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;