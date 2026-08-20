import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  uuid,
  pgEnum,
  unique,
  index,
} from "drizzle-orm/pg-core";

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "academy_admin",
  "teacher",
  "student",
  "guardian",
]);

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const admissionStatusEnum = pgEnum("admission_status", [
  "submitted",
  "under_review",
  "accepted",
  "rejected",
  "waitlisted",
]);

export const resultStatusEnum = pgEnum("result_status", [
  "draft",
  "submitted",
  "approved",
  "published",
]);

export const assessmentTypeEnum = pgEnum("assessment_type", [
  "continuous_assessment",
  "assignment",
  "quiz",
  "test",
  "examination",
  "oral",
  "practical",
  "participation",
]);

export const announcementTargetEnum = pgEnum("announcement_target", [
  "everyone",
  "students",
  "teachers",
  "programme",
  "level",
  "class",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "pdf",
  "audio",
  "video",
  "image",
  "link",
  "text",
]);

export const sessionStatusEnum = pgEnum("session_status", [
  "upcoming",
  "active",
  "completed",
  "archived",
]);

export const termStatusEnum = pgEnum("term_status", [
  "upcoming",
  "active",
  "completed",
]);

// ============================================================
// USERS
// ============================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("student"),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    arabicName: varchar("arabic_name", { length: 200 }),
    phone: varchar("phone", { length: 20 }),
    profilePhoto: text("profile_photo"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

// ============================================================
// PROGRAMMES
// ============================================================

export const programmes = pgTable("programmes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  arabicName: varchar("arabic_name", { length: 200 }),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  durationYears: integer("duration_years"),
  objectives: text("objectives"),
  assessmentStructure: text("assessment_structure"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// ACADEMIC SESSIONS
// ============================================================

export const academicSessions = pgTable("academic_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: sessionStatusEnum("status").notNull().default("upcoming"),
  isCurrent: boolean("is_current").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// TERMS
// ============================================================

export const terms = pgTable("terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => academicSessions.id),
  name: varchar("name", { length: 100 }).notNull(),
  termNumber: integer("term_number").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: termStatusEnum("status").notNull().default("upcoming"),
  isCurrent: boolean("is_current").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// LEVELS
// ============================================================

export const levels = pgTable("levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  programmeId: uuid("programme_id")
    .notNull()
    .references(() => programmes.id),
  name: varchar("name", { length: 200 }).notNull(),
  arabicName: varchar("arabic_name", { length: 200 }),
  levelNumber: integer("level_number").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// CLASSES
// ============================================================

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  levelId: uuid("level_id")
    .notNull()
    .references(() => levels.id),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => academicSessions.id),
  name: varchar("name", { length: 200 }).notNull(),
  capacity: integer("capacity"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// STUDENTS
// ============================================================

export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    studentId: varchar("student_id", { length: 20 }).notNull().unique(),
    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender"),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }).default("Nigeria"),
    admissionDate: date("admission_date").notNull(),
    currentProgrammeId: uuid("current_programme_id").references(
      () => programmes.id
    ),
    currentLevelId: uuid("current_level_id").references(() => levels.id),
    currentClassId: uuid("current_class_id").references(() => classes.id),
    currentSessionId: uuid("current_session_id").references(
      () => academicSessions.id
    ),
    isActive: boolean("is_active").notNull().default(true),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    studentIdIdx: index("students_student_id_idx").on(table.studentId),
    userIdIdx: index("students_user_id_idx").on(table.userId),
  })
);

// ============================================================
// GUARDIANS
// ============================================================

export const guardians = pgTable("guardians", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  userId: uuid("user_id").references(() => users.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// TEACHERS
// ============================================================

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  teacherId: varchar("teacher_id", { length: 20 }).notNull().unique(),
  qualification: text("qualification"),
  specialization: text("specialization"),
  bio: text("bio"),
  arabicBio: text("arabic_bio"),
  joinDate: date("join_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// COURSES / SUBJECTS
// ============================================================

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  arabicName: varchar("arabic_name", { length: 200 }),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  programmeId: uuid("programme_id").references(() => programmes.id),
  creditUnits: integer("credit_units").default(1),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// COURSE ASSIGNMENTS (Teacher → Course → Class → Session)
// ============================================================

export const courseAssignments = pgTable(
  "course_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => academicSessions.id),
    termId: uuid("term_id").references(() => terms.id),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueAssignment: unique().on(
      table.courseId,
      table.classId,
      table.sessionId,
      table.termId
    ),
  })
);

// ============================================================
// ENROLLMENTS (Student → Class → Session)
// ============================================================

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => academicSessions.id),
    enrollmentDate: date("enrollment_date").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    promotionStatus: varchar("promotion_status", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueEnrollment: unique().on(
      table.studentId,
      table.classId,
      table.sessionId
    ),
    studentIdx: index("enrollments_student_idx").on(table.studentId),
  })
);

// ============================================================
// GRADING SCALES
// ============================================================

export const gradingScales = pgTable("grading_scales", {
  id: uuid("id").primaryKey().defaultRandom(),
  programmeId: uuid("programme_id").references(() => programmes.id),
  name: varchar("name", { length: 100 }).notNull(),
  minScore: decimal("min_score", { precision: 5, scale: 2 }).notNull(),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  grade: varchar("grade", { length: 5 }).notNull(),
  gradePoint: decimal("grade_point", { precision: 3, scale: 2 }),
  remark: varchar("remark", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// ASSESSMENT CONFIGURATIONS
// ============================================================

export const assessmentConfigs = pgTable("assessment_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  programmeId: uuid("programme_id")
    .notNull()
    .references(() => programmes.id),
  sessionId: uuid("session_id").references(() => academicSessions.id),
  assessmentType: assessmentTypeEnum("assessment_type").notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  isRequired: boolean("is_required").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// ASSESSMENTS
// ============================================================

export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  assessmentType: assessmentTypeEnum("assessment_type").notNull(),
  courseAssignmentId: uuid("course_assignment_id")
    .notNull()
    .references(() => courseAssignments.id),
  termId: uuid("term_id")
    .notNull()
    .references(() => terms.id),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).notNull(),
  assessmentDate: date("assessment_date"),
  instructions: text("instructions"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// ASSESSMENT SCORES
// ============================================================

export const assessmentScores = pgTable(
  "assessment_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    score: decimal("score", { precision: 5, scale: 2 }),
    remarks: text("remarks"),
    enteredBy: uuid("entered_by").references(() => users.id),
    enteredAt: timestamp("entered_at"),
    lastEditedBy: uuid("last_edited_by").references(() => users.id),
    lastEditedAt: timestamp("last_edited_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueScore: unique().on(table.assessmentId, table.studentId),
    studentIdx: index("assessment_scores_student_idx").on(table.studentId),
  })
);

// ============================================================
// RESULTS
// ============================================================

export const results = pgTable(
  "results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    courseAssignmentId: uuid("course_assignment_id")
      .notNull()
      .references(() => courseAssignments.id),
    termId: uuid("term_id")
      .notNull()
      .references(() => terms.id),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => academicSessions.id),
    caScore: decimal("ca_score", { precision: 5, scale: 2 }),
    examScore: decimal("exam_score", { precision: 5, scale: 2 }),
    totalScore: decimal("total_score", { precision: 5, scale: 2 }),
    grade: varchar("grade", { length: 5 }),
    gradePoint: decimal("grade_point", { precision: 3, scale: 2 }),
    teacherRemarks: text("teacher_remarks"),
    status: resultStatusEnum("status").notNull().default("draft"),
    submittedBy: uuid("submitted_by").references(() => users.id),
    submittedAt: timestamp("submitted_at"),
    approvedBy: uuid("approved_by").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    publishedBy: uuid("published_by").references(() => users.id),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueResult: unique().on(
      table.studentId,
      table.courseAssignmentId,
      table.termId
    ),
    studentIdx: index("results_student_idx").on(table.studentId),
    statusIdx: index("results_status_idx").on(table.status),
  })
);

// ============================================================
// RESULT SCORE HISTORY (Audit Trail for score changes)
// ============================================================

export const resultScoreHistory = pgTable("result_score_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  resultId: uuid("result_id")
    .notNull()
    .references(() => results.id),
  fieldChanged: varchar("field_changed", { length: 50 }).notNull(),
  previousValue: text("previous_value"),
  newValue: text("new_value"),
  changedBy: uuid("changed_by")
    .notNull()
    .references(() => users.id),
  reason: text("reason"),
  changedAt: timestamp("changed_at").notNull().defaultNow(),
});

