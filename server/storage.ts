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
  type InsertStatistic
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
