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

// Admin check middleware
const ADMIN_TOKEN = "shh7197-admin-valid-token";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-admin-token"] as string;
  if (token === ADMIN_TOKEN) {
    return next();
  }
  console.warn(`Unauthorized admin access attempt. Token: ${token}`);
  res.status(401).json({ success: false, message: "愿由ъ옄 沅뚰븳???꾩슂?⑸땲??" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "dkfvkrh123") {
      return res.json({ success: true, token: ADMIN_TOKEN, message: "愿由ъ옄濡?濡쒓렇?몃릺?덉뒿?덈떎." });
    }
    res.status(401).json({ success: false, message: "?꾩씠???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딆뒿?덈떎." });
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
      res.status(404).json({ success: false, message: "?뚯씪??李얠쓣 ???놁뒿?덈떎." });
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
        message: "硫붿떆吏媛 ?깃났?곸쑝濡??꾩넚?섏뿀?듬땲??",
        id: message.id
      });
    } catch (error) {
      console.error("Error saving message:", error);

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "硫붿떆吏 ?꾩넚 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎."
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
        message: "硫붿떆吏瑜?媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎."
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
      res.status(500).json({ success: false, message: "?꾨낫???뺣낫瑜?媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "?꾨낫???뺣낫 ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
      res.status(500).json({ success: false, message: "??꾨씪?몄쓣 媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "??꾨씪????ぉ ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "??꾨씪????ぉ??李얠쓣 ???놁뒿?덈떎." });
      } else {
        res.status(500).json({ success: false, message: "??꾨씪????ぉ ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
      }
    }
  });

  app.delete("/api/timeline/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTimelineEntry(id);
      res.json({ success: true, message: "??꾨씪????ぉ????젣?섏뿀?듬땲??" });
    } catch (error) {
      console.error("Error deleting timeline entry:", error);
      res.status(500).json({ success: false, message: "??꾨씪????ぉ ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
    }
  });

  // Policy Areas routes
  app.get("/api/policy-areas", async (req, res) => {
    try {
      const areas = await storage.getAllPolicyAreas();
      res.json({ success: true, data: areas });
    } catch (error) {
      console.error("Error fetching policy areas:", error);
      res.status(500).json({ success: false, message: "?뺤콉 遺꾩빞瑜?媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "?뺤콉 遺꾩빞 ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "?뺤콉 遺꾩빞瑜?李얠쓣 ???놁뒿?덈떎." });
      } else {
        res.status(500).json({ success: false, message: "?뺤콉 遺꾩빞 ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
      }
    }
  });

  app.delete("/api/policy-areas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePolicyArea(id);
      res.json({ success: true, message: "?뺤콉 遺꾩빞媛 ??젣?섏뿀?듬땲??" });
    } catch (error) {
      console.error("Error deleting policy area:", error);
      res.status(500).json({ success: false, message: "?뺤콉 遺꾩빞 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
    }
  });

  // Contact Details routes
  app.get("/api/contact-details", async (req, res) => {
    try {
      const details = await storage.getAllContactDetails();
      res.json({ success: true, data: details });
    } catch (error) {
      console.error("Error fetching contact details:", error);
      res.status(500).json({ success: false, message: "?곕씫泥??뺣낫瑜?媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "?곕씫泥??뺣낫 ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "?곕씫泥??뺣낫瑜?李얠쓣 ???놁뒿?덈떎." });
      } else {
        res.status(500).json({ success: false, message: "?곕씫泥??뺣낫 ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
      }
    }
  });

  app.delete("/api/contact-details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContactDetail(id);
      res.json({ success: true, message: "?곕씫泥??뺣낫媛 ??젣?섏뿀?듬땲??" });
    } catch (error) {
      console.error("Error deleting contact detail:", error);
      res.status(500).json({ success: false, message: "?곕씫泥??뺣낫 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
    }
  });

  // Office Hours routes  
  app.get("/api/office-hours", async (req, res) => {
    try {
      const hours = await storage.getAllOfficeHours();
      res.json({ success: true, data: hours });
    } catch (error) {
      console.error("Error fetching office hours:", error);
      res.status(500).json({ success: false, message: "?댁쁺?쒓컙??媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "?댁쁺?쒓컙 ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "?댁쁺?쒓컙??李얠쓣 ???놁뒿?덈떎." });
      } else {
        res.status(500).json({ success: false, message: "?댁쁺?쒓컙 ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
      }
    }
  });

  app.delete("/api/office-hours/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteOfficeHour(id);
      res.json({ success: true, message: "?댁쁺?쒓컙????젣?섏뿀?듬땲??" });
    } catch (error) {
      console.error("Error deleting office hour:", error);
      res.status(500).json({ success: false, message: "?댁쁺?쒓컙 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
    }
  });

  // Social Links routes
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getAllSocialLinks();
      res.json({ success: true, data: links });
    } catch (error) {
      console.error("Error fetching social links:", error);
      res.status(500).json({ success: false, message: "?뚯뀥 留곹겕瑜?媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "?뚯뀥 留곹겕 ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "?뚯뀥 留곹겕瑜?李얠쓣 ???놁뒿?덈떎." });
      } else {
        res.status(500).json({ success: false, message: "?뚯뀥 留곹겕 ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
      }
    }
  });

  app.delete("/api/social-links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSocialLink(id);
      res.json({ success: true, message: "?뚯뀥 留곹겕媛 ??젣?섏뿀?듬땲??" });
    } catch (error) {
      console.error("Error deleting social link:", error);
      res.status(500).json({ success: false, message: "?뚯뀥 留곹겕 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
    }
  });

  // Statistics routes
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getAllStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ success: false, message: "?듦퀎瑜?媛?몄삤??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "?듦퀎 ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
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
        res.status(400).json({ success: false, message: "?낅젰 ?곗씠?곌? ?щ컮瑜댁? ?딆뒿?덈떎.", errors: error.errors });
      } else if (error.message?.includes("not found")) {
        res.status(404).json({ success: false, message: "?듦퀎瑜?李얠쓣 ???놁뒿?덈떎." });
      } else {
        res.status(500).json({ success: false, message: "?듦퀎 ?낅뜲?댄듃 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
      }
    }
  });

  app.delete("/api/statistics/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStatistic(id);
      res.json({ success: true, message: "?듦퀎媛 ??젣?섏뿀?듬땲??" });
    } catch (error) {
      console.error("Error deleting statistic:", error);
      res.status(500).json({ success: false, message: "?듦퀎 ??젣 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎." });
    }
  });

  // ==== Citizen Participation API Routes ====

  // Vote routes
  app.get("/api/votes", async (req, res) => {
    try {
      const votes = await storage.getAllVotes();
      res.json({ success: true, data: votes });
    } catch (error) {
      res.status(500).json({ success: false, message: "?ы몴 紐⑸줉??媛?몄삤?붾뜲 ?ㅽ뙣?덉뒿?덈떎." });
    }
  });