// ============================================================
// ANNOUNCEMENTS
// ============================================================

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(),
  target: announcementTargetEnum("target").notNull().default("everyone"),
  targetProgrammeId: uuid("target_programme_id").references(
    () => programmes.id
  ),
  targetLevelId: uuid("target_level_id").references(() => levels.id),
  targetClassId: uuid("target_class_id").references(() => classes.id),
  sessionId: uuid("session_id").references(() => academicSessions.id),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// EVENTS
// ============================================================

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  eventDate: date("event_date").notNull(),
  startTime: varchar("start_time", { length: 10 }),
  endTime: varchar("end_time", { length: 10 }),
  location: varchar("location", { length: 300 }),
  targetAudience: varchar("target_audience", { length: 100 }),
  imageUrl: text("image_url"),
  requiresRegistration: boolean("requires_registration").default(false),
  registrationUrl: text("registration_url"),
  isPublished: boolean("is_published").notNull().default(false),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// RESOURCES / DIGITAL LIBRARY
// ============================================================

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  arabicTitle: varchar("arabic_title", { length: 300 }),
  description: text("description"),
  resourceType: resourceTypeEnum("resource_type").notNull(),
  fileUrl: text("file_url"),
  externalUrl: text("external_url"),
  category: varchar("category", { length: 100 }),
  courseId: uuid("course_id").references(() => courses.id),
  programmeId: uuid("programme_id").references(() => programmes.id),
  levelId: uuid("level_id").references(() => levels.id),
  author: varchar("author", { length: 200 }),
  publishDate: date("publish_date"),
  isPublic: boolean("is_public").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// ADMISSIONS
