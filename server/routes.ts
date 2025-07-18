import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertProjectSchema, insertAiToolSchema, insertPromptSchema, insertKnowledgeBaseSchema, insertAutomationWorkflowSchema, insertRevenueTrackingSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for demo purposes - in production this would come from authentication
  const MOCK_USER_ID = 1;

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(MOCK_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients(MOCK_USER_ID);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create client" });
      }
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(parseInt(req.params.id), validatedData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to update client" });
      }
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      await storage.deleteClient(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects(MOCK_USER_ID);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(parseInt(req.params.id), validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to update project" });
      }
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // AI Tools routes
  app.get("/api/ai-tools", async (req, res) => {
    try {
      const aiTools = await storage.getAiTools(MOCK_USER_ID);
      res.json(aiTools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI tools" });
    }
  });

  app.post("/api/ai-tools", async (req, res) => {
    try {
      const validatedData = insertAiToolSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const aiTool = await storage.createAiTool(validatedData);
      res.status(201).json(aiTool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create AI tool" });
      }
    }
  });

  // Prompts routes
  app.get("/api/prompts", async (req, res) => {
    try {
      const prompts = await storage.getPrompts(MOCK_USER_ID);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  app.post("/api/prompts", async (req, res) => {
    try {
      const validatedData = insertPromptSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create prompt" });
      }
    }
  });

  // Knowledge Base routes
  app.get("/api/knowledge", async (req, res) => {
    try {
      const knowledge = await storage.getKnowledgeBase(MOCK_USER_ID);
      res.json(knowledge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge base" });
    }
  });

  app.post("/api/knowledge", async (req, res) => {
    try {
      const validatedData = insertKnowledgeBaseSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const knowledge = await storage.createKnowledgeBase(validatedData);
      res.status(201).json(knowledge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create knowledge base item" });
      }
    }
  });

  // Automation Workflows routes
  app.get("/api/automation", async (req, res) => {
    try {
      const workflows = await storage.getAutomationWorkflows(MOCK_USER_ID);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch automation workflows" });
    }
  });

  app.post("/api/automation", async (req, res) => {
    try {
      const validatedData = insertAutomationWorkflowSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const workflow = await storage.createAutomationWorkflow(validatedData);
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create automation workflow" });
      }
    }
  });

  // Revenue Tracking routes
  app.get("/api/revenue", async (req, res) => {
    try {
      const revenue = await storage.getRevenueTracking(MOCK_USER_ID);
      res.json(revenue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue tracking" });
    }
  });

  app.post("/api/revenue", async (req, res) => {
    try {
      const validatedData = insertRevenueTrackingSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      const revenue = await storage.createRevenueTracking(validatedData);
      res.status(201).json(revenue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create revenue tracking" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
