import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMessageSchema,
  insertCandidateInfoSchema,
  insertTimelineEntrySchema,
  insertPolicyAreaSchema,
  insertContactDetailSchema,
  insertOfficeHourSchema,
  insertSocialLinkSchema,
  insertStatisticSchema,
  insertVoteSchema,
  insertSuggestionSchema,
  insertBoardSchema,
  insertPromiseSchema,
  insertCommentSchema
} from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { sql } from "drizzle-orm";
import { db } from "./db";

declare module "express-session" {
  interface SessionData {
    votedSuggestions: string[];
    votedBoards: string[];
    votedComments: string[];
    votedVotes: Record<string, string>;
  }
}

// Admin check middleware
const ADMIN_TOKEN = "shh7197-admin-valid-token";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-admin-token"] as string;
  if (token === ADMIN_TOKEN) {
    (req as any).isAdmin = true;
    return next();
  }
  console.warn(`Unauthorized admin access attempt. Token: ${token}`);
  res.status(401).json({ success: false, message: "관리자 권한이 필요합니다." });
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "dkfvkrh123") {
      return res.json({ success: true, token: ADMIN_TOKEN, message: "관리자로 로그인되었습니다." });
    }
    res.status(401).json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req: Request, res: Response) => {
    const token = req.headers["x-admin-token"];
    if (token === ADMIN_TOKEN) {
      return res.json({ isAdmin: true });
    }
    res.json({ isAdmin: false });
  });

  app.get("/api/download-project", (_req, res) => {
    const filePath = "/tmp/project-files.tar.gz";
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", "attachment; filename=shh7197-project.tar.gz");
      res.setHeader("Content-Type", "application/gzip");
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ success: false, message: "파일을 찾을 수 없습니다." });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const messageData = insertMessageSchema.parse(req.body);

      // Save message to database
      const message = await storage.createMessage(messageData);

      res.json({
        success: true,
        message: "메시지가 성공적으로 전송되었습니다.",
        id: message.id
      });
    } catch (error) {
      console.error("Error saving message:", error);

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "입력 데이터가 올바르지 않습니다.",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "메시지 전송 중 오류가 발생했습니다."
        });
      }
    }
  });

  // Get all messages endpoint (for admin purposes)
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        success: false,
        message: "메시지를 가져오는 중 오류가 발생했습니다."
      });
    }
  });

  // ==== Content Management API Routes ====

  // Candidate Info routes
  app.get("/api/candidate-info", async (req, res) => {
    try {
      const info = await storage.getCandidateInfo();
      res.json({ success: true, data: info });
    } catch (error) {
      console.error("Error fetching candidate info:", error);
      res.status(500).json({ success: false, message: "후보자 정보를 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.put("/api/candidate-info", async (req, res) => {
    try {
      const infoData = insertCandidateInfoSchema.parse(req.body);
      const info = await storage.updateCandidateInfo(infoData);
      res.json({ success: true, data: info });
    } catch (error) {
      console.error("Error updating candidate info:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "후보자 정보 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  // Timeline routes
  app.get("/api/timeline", async (req, res) => {
    try {
      const entries = await storage.getAllTimelineEntries();
      res.json({ success: true, data: entries });
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ success: false, message: "타임라인을 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/timeline", async (req, res) => {
    try {
      const entryData = insertTimelineEntrySchema.parse(req.body);
      const entry = await storage.createTimelineEntry(entryData);
      res.json({ success: true, data: entry });
    } catch (error: any) {
      console.error("Error creating timeline entry:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "타임라인 항목 생성 중 오류가 발생했습니다." });
      }
    }
  });

  app.put("/api/timeline/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertTimelineEntrySchema.partial().parse(req.body);
      const entry = await storage.updateTimelineEntry(id, updateData);
      res.json({ success: true, data: entry });
    } catch (error: any) {
      console.error("Error updating timeline entry:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "타임라인 항목을 찾을 수 없습니다." });
      } else {
        res.status(500).json({ success: false, message: "타임라인 항목 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  app.delete("/api/timeline/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTimelineEntry(id);
      res.json({ success: true, message: "타임라인 항목이 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting timeline entry:", error);
      res.status(500).json({ success: false, message: "타임라인 항목 삭제 중 오류가 발생했습니다." });
    }
  });

  // Policy Areas routes
  app.get("/api/policy-areas", async (req, res) => {
    try {
      const areas = await storage.getAllPolicyAreas();
      res.json({ success: true, data: areas });
    } catch (error) {
      console.error("Error fetching policy areas:", error);
      res.status(500).json({ success: false, message: "정책 분야를 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/policy-areas", async (req, res) => {
    try {
      const areaData = insertPolicyAreaSchema.parse(req.body);
      const area = await storage.createPolicyArea(areaData);
      res.json({ success: true, data: area });
    } catch (error: any) {
      console.error("Error creating policy area:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "정책 분야 생성 중 오류가 발생했습니다." });
      }
    }
  });

  app.put("/api/policy-areas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertPolicyAreaSchema.partial().parse(req.body);
      const area = await storage.updatePolicyArea(id, updateData);
      res.json({ success: true, data: area });
    } catch (error: any) {
      console.error("Error updating policy area:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "정책 분야를 찾을 수 없습니다." });
      } else {
        res.status(500).json({ success: false, message: "정책 분야 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  app.delete("/api/policy-areas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePolicyArea(id);
      res.json({ success: true, message: "정책 분야가 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting policy area:", error);
      res.status(500).json({ success: false, message: "정책 분야 삭제 중 오류가 발생했습니다." });
    }
  });

  // Contact Details routes
  app.get("/api/contact-details", async (req, res) => {
    try {
      const details = await storage.getAllContactDetails();
      res.json({ success: true, data: details });
    } catch (error) {
      console.error("Error fetching contact details:", error);
      res.status(500).json({ success: false, message: "연락처 정보를 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/contact-details", async (req, res) => {
    try {
      const detailData = insertContactDetailSchema.parse(req.body);
      const detail = await storage.createContactDetail(detailData);
      res.json({ success: true, data: detail });
    } catch (error: any) {
      console.error("Error creating contact detail:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "연락처 정보 생성 중 오류가 발생했습니다." });
      }
    }
  });

  app.put("/api/contact-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertContactDetailSchema.partial().parse(req.body);
      const detail = await storage.updateContactDetail(id, updateData);
      res.json({ success: true, data: detail });
    } catch (error: any) {
      console.error("Error updating contact detail:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "연락처 정보를 찾을 수 없습니다." });
      } else {
        res.status(500).json({ success: false, message: "연락처 정보 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  app.delete("/api/contact-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContactDetail(id);
      res.json({ success: true, message: "연락처 정보가 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting contact detail:", error);
      res.status(500).json({ success: false, message: "연락처 정보 삭제 중 오류가 발생했습니다." });
    }
  });

  // Office Hours routes  
  app.get("/api/office-hours", async (req, res) => {
    try {
      const hours = await storage.getAllOfficeHours();
      res.json({ success: true, data: hours });
    } catch (error) {
      console.error("Error fetching office hours:", error);
      res.status(500).json({ success: false, message: "운영시간을 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/office-hours", async (req, res) => {
    try {
      const hourData = insertOfficeHourSchema.parse(req.body);
      const hour = await storage.createOfficeHour(hourData);
      res.json({ success: true, data: hour });
    } catch (error: any) {
      console.error("Error creating office hour:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "운영시간 생성 중 오류가 발생했습니다." });
      }
    }
  });

  app.put("/api/office-hours/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertOfficeHourSchema.partial().parse(req.body);
      const hour = await storage.updateOfficeHour(id, updateData);
      res.json({ success: true, data: hour });
    } catch (error: any) {
      console.error("Error updating office hour:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "운영시간을 찾을 수 없습니다." });
      } else {
        res.status(500).json({ success: false, message: "운영시간 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  app.delete("/api/office-hours/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteOfficeHour(id);
      res.json({ success: true, message: "운영시간이 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting office hour:", error);
      res.status(500).json({ success: false, message: "운영시간 삭제 중 오류가 발생했습니다." });
    }
  });

  // Social Links routes
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getAllSocialLinks();
      res.json({ success: true, data: links });
    } catch (error) {
      console.error("Error fetching social links:", error);
      res.status(500).json({ success: false, message: "소셜 링크를 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/social-links", async (req, res) => {
    try {
      const linkData = insertSocialLinkSchema.parse(req.body);
      const link = await storage.createSocialLink(linkData);
      res.json({ success: true, data: link });
    } catch (error: any) {
      console.error("Error creating social link:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "소셜 링크 생성 중 오류가 발생했습니다." });
      }
    }
  });

  app.put("/api/social-links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertSocialLinkSchema.partial().parse(req.body);
      const link = await storage.updateSocialLink(id, updateData);
      res.json({ success: true, data: link });
    } catch (error: any) {
      console.error("Error updating social link:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "소셜 링크를 찾을 수 없습니다." });
      } else {
        res.status(500).json({ success: false, message: "소셜 링크 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  app.delete("/api/social-links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSocialLink(id);
      res.json({ success: true, message: "소셜 링크가 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting social link:", error);
      res.status(500).json({ success: false, message: "소셜 링크 삭제 중 오류가 발생했습니다." });
    }
  });

  // Statistics routes
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getAllStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ success: false, message: "통계를 가져오는 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/statistics", async (req, res) => {
    try {
      const statData = insertStatisticSchema.parse(req.body);
      const stat = await storage.createStatistic(statData);
      res.json({ success: true, data: stat });
    } catch (error: any) {
      console.error("Error creating statistic:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "통계 생성 중 오류가 발생했습니다." });
      }
    }
  });

  app.put("/api/statistics/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertStatisticSchema.partial().parse(req.body);
      const stat = await storage.updateStatistic(id, updateData);
      res.json({ success: true, data: stat });
    } catch (error: any) {
      console.error("Error updating statistic:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "입력 데이터가 올바르지 않습니다.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "통계를 찾을 수 없습니다." });
      } else {
        res.status(500).json({ success: false, message: "통계 업데이트 중 오류가 발생했습니다." });
      }
    }
  });

  app.delete("/api/statistics/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStatistic(id);
      res.json({ success: true, message: "통계가 삭제되었습니다." });
    } catch (error) {
      console.error("Error deleting statistic:", error);
      res.status(500).json({ success: false, message: "통계 삭제 중 오류가 발생했습니다." });
    }
  });

  // ==== Citizen Participation API Routes ====

  // Vote routes
  app.get("/api/votes", async (req, res) => {
    try {
      const allVotes = await storage.getAllVotes();
      const clientIp = req.ip || req.socket.remoteAddress || "";

      const mapped = await Promise.all(allVotes.map(async vote => {
        // DB에서 IP 기반 투표 여부 조회
        const hasVoted = clientIp ? await storage.hasLiked("vote", vote.id, clientIp) : false;
        const commentCount = (await storage.getComments("vote", vote.id)).length;
        return { ...vote, hasVoted, commentCount };
      }));

      res.json({ success: true, data: mapped });
    } catch (error) {
      res.status(500).json({ success: false, message: "투표 목록을 가져오는데 실패했습니다." });
    }
  });

  app.get("/api/votes/hero", async (req, res) => {
    try {
      const vote = await storage.getHeroVote();
      res.json({ success: true, data: vote });
    } catch (error) {
      res.status(500).json({ success: false, message: "히어로 투표를 가져오는데 실패했습니다." });
    }
  });

  app.post("/api/votes/:id/vote", async (req, res) => {
    try {
      const { id } = req.params;
      const { indices } = req.body; // number[]

      if (!Array.isArray(indices) || indices.length === 0) {
        return res.status(400).json({ success: false, message: "올바른 투표 항목을 선택해주세요." });
      }

      const clientIp = req.ip || req.socket.remoteAddress || "";

      // DB에서 IP 기반 중복 투표 체크
      if (clientIp) {
        const alreadyVoted = await storage.hasLiked("vote", id, clientIp);
        if (alreadyVoted) {
          return res.status(409).json({ success: false, message: "이미 투표하셨습니다." });
        }
      }

      const voteItem = await storage.getVote(id);
      if (!voteItem) return res.status(404).json({ success: false, message: "투표를 찾을 수 없습니다." });

      if (new Date(voteItem.endDate) < new Date()) {
        return res.status(400).json({ success: false, message: "종료된 투표입니다." });
      }

      const vote = await storage.updateVoteCount(id, indices);

      // DB likes 테이블에 IP 저장 (영구적 중복 방지)
      if (clientIp) {
        await storage.createLike({ targetType: "vote", targetId: id, ipAddress: clientIp });
      }

      const commentCount = (await storage.getComments("vote", id)).length;
      res.json({ success: true, data: { ...vote, hasVoted: true, commentCount } });
    } catch (error) {
      console.error("Error updating vote:", error);
      res.status(500).json({ success: false, message: "투표 반영에 실패했습니다." });
    }
  });

  // Helper for masking IPs
  const maskIp = (ip: string | null) => {
    if (!ip) return "익명";
    const parts = ip.split('.');
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.***.***` : ip.slice(0, 8) + '...';
  };

  // Suggestion routes
  app.get("/api/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getAllSuggestions();
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const isAdminUser = (req.session as any)?.adminId !== undefined;

      const mapped = await Promise.all(suggestions.map(async s => {
        let isLiked = false;
        try {
          if (clientIp) {
            isLiked = await storage.hasLiked("suggestion", s.id, clientIp);
          }
        } catch (e) {
          console.error(`Error checking like status for suggestion ${s.id}:`, e);
        }

        return {
          ...s,
          maskedIp: maskIp(s.ipAddress),
          isOwner: s.ipAddress === clientIp || isAdminUser,
          isLiked
        };
      }));

      res.json({ success: true, data: mapped });
    } catch (error) {
      res.status(500).json({ success: false, message: "제안 목록을 가져오는데 실패했습니다." });
    }
  });

  app.post("/api/suggestions", async (req, res) => {
    try {
      const data = insertSuggestionSchema.parse(req.body);
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const suggestion = await storage.createSuggestion({
        ...data,
        ipAddress: clientIp
      });
      res.json({ success: true, data: suggestion });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "제안 등록에 실패했습니다." });
      }
    }
  });

  app.post("/api/suggestions/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const updated = await storage.updateSuggestionLikes(id, clientIp);
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "좋아요 반영에 실패했습니다." });
    }
  });

  app.patch("/api/suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const suggestion = await storage.getSuggestion(id);
      if (!suggestion) return res.status(404).json({ success: false, message: "의견을 찾을 수 없습니다." });

      const clientIp = req.ip || req.socket.remoteAddress || "";
      const isAdminUser = (req.session as any)?.adminId !== undefined;

      if (suggestion.ipAddress !== clientIp && !isAdminUser) {
        return res.status(403).json({ success: false, message: "수정 권한이 없습니다." });
      }

      const data = insertSuggestionSchema.partial().parse(req.body);
      const updated = await storage.updateSuggestion(id, data);
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "의견 수정에 실패했습니다." });
    }
  });

  app.delete("/api/suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const suggestion = await storage.getSuggestion(id);
      if (!suggestion) return res.status(404).json({ success: false, message: "의견을 찾을 수 없습니다." });

      const clientIp = req.ip || req.socket.remoteAddress || "";
      const isAdminUser = (req.session as any)?.adminId !== undefined;

      if (suggestion.ipAddress !== clientIp && !isAdminUser) {
        return res.status(403).json({ success: false, message: "삭제 권한이 없습니다." });
      }

      await storage.deleteSuggestion(id);
      res.json({ success: true, message: "의견이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ success: false, message: "의견 삭제에 실패했습니다." });
    }
  });

  // Board routes
  app.get("/api/board", async (req, res) => {
    try {
      const { type } = req.query;
      const items = await storage.getBoardItems(type as string);
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const mapped = await Promise.all(items.map(async item => {
        let isLiked = false;
        try {
          if (clientIp) {
            isLiked = await storage.hasLiked("board", item.id, clientIp);
          }
        } catch (e) {
          console.error(`Error checking like status for board item ${item.id}:`, e);
        }
        return { ...item, isLiked };
      }));
      res.json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "게시글 목록을 가져오는데 실패했습니다." });
    }
  });

  app.get("/api/board/:id", async (req, res) => {
    try {
      const item = await storage.getBoardItem(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });

      const clientIp = req.ip || req.socket.remoteAddress || "";
      let isLiked = false;
      try {
        if (clientIp) {
          isLiked = await storage.hasLiked("board", item.id, clientIp);
        }
      } catch (e) {
        console.error(`Error checking like status for board item ${item.id}:`, e);
      }
      res.json({
        success: true,
        data: {
          ...item,
          isLiked
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "게시글을 가져오는데 실패했습니다." });
    }
  });

  app.post("/api/board/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const updated = await storage.updateBoardLikes(id, clientIp);
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "좋아요 반영에 실패했습니다." });
    }
  });

  // Promise routes
  app.get("/api/promises", async (req: Request, res: Response) => {
    try {
      const promises = await storage.getAllPromises();
      res.json({ success: true, data: promises });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "공약 목록을 가져오는데 실패했습니다." });
    }
  });

  // Comment routes
  app.get("/api/comments/:targetType/:targetId", async (req: Request, res: Response) => {
    try {
      const { targetType, targetId } = req.params;
      const allComments = await storage.getComments(targetType as string, targetId as string);

      const clientIp = req.ip || req.socket.remoteAddress || "";
      const isAdminUser = (req.session as any)?.adminId !== undefined;

      const mapped = await Promise.all(allComments.map(async c => {
        let isLiked = false;
        try {
          if (clientIp) {
            isLiked = await storage.hasLiked("comment", c.id, clientIp);
          }
        } catch (e) {
          console.error(`Error checking like status for comment ${c.id}:`, e);
        }
        return {
          ...c,
          maskedIp: maskIp(c.ipAddress),
          isOwner: c.ipAddress === clientIp || isAdminUser,
          isLiked
        };
      }));

      res.json({ success: true, data: mapped });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "댓글 목록을 가져오는데 실패했습니다." });
    }
  });

  app.post("/api/comments", async (req: Request, res: Response) => {
    try {
      const data = insertCommentSchema.parse(req.body);
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const comment = await storage.createComment({
        ...data,
        ipAddress: clientIp
      });
      res.json({ success: true, data: comment });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "댓글 등록에 실패했습니다." });
      }
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await storage.getComment(id);
      if (!comment) return res.status(404).json({ success: false, message: "댓글을 찾을 수 없습니다." });

      const clientIp = req.ip || req.socket.remoteAddress || "";
      const isAdminUser = (req.session as any)?.adminId !== undefined;

      if (comment.ipAddress !== clientIp && !isAdminUser) {
        return res.status(403).json({ success: false, message: "삭제 권한이 없습니다." });
      }

      await storage.deleteComment(id);
      res.json({ success: true, message: "댓글이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ success: false, message: "댓글 삭제에 실패했습니다." });
    }
  });

  app.post("/api/comments/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const clientIp = req.ip || req.socket.remoteAddress || "";
      const updated = await storage.updateCommentLikes(id, clientIp);
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "좋아요 반영에 실패했습니다." });
    }
  });

  // ==== Admin CRUD API Routes ====

  // Admin: 투표 생성
  app.post("/api/admin/votes", isAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertVoteSchema.parse(req.body);
      const vote = await storage.createVote(data);
      res.json({ success: true, data: vote });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "투표 생성에 실패했습니다." });
      }
    }
  });

  // Admin: 투표 목록 조회
  app.get("/api/admin/votes", isAdmin, async (req: Request, res: Response) => {
    try {
      const allVotes = await storage.getAllVotes();
      res.json({ success: true, data: allVotes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "투표 목록 조회에 실패했습니다." });
    }
  });

  // Admin: 투표 삭제
  app.delete("/api/admin/votes/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteVote(req.params.id as string);
      res.json({ success: true, message: "투표가 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ success: false, message: "투표 삭제에 실패했습니다." });
    }
  });

  // Admin: 의견 삭제
  app.delete("/api/admin/suggestions/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteSuggestion(req.params.id as string);
      res.json({ success: true, message: "의견이 삭제되었습니다." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "의견 삭제에 실패했습니다." });
    }
  });

  // Admin: 의견에 답글 달기 (comment로 처리)
  app.post("/api/admin/suggestions/:id/reply", isAdmin, async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ success: false, message: "답글 내용이 필요합니다." });
      const comment = await storage.createComment({
        targetType: "suggestion",
        targetId: req.params.id as string,
        content,
        // authorIp is handled automatically in storage
      });
      res.json({ success: true, data: comment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "답글 등록에 실패했습니다." });
    }
  });

  // Admin: 게시판 글 생성
  app.post("/api/admin/board", isAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertBoardSchema.parse(req.body);
      const item = await storage.createBoardItem(data);
      res.json({ success: true, data: item });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "게시글 등록에 실패했습니다." });
      }
    }
  });

  // Admin: 게시판 글 삭제
  app.delete("/api/admin/board/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteBoardItem(req.params.id as string);
      res.json({ success: true, message: "게시글이 삭제되었습니다." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "게시글 삭제에 실패했습니다." });
    }
  });

  // Admin: 공약 생성
  app.post("/api/admin/promises", isAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertPromiseSchema.parse(req.body);
      const item = await storage.createPromise(data);
      res.json({ success: true, data: item });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "공약 등록에 실패했습니다." });
      }
    }
  });

  // Admin: 공약 삭제
  app.delete("/api/admin/promises/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deletePromise(req.params.id as string);
      res.json({ success: true, message: "공약이 삭제되었습니다." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "공약 삭제에 실패했습니다." });
    }
  });

  // Admin: 댓글 삭제
  app.delete("/api/admin/comments/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      await storage.deleteComment(req.params.id as string);
      res.json({ success: true, message: "댓글이 삭제되었습니다." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "댓글 삭제에 실패했습니다." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