// ============================================================

export const admissions = pgTable("admissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationNumber: varchar("application_number", { length: 30 })
    .notNull()
    .unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  arabicName: varchar("arabic_name", { length: 200 }),
  dateOfBirth: date("date_of_birth"),
  gender: genderEnum("gender"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  guardianName: varchar("guardian_name", { length: 200 }),
  guardianPhone: varchar("guardian_phone", { length: 20 }),
  guardianEmail: varchar("guardian_email", { length: 255 }),
  guardianRelationship: varchar("guardian_relationship", { length: 50 }),
  previousEducation: text("previous_education"),
  programmAppliedId: uuid("programme_applied_id").references(
    () => programmes.id
  ),
  preferredLevelId: uuid("preferred_level_id").references(() => levels.id),
  sessionId: uuid("session_id").references(() => academicSessions.id),
  status: admissionStatusEnum("status").notNull().default("submitted"),
  reviewNotes: text("review_notes"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  convertedToStudentId: uuid("converted_to_student_id").references(
    () => students.id
  ),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// AUDIT LOGS
// ============================================================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    userRole: userRoleEnum("user_role"),
    action: varchar("action", { length: 100 }).notNull(),
    resourceType: varchar("resource_type", { length: 100 }).notNull(),
    resourceId: uuid("resource_id"),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("audit_logs_user_idx").on(table.userId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  })
);

// ============================================================
// NOTIFICATIONS
// ============================================================

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 300 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// SITE CONTENT (CMS)
// ============================================================

export const siteContent = pgTable("site_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 300 }),
  content: text("content"),
  arabicContent: text("arabic_content"),
  contentType: varchar("content_type", { length: 50 }).default("text"),
  isPublished: boolean("is_published").notNull().default(true),
  updatedBy: uuid("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});