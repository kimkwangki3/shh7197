import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("올바른 이메일 형식을 입력해주세요"),
  name: z.string().min(1, "이름을 입력해주세요").max(100, "이름은 100자 이하여야 합니다"),
  subject: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이하여야 합니다"),
  message: z.string().min(1, "메시지를 입력해주세요").max(2000, "메시지는 2000자 이하여야 합니다"),
});

// 후보자 기본 정보
export const candidateInfo = pgTable("candidate_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slogan: text("slogan").notNull(),
  electionYear: text("election_year").notNull(),
  heroTitle: text("hero_title").notNull(),
  heroDescription: text("hero_description").notNull(),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 경력 타임라인
export const timelineEntries = pgTable("timeline_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: text("year").notNull(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  achievements: text("achievements").array().notNull().default([]),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 정책 공약
export const policyAreas = pgTable("policy_areas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  iconName: text("icon_name").notNull(), // Lucide 아이콘 이름
  title: text("title").notNull(),
  description: text("description").notNull(),
  keyPoints: text("key_points").array().notNull().default([]),
  priority: text("priority").notNull(), // 최우선, 우선, 중점
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 연락처 정보
export const contactDetails = pgTable("contact_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // phone, email, office
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 운영시간
export const officeHours = pgTable("office_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  day: text("day").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(), // 운영, 휴무
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 소셜미디어 링크
export const socialLinks = pgTable("social_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  iconName: text("icon_name").notNull(),
  href: text("href").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 통계 정보
export const statistics = pgTable("statistics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  value: text("value").notNull(),
  suffix: text("suffix").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertCandidateInfoSchema = createInsertSchema(candidateInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimelineEntrySchema = createInsertSchema(timelineEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPolicyAreaSchema = createInsertSchema(policyAreas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactDetailSchema = createInsertSchema(contactDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOfficeHourSchema = createInsertSchema(officeHours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStatisticSchema = createInsertSchema(statistics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type CandidateInfo = typeof candidateInfo.$inferSelect;
export type InsertCandidateInfo = z.infer<typeof insertCandidateInfoSchema>;
export type TimelineEntry = typeof timelineEntries.$inferSelect;
export type InsertTimelineEntry = z.infer<typeof insertTimelineEntrySchema>;
export type PolicyArea = typeof policyAreas.$inferSelect;
export type InsertPolicyArea = z.infer<typeof insertPolicyAreaSchema>;
export type ContactDetail = typeof contactDetails.$inferSelect;
export type InsertContactDetail = z.infer<typeof insertContactDetailSchema>;
export type OfficeHour = typeof officeHours.$inferSelect;
export type InsertOfficeHour = z.infer<typeof insertOfficeHourSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = z.infer<typeof insertStatisticSchema>;
