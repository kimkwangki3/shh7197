import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  kakaoId: text("kakao_id").unique(),
  avatarUrl: text("avatar_url"),
  nickname: text("nickname"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
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
  kakaoId: true,
  avatarUrl: true,
  nickname: true,
  isAdmin: true,
}).extend({
  username: z.string().min(1, "사용자 아이디를 입력해주세요"),
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

// 시민 참여 투표
export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 교통, 복지, 환경 등
  endDate: timestamp("end_date").notNull(),
  options: text("options").array().notNull().default([]), // 투표 항목들
  results: integer("results").array().notNull().default([]), // 각 항목별 득표 수
  allowMultiple: boolean("allow_multiple").notNull().default(false), // 복수 선택 가능 여부
  isHero: boolean("is_hero").notNull().default(false), // 지금 뜨거운 투표 여부
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 시민 의견 제안
export const suggestions = pgTable("suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  authorId: varchar("author_id"), // 관리자 작성 시 'admin' 등
  ipAddress: text("ip_address"), // 작성자 IP (익명 식별용)
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// 게시판 (공지/자유)
export const boards = pgTable("boards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // notice, policy, free
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isPinned: boolean("is_pinned").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// 공약 및 이행 상태
export const promises = pgTable("promises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  keyPoints: text("key_points").array().notNull().default([]),
  status: text("status").notNull(), // 진행중, 이행완료, 계획중
  progress: integer("progress").notNull().default(0), // 0-100
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// 댓글
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  targetType: text("target_type").notNull(), // vote, suggestion, board
  targetId: varchar("target_id").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id"), // 관리자 작성 시 'admin' 등
  ipAddress: text("ip_address"), // 작성자 IP (익명 식별용)
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// 좋아요 이력 (IP 기반 중복 방지용)
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  targetType: text("target_type").notNull(), // board, comment, suggestion
  targetId: varchar("target_id").notNull(),
  ipAddress: text("ip_address").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertLikeSchema = createInsertSchema(likes).omit({
  id: true,
  createdAt: true,
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

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  results: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  endDate: z.coerce.date(),
});

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  ipAddress: z.string().optional(),
});

export const insertBoardSchema = createInsertSchema(boards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
}).extend({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
});

export const insertPromiseSchema = createInsertSchema(promises).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
}).extend({
  content: z.string().min(1, "내용을 입력해주세요"),
  ipAddress: z.string().optional(),
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

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Suggestion = typeof suggestions.$inferSelect;
export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Board = typeof boards.$inferSelect;
export type InsertBoard = z.infer<typeof insertBoardSchema>;
export type PromiseItem = typeof promises.$inferSelect;
export type InsertPromise = z.infer<typeof insertPromiseSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
