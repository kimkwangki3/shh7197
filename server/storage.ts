import {
  users,
  messages,
  candidateInfo,
  timelineEntries,
  policyAreas,
  contactDetails,
  officeHours,
  socialLinks,
  statistics,
  type User,
  type InsertUser,
  type Message,
  type InsertMessage,
  type CandidateInfo,
  type InsertCandidateInfo,
  type TimelineEntry,
  type InsertTimelineEntry,
  type PolicyArea,
  type InsertPolicyArea,
  type ContactDetail,
  type InsertContactDetail,
  type OfficeHour,
  type InsertOfficeHour,
  type SocialLink,
  type InsertSocialLink,
  type Statistic,
  type InsertStatistic,
  votes,
  suggestions,
  boards,
  promises,
  comments,
  likes,
  type Vote,
  type InsertVote,
  type Suggestion,
  type InsertSuggestion,
  type Board,
  type InsertBoard,
  type PromiseItem,
  type InsertPromise,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike
} from "../shared/schema.ts";
import { db } from "./db.ts";
import { eq, desc, asc, sql, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getAllMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;

  // Candidate info methods
  getCandidateInfo(): Promise<CandidateInfo | undefined>;
  updateCandidateInfo(info: InsertCandidateInfo): Promise<CandidateInfo>;

  // Timeline methods
  getAllTimelineEntries(): Promise<TimelineEntry[]>;
  createTimelineEntry(entry: InsertTimelineEntry): Promise<TimelineEntry>;
  updateTimelineEntry(id: string, entry: Partial<InsertTimelineEntry>): Promise<TimelineEntry>;
  deleteTimelineEntry(id: string): Promise<void>;

  // Policy area methods
  getAllPolicyAreas(): Promise<PolicyArea[]>;
  createPolicyArea(area: InsertPolicyArea): Promise<PolicyArea>;
  updatePolicyArea(id: string, area: Partial<InsertPolicyArea>): Promise<PolicyArea>;
  deletePolicyArea(id: string): Promise<void>;

  // Contact detail methods
  getAllContactDetails(): Promise<ContactDetail[]>;
  createContactDetail(detail: InsertContactDetail): Promise<ContactDetail>;
  updateContactDetail(id: string, detail: Partial<InsertContactDetail>): Promise<ContactDetail>;
  deleteContactDetail(id: string): Promise<void>;

  // Office hours methods
  getAllOfficeHours(): Promise<OfficeHour[]>;
  createOfficeHour(hour: InsertOfficeHour): Promise<OfficeHour>;
  updateOfficeHour(id: string, hour: Partial<InsertOfficeHour>): Promise<OfficeHour>;
  deleteOfficeHour(id: string): Promise<void>;

  // Social link methods
  getAllSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: string, link: Partial<InsertSocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: string): Promise<void>;

  // Statistics methods
  getAllStatistics(): Promise<Statistic[]>;
  createStatistic(stat: InsertStatistic): Promise<Statistic>;
  updateStatistic(id: string, stat: Partial<InsertStatistic>): Promise<Statistic>;
  deleteStatistic(id: string): Promise<void>;

  // Vote methods
  getAllVotes(): Promise<Vote[]>;
  getHeroVote(): Promise<Vote | undefined>;
  getVote(id: string): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  updateVoteCount(id: string, optionIndices: number[]): Promise<Vote>;
  updateVote(id: string, vote: Partial<InsertVote>): Promise<Vote>;
  deleteVote(id: string): Promise<void>;

  // Suggestion methods
  getAllSuggestions(): Promise<Suggestion[]>;
  getSuggestion(id: string): Promise<Suggestion | undefined>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  updateSuggestion(id: string, suggestion: Partial<InsertSuggestion>): Promise<Suggestion>;
  deleteSuggestion(id: string): Promise<void>;
  updateSuggestionLikes(id: string, ipAddress: string): Promise<Suggestion>;

  // Board methods
  getBoardItems(type?: string): Promise<Board[]>;
  getBoardItem(id: string): Promise<Board | undefined>;
  createBoardItem(item: InsertBoard): Promise<Board>;
  updateBoardItem(id: string, updateItem: Partial<InsertBoard>): Promise<Board>;
  updateBoardLikes(id: string, ipAddress: string): Promise<Board>;
  deleteBoardItem(id: string): Promise<void>;

  // Promise methods
  getAllPromises(): Promise<PromiseItem[]>;
  getPromisesByCategory(category: string): Promise<PromiseItem[]>;
  createPromise(promise: InsertPromise): Promise<PromiseItem>;
  updatePromise(id: string, updateItem: Partial<InsertPromise>): Promise<PromiseItem>;
  deletePromise(id: string): Promise<void>;

  // Comment methods
  getComments(targetType: string, targetId: string): Promise<Comment[]>;
  getAllComments(): Promise<Comment[]>;
  getComment(id: string): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: string, comment: Partial<InsertComment>): Promise<Comment>;
  updateCommentLikes(id: string, ipAddress: string): Promise<Comment>;
  deleteComment(id: string): Promise<void>;

  // Admin like count setters
  setBoardLikeCount(id: string, count: number): Promise<Board>;
  setSuggestionLikeCount(id: string, count: number): Promise<Suggestion>;
  setCommentLikeCount(id: string, count: number): Promise<Comment>;

  // Like methods
  hasLiked(targetType: string, targetId: string, ipAddress: string): Promise<boolean>;
  createLike(like: InsertLike): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  // Candidate info methods
  async getCandidateInfo(): Promise<CandidateInfo | undefined> {
    const [info] = await db.select().from(candidateInfo).limit(1);
    return info || undefined;
  }

  async updateCandidateInfo(insertInfo: InsertCandidateInfo): Promise<CandidateInfo> {
    // First try to update existing record
    const existing = await this.getCandidateInfo();
    if (existing) {
      const [updated] = await db
        .update(candidateInfo)
        .set({ ...insertInfo, updatedAt: new Date() })
        .where(eq(candidateInfo.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new record if none exists
      const [created] = await db
        .insert(candidateInfo)
        .values(insertInfo)
        .returning();
      return created;
    }
  }

  // Timeline methods
  async getAllTimelineEntries(): Promise<TimelineEntry[]> {
    return await db.select().from(timelineEntries).orderBy(asc(timelineEntries.sortOrder));
  }

  async createTimelineEntry(insertEntry: InsertTimelineEntry): Promise<TimelineEntry> {
    const [entry] = await db
      .insert(timelineEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateTimelineEntry(id: string, updateData: Partial<InsertTimelineEntry>): Promise<TimelineEntry> {
    const [entry] = await db
      .update(timelineEntries)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(timelineEntries.id, id))
      .returning();
    if (!entry) {
      throw new Error(`Timeline entry with id ${id} not found`);
    }
    return entry;
  }

  async deleteTimelineEntry(id: string): Promise<void> {
    await db.delete(timelineEntries).where(eq(timelineEntries.id, id));
  }

  // Policy area methods
  async getAllPolicyAreas(): Promise<PolicyArea[]> {
    return await db.select().from(policyAreas).orderBy(asc(policyAreas.sortOrder));
  }

  async createPolicyArea(insertArea: InsertPolicyArea): Promise<PolicyArea> {
    const [area] = await db
      .insert(policyAreas)
      .values(insertArea)
      .returning();
    return area;
  }

  async updatePolicyArea(id: string, updateData: Partial<InsertPolicyArea>): Promise<PolicyArea> {
    const [area] = await db
      .update(policyAreas)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(policyAreas.id, id))
      .returning();
    if (!area) {
      throw new Error(`Policy area with id ${id} not found`);
    }
    return area;
  }

  async deletePolicyArea(id: string): Promise<void> {
    await db.delete(policyAreas).where(eq(policyAreas.id, id));
  }

  // Contact detail methods
  async getAllContactDetails(): Promise<ContactDetail[]> {
    return await db.select().from(contactDetails).where(eq(contactDetails.isActive, true)).orderBy(asc(contactDetails.sortOrder));
  }

  async createContactDetail(insertDetail: InsertContactDetail): Promise<ContactDetail> {
    const [detail] = await db
      .insert(contactDetails)
      .values(insertDetail)
      .returning();
    return detail;
  }

  async updateContactDetail(id: string, updateData: Partial<InsertContactDetail>): Promise<ContactDetail> {
    const [detail] = await db
      .update(contactDetails)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(contactDetails.id, id))
      .returning();
    if (!detail) {
      throw new Error(`Contact detail with id ${id} not found`);
    }
    return detail;
  }

  async deleteContactDetail(id: string): Promise<void> {
    await db.delete(contactDetails).where(eq(contactDetails.id, id));
  }

  // Office hours methods
  async getAllOfficeHours(): Promise<OfficeHour[]> {
    return await db.select().from(officeHours).orderBy(asc(officeHours.sortOrder));
  }

  async createOfficeHour(insertHour: InsertOfficeHour): Promise<OfficeHour> {
    const [hour] = await db
      .insert(officeHours)
      .values(insertHour)
      .returning();
    return hour;
  }

  async updateOfficeHour(id: string, updateData: Partial<InsertOfficeHour>): Promise<OfficeHour> {
    const [hour] = await db
      .update(officeHours)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(officeHours.id, id))
      .returning();
    if (!hour) {
      throw new Error(`Office hour with id ${id} not found`);
    }
    return hour;
  }

  async deleteOfficeHour(id: string): Promise<void> {
    await db.delete(officeHours).where(eq(officeHours.id, id));
  }

  // Social link methods
  async getAllSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks).where(eq(socialLinks.isActive, true)).orderBy(asc(socialLinks.sortOrder));
  }

  async createSocialLink(insertLink: InsertSocialLink): Promise<SocialLink> {
    const [link] = await db
      .insert(socialLinks)
      .values(insertLink)
      .returning();
    return link;
  }

  async updateSocialLink(id: string, updateData: Partial<InsertSocialLink>): Promise<SocialLink> {
    const [link] = await db
      .update(socialLinks)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(socialLinks.id, id))
      .returning();
    if (!link) {
      throw new Error(`Social link with id ${id} not found`);
    }
    return link;
  }

  async deleteSocialLink(id: string): Promise<void> {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  }

  // Statistics methods
  async getAllStatistics(): Promise<Statistic[]> {
    return await db.select().from(statistics).orderBy(asc(statistics.sortOrder));
  }

  async createStatistic(insertStat: InsertStatistic): Promise<Statistic> {
    const [stat] = await db
      .insert(statistics)
      .values(insertStat)
      .returning();
    return stat;
  }

  async updateStatistic(id: string, updateData: Partial<InsertStatistic>): Promise<Statistic> {
    const [stat] = await db
      .update(statistics)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(statistics.id, id))
      .returning();
    if (!stat) {
      throw new Error(`Statistic with id ${id} not found`);
    }
    return stat;
  }

  async deleteStatistic(id: string): Promise<void> {
    await db.delete(statistics).where(eq(statistics.id, id));
  }

  // Vote methods
  async getAllVotes(): Promise<Vote[]> {
    return await db.select().from(votes).orderBy(desc(votes.createdAt));
  }

  async getHeroVote(): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(eq(votes.isHero, true)).limit(1);
    return vote || undefined;
  }

  async getVote(id: string): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(eq(votes.id, id));
    return vote || undefined;
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const [vote] = await db.insert(votes).values({
      ...insertVote,
      results: new Array(insertVote.options?.length || 0).fill(0),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return vote;
  }

  async updateVoteCount(id: string, optionIndices: number[]): Promise<Vote> {
    // 다중 선택 또는 단일 선택 모두 처리 가능한 로직
    const voteData = await this.getVote(id);
    if (!voteData) throw new Error("Vote not found");

    const newResults = [...voteData.results];
    optionIndices.forEach(index => {
      if (index >= 0 && index < newResults.length) {
        newResults[index]++;
      }
    });

    const [updatedVote] = await db
      .update(votes)
      .set({
        results: newResults,
        updatedAt: new Date(),
      })
      .where(eq(votes.id, id))
      .returning();

    return updatedVote;
  }

  async updateVote(id: string, updateVote: Partial<InsertVote>): Promise<Vote> {
    const [vote] = await db
      .update(votes)
      .set({ ...updateVote, updatedAt: new Date() })
      .where(eq(votes.id, id))
      .returning();
    if (!vote) throw new Error("Vote not found");
    return vote;
  }

  async deleteVote(id: string): Promise<void> {
    await db.delete(votes).where(eq(votes.id, id));
  }
  // Suggestion methods
  async getAllSuggestions(): Promise<Suggestion[]> {
    return await db.select().from(suggestions).orderBy(desc(suggestions.createdAt));
  }

  async getSuggestion(id: string): Promise<Suggestion | undefined> {
    const [suggestion] = await db.select().from(suggestions).where(eq(suggestions.id, id));
    return suggestion || undefined;
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const [suggestion] = await db.insert(suggestions).values(insertSuggestion).returning();
    return suggestion;
  }

  async updateSuggestion(id: string, updateData: Partial<InsertSuggestion>): Promise<Suggestion> {
    const [suggestion] = await db
      .update(suggestions)
      .set(updateData)
      .where(eq(suggestions.id, id))
      .returning();
    if (!suggestion) throw new Error("Suggestion not found");
    return suggestion;
  }

  async updateSuggestionLikes(id: string, ipAddress: string): Promise<Suggestion> {
    const liked = await this.hasLiked("suggestion", id, ipAddress);
    if (liked) return (await this.getSuggestion(id))!;

    await this.createLike({ targetType: "suggestion", targetId: id, ipAddress });

    const [suggestion] = await db
      .update(suggestions)
      .set({ likeCount: sql`like_count + 1` })
      .where(eq(suggestions.id, id))
      .returning();
    if (!suggestion) throw new Error("Suggestion not found");
    return suggestion;
  }

  async deleteSuggestion(id: string): Promise<void> {
    await db.delete(suggestions).where(eq(suggestions.id, id));
  }

  // Board methods
  async getBoardItems(type?: string): Promise<Board[]> {
    let query = db.select().from(boards);
    if (type) {
      // @ts-ignore
      query = query.where(eq(boards.type, type));
    }
    return await query.orderBy(desc(boards.isPinned), desc(boards.createdAt));
  }

  async getBoardItem(id: string): Promise<Board | undefined> {
    const [item] = await db.select().from(boards).where(eq(boards.id, id));
    return item || undefined;
  }

  async createBoardItem(item: InsertBoard): Promise<Board> {
    const [board] = await db.insert(boards).values({
      ...item,
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return board;
  }

  async updateBoardItem(id: string, updateItem: Partial<InsertBoard>): Promise<Board> {
    const [board] = await db
      .update(boards)
      .set({ ...updateItem, updatedAt: new Date() })
      .where(eq(boards.id, id))
      .returning();
    if (!board) throw new Error("Board item not found");
    return board;
  }

  async updateBoardLikes(id: string, ipAddress: string): Promise<Board> {
    const liked = await this.hasLiked("board", id, ipAddress);
    if (liked) return (await this.getBoardItem(id))!;

    await this.createLike({ targetType: "board", targetId: id, ipAddress });

    const [board] = await db
      .update(boards)
      .set({ likeCount: sql`like_count + 1` })
      .where(eq(boards.id, id))
      .returning();
    if (!board) throw new Error("Board item not found");
    return board;
  }

  async deleteBoardItem(id: string): Promise<void> {
    await db.delete(boards).where(eq(boards.id, id));
  }

  // Promise methods
  async getAllPromises(): Promise<PromiseItem[]> {
    return await db.select().from(promises).orderBy(asc(promises.sortOrder));
  }

  async getPromisesByCategory(category: string): Promise<PromiseItem[]> {
    return await db.select().from(promises).where(eq(promises.category, category)).orderBy(asc(promises.sortOrder));
  }

  async createPromise(promise: InsertPromise): Promise<PromiseItem> {
    const [item] = await db.insert(promises).values({
      ...promise,
      createdAt: new Date(),
    }).returning();
    return item;
  }

  async updatePromise(id: string, updateItem: Partial<InsertPromise>): Promise<PromiseItem> {
    const [item] = await db
      .update(promises)
      .set({ ...updateItem })
      .where(eq(promises.id, id))
      .returning();
    if (!item) throw new Error("Promise not found");
    return item;
  }

  async deletePromise(id: string): Promise<void> {
    await db.delete(promises).where(eq(promises.id, id));
  }

  // Comment methods
  async getComments(targetType: string, targetId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.targetType, targetType))
      // @ts-ignore
      .where(eq(comments.targetId, targetId))
      .orderBy(desc(comments.createdAt));
  }

  async getComment(id: string): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }

  async updateComment(id: string, updateData: Partial<InsertComment>): Promise<Comment> {
    const [comment] = await db
      .update(comments)
      .set(updateData)
      .where(eq(comments.id, id))
      .returning();
    if (!comment) throw new Error("Comment not found");
    return comment;
  }

  async updateCommentLikes(id: string, ipAddress: string): Promise<Comment> {
    const liked = await this.hasLiked("comment", id, ipAddress);
    if (liked) return (await this.getComment(id))!;

    await this.createLike({ targetType: "comment", targetId: id, ipAddress });

    const [comment] = await db
      .update(comments)
      .set({ likeCount: sql`like_count + 1` })
      .where(eq(comments.id, id))
      .returning();
    if (!comment) throw new Error("Comment not found");
    return comment;
  }

  async hasLiked(targetType: string, targetId: string, ipAddress: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.targetType, targetType),
          eq(likes.targetId, targetId),
          eq(likes.ipAddress, ipAddress)
        )
      )
      .limit(1);
    return !!like;
  }

  async createLike(like: InsertLike): Promise<void> {
    await db.insert(likes).values(like);
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async getAllComments(): Promise<Comment[]> {
    return await db.select().from(comments).orderBy(desc(comments.createdAt));
  }

  async setBoardLikeCount(id: string, count: number): Promise<Board> {
    const [item] = await db.update(boards).set({ likeCount: count, updatedAt: new Date() }).where(eq(boards.id, id)).returning();
    if (!item) throw new Error("Board item not found");
    return item;
  }

  async setSuggestionLikeCount(id: string, count: number): Promise<Suggestion> {
    const [item] = await db.update(suggestions).set({ likeCount: count }).where(eq(suggestions.id, id)).returning();
    if (!item) throw new Error("Suggestion not found");
    return item;
  }

  async setCommentLikeCount(id: string, count: number): Promise<Comment> {
    const [item] = await db.update(comments).set({ likeCount: count }).where(eq(comments.id, id)).returning();
    if (!item) throw new Error("Comment not found");
    return item;
  }
}


export const storage = new DatabaseStorage();
