import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertClientSchema, insertProjectSchema, insertAiToolSchema, insertPromptSchema,
  insertKnowledgeBaseSchema, insertAutomationWorkflowSchema, insertRevenueTrackingSchema,
  insertExperimentSchema, insertInsightSchema, insertCollaborationSchema, insertBusinessMetricSchema,
  insertContentItemSchema, insertEmailAnalysisSchema, insertTaskSchema, insertDigitalAssetSchema,
  insertKnowledgeEntitySchema, insertKnowledgeConnectionSchema, insertContentPipelineSchema,
  type Task
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Clients routes
  app.get("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clients = await storage.getClients(userId);
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

  app.post("/api/clients", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertClientSchema.parse({
        ...req.body,
        userId: userId
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
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", isAuthenticated, async (req: any, res) => {
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

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: userId
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

  app.put("/api/projects/:id", isAuthenticated, async (req: any, res) => {
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

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteProject(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // AI Tools routes
  app.get("/api/ai-tools", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const aiTools = await storage.getAiTools(userId);
      res.json(aiTools);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI tools" });
    }
  });

  app.post("/api/ai-tools", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAiToolSchema.parse({
        ...req.body,
        userId: userId
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
  app.get("/api/prompts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prompts = await storage.getPrompts(userId);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  app.post("/api/prompts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertPromptSchema.parse({
        ...req.body,
        userId: userId
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
  app.get("/api/knowledge", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const knowledge = await storage.getKnowledgeBase(userId);
      res.json(knowledge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge base" });
    }
  });

  app.post("/api/knowledge", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertKnowledgeBaseSchema.parse({
        ...req.body,
        userId: userId
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
  app.get("/api/automation", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workflows = await storage.getAutomationWorkflows(userId);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch automation workflows" });
    }
  });

  app.post("/api/automation", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertAutomationWorkflowSchema.parse({
        ...req.body,
        userId: userId
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
  app.get("/api/revenue", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const revenue = await storage.getRevenueTracking(userId);
      res.json(revenue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue tracking" });
    }
  });

  app.post("/api/revenue", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRevenueTrackingSchema.parse({
        ...req.body,
        userId: userId
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

  // Experiments routes for AI Experimentation Lab
  app.get("/api/experiments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const experiments = await storage.getExperiments(userId);
      res.json(experiments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiments" });
    }
  });

  app.post("/api/experiments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertExperimentSchema.parse({
        ...req.body,
        userId: userId
      });
      const experiment = await storage.createExperiment(validatedData);
      res.status(201).json(experiment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create experiment" });
      }
    }
  });

  app.post("/api/experiments/:id/run", isAuthenticated, async (req: any, res) => {
    try {
      const experiment = await storage.runExperiment(parseInt(req.params.id));
      res.json(experiment);
    } catch (error) {
      res.status(500).json({ error: "Failed to run experiment" });
    }
  });

  // Growth Insights routes for Strategic Growth Advisor
  app.get("/api/insights", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const insights = await storage.getInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.post("/api/insights", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertInsightSchema.parse({
        ...req.body,
        userId: userId
      });
      const insight = await storage.createInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create insight" });
      }
    }
  });

  app.get("/api/growth/metrics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getGrowthMetrics(userId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch growth metrics" });
    }
  });

  // Business Intelligence routes
  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const period = req.query.period as string || '30d';
      const analytics = await storage.getBusinessAnalytics(userId, period);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics/metrics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBusinessMetricSchema.parse({
        ...req.body,
        userId: userId
      });
      const metric = await storage.createBusinessMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create metric" });
      }
    }
  });

  // Collaboration routes
  app.get("/api/collaborations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const collaborations = await storage.getCollaborations(userId);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaborations" });
    }
  });

  app.post("/api/collaborations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCollaborationSchema.parse({
        ...req.body,
        userId: userId
      });
      const collaboration = await storage.createCollaboration(validatedData);
      res.status(201).json(collaboration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create collaboration" });
      }
    }
  });

  // Content Creation routes
  app.get("/api/content", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const content = await storage.getContentItems(userId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertContentItemSchema.parse({
        ...req.body,
        userId: userId
      });
      const content = await storage.createContentItem(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create content" });
      }
    }
  });

  app.put("/api/content/:id", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertContentItemSchema.partial().parse(req.body);
      const content = await storage.updateContentItem(parseInt(req.params.id), validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to update content" });
      }
    }
  });

  app.delete("/api/content/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteContentItem(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  app.post("/api/content/generate", isAuthenticated, async (req: any, res) => {
    try {
      const { generateContentIdeas } = await import('./openai');
      const { topic, contentType, targetAudience } = req.body;
      const ideas = await generateContentIdeas(topic, contentType, targetAudience, 1);
      res.json(ideas[0] || {
        content: "Generated content based on: " + req.body.prompt,
        type: req.body.type || "text"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Email Intelligence routes
  app.get("/api/emails", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const emails = await storage.getEmailAnalyses(userId);
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.post("/api/emails", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEmailAnalysisSchema.parse({
        ...req.body,
        userId: userId
      });
      const email = await storage.createEmailAnalysis(validatedData);
      res.status(201).json(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create email analysis" });
      }
    }
  });

  app.put("/api/emails/:id", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertEmailAnalysisSchema.partial().parse(req.body);
      const email = await storage.updateEmailAnalysis(parseInt(req.params.id), validatedData);
      res.json(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to update email" });
      }
    }
  });

  app.post("/api/emails/:id/process", isAuthenticated, async (req: any, res) => {
    try {
      const email = await storage.getEmailAnalysis(parseInt(req.params.id));
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      // Mark as processed
      const updated = await storage.updateEmailAnalysis(parseInt(req.params.id), { status: 'read' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to process email" });
    }
  });

  app.post("/api/emails/:id/respond", isAuthenticated, async (req: any, res) => {
    try {
      const updated = await storage.updateEmailAnalysis(parseInt(req.params.id), { status: 'responded' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to send response" });
    }
  });

  app.get("/api/email-templates", isAuthenticated, async (req: any, res) => {
    try {
      // Return default templates
      res.json([
        { id: 1, name: 'Quick Response', template: 'Thank you for reaching out. I will get back to you shortly.' },
        { id: 2, name: 'Project Update', template: 'Here is an update on your project...' },
        { id: 3, name: 'Invoice Follow-up', template: 'This is a friendly reminder regarding invoice #...' }
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  // Intelligent Scheduling routes
  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        userId: userId
      });
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create task" });
      }
    }
  });

  app.put("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(parseInt(req.params.id), validatedData);
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to update task" });
      }
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteTask(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  app.get("/api/energy-patterns", isAuthenticated, async (req: any, res) => {
    try {
      // Return default energy patterns based on typical productivity cycles
      res.json([
        { hour: 9, level: 'high', label: 'Morning Peak' },
        { hour: 10, level: 'high', label: 'Deep Work' },
        { hour: 11, level: 'high', label: 'Deep Work' },
        { hour: 12, level: 'medium', label: 'Pre-Lunch' },
        { hour: 13, level: 'low', label: 'Post-Lunch Dip' },
        { hour: 14, level: 'medium', label: 'Recovery' },
        { hour: 15, level: 'high', label: 'Afternoon Peak' },
        { hour: 16, level: 'medium', label: 'Winding Down' },
        { hour: 17, level: 'low', label: 'End of Day' }
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy patterns" });
    }
  });

  app.get("/api/schedule/:date", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = new Date(req.params.date);
      const tasks = await storage.getTasksByDate(userId, date);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });

  app.post("/api/schedule/optimize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      // Sort tasks by priority and energy requirements
      const optimized = tasks.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) -
               (priorityOrder[b.priority as keyof typeof priorityOrder] || 2);
      });
      res.json({ success: true, tasks: optimized });
    } catch (error) {
      res.status(500).json({ error: "Failed to optimize schedule" });
    }
  });

  // Digital Asset Management routes
  app.get("/api/assets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assets = await storage.getDigitalAssets(userId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.post("/api/assets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertDigitalAssetSchema.parse({
        ...req.body,
        userId: userId
      });
      const asset = await storage.createDigitalAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create asset" });
      }
    }
  });

  app.put("/api/assets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDigitalAssetSchema.partial().parse(req.body);
      const asset = await storage.updateDigitalAsset(parseInt(req.params.id), validatedData);
      res.json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to update asset" });
      }
    }
  });

  app.delete("/api/assets/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteDigitalAsset(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  app.post("/api/assets/:id/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const asset = await storage.getDigitalAsset(parseInt(req.params.id));
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      // Update with AI analysis placeholder
      const updated = await storage.updateDigitalAsset(parseInt(req.params.id), {
        aiAnalysis: { analyzed: true, analyzedAt: new Date().toISOString() }
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze asset" });
    }
  });

  app.get("/api/asset-collections", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assets = await storage.getDigitalAssets(userId);
      // Group assets by type
      const collections = assets.reduce((acc: any, asset) => {
        if (!acc[asset.type]) {
          acc[asset.type] = { type: asset.type, count: 0, assets: [] };
        }
        acc[asset.type].count++;
        acc[asset.type].assets.push(asset);
        return acc;
      }, {});
      res.json(Object.values(collections));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch asset collections" });
    }
  });

  // Knowledge Graph routes
  app.get("/api/knowledge/entities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entities = await storage.getKnowledgeEntities(userId);
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge entities" });
    }
  });

  app.post("/api/knowledge/entities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertKnowledgeEntitySchema.parse({
        ...req.body,
        userId: userId
      });
      const entity = await storage.createKnowledgeEntity(validatedData);
      res.status(201).json(entity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create knowledge entity" });
      }
    }
  });

  app.get("/api/knowledge/connections", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getKnowledgeConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge connections" });
    }
  });

  app.post("/api/knowledge/connections", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertKnowledgeConnectionSchema.parse({
        ...req.body,
        userId: userId
      });
      const connection = await storage.createKnowledgeConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create knowledge connection" });
      }
    }
  });

  app.get("/api/knowledge/insights", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entities = await storage.getKnowledgeEntities(userId);
      const connections = await storage.getKnowledgeConnections(userId);

      // Generate insights based on graph structure
      const insights = [];

      // Find highly connected entities
      const entityConnections = entities.map(e => ({
        entity: e,
        connectionCount: connections.filter(c => c.fromEntity === e.id || c.toEntity === e.id).length
      })).sort((a, b) => b.connectionCount - a.connectionCount);

      if (entityConnections.length > 0) {
        insights.push({
          type: 'hub',
          title: 'Most Connected Concept',
          description: `"${entityConnections[0]?.entity.name}" is your most connected knowledge hub with ${entityConnections[0]?.connectionCount} connections.`
        });
      }

      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge insights" });
    }
  });

  app.post("/api/knowledge/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entities = await storage.getKnowledgeEntities(userId);
      res.json({
        success: true,
        entityCount: entities.length,
        analyzed: true
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze knowledge" });
    }
  });

  // Content Pipeline routes
  app.get("/api/content-pipelines", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pipelines = await storage.getContentPipelines(userId);
      res.json(pipelines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content pipelines" });
    }
  });

  app.post("/api/content-pipelines", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertContentPipelineSchema.parse({
        ...req.body,
        userId: userId
      });
      const pipeline = await storage.createContentPipeline(validatedData);
      res.status(201).json(pipeline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: fromZodError(error).toString() });
      } else {
        res.status(500).json({ error: "Failed to create content pipeline" });
      }
    }
  });

  app.post("/api/content-pipelines/:id/run", isAuthenticated, async (req: any, res) => {
    try {
      const pipeline = await storage.getContentPipeline(parseInt(req.params.id));
      if (!pipeline) {
        return res.status(404).json({ error: "Pipeline not found" });
      }
      const updated = await storage.updateContentPipeline(parseInt(req.params.id), {
        status: 'active',
        lastRun: new Date(),
        totalRuns: (pipeline.totalRuns || 0) + 1
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to run pipeline" });
    }
  });

  app.post("/api/content-pipelines/:id/pause", isAuthenticated, async (req: any, res) => {
    try {
      const updated = await storage.updateContentPipeline(parseInt(req.params.id), { status: 'paused' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to pause pipeline" });
    }
  });

  app.get("/api/content-campaigns", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pipelines = await storage.getContentPipelines(userId);
      // Group pipelines as campaigns
      res.json(pipelines.filter(p => p.status === 'active'));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content campaigns" });
    }
  });

  // AI Assistant routes
  app.get('/api/ai/insights', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Mock data for now - in production, this would use real user data
      const mockUserData = {
        monthlyRevenue: 5800,
        activeProjects: 7,
        completedProjects: 23,
        aiToolsCount: 12,
        promptCount: 45,
        avgResponseTime: '2.3 hours',
        clientSatisfaction: 92
      };

      // Generate insights using Gemini (when API key is available)
      try {
        const { generateBusinessInsights } = await import('./gemini');
        const insights = await generateBusinessInsights(mockUserData);
        
        if (insights.length > 0) {
          return res.json(insights);
        }
      } catch (error) {
        console.log('Gemini API not available, using mock data');
      }
      
      // Fallback to mock data
      const mockInsights = [
        {
          type: 'opportunity',
          title: 'Peak Productivity Hours',
          description: 'Your productivity peaks between 9-11 AM. Schedule complex tasks during this window.',
          impact: 'high',
          confidence: 94,
          actionItems: [
            'Block calendar for deep work 9-11 AM',
            'Schedule client calls after 11 AM',
            'Use AI tools during peak hours'
          ],
          priority: 8
        },
        {
          type: 'risk',
          title: 'Client Response Delay',
          description: 'Average response time increased by 23% this week. May impact client satisfaction.',
          impact: 'medium',
          confidence: 87,
          actionItems: [
            'Set up automated response templates',
            'Create response time tracking dashboard',
            'Implement notification system'
          ],
          priority: 6
        },
        {
          type: 'forecast',
          title: 'Revenue Growth',
          description: 'Based on current trends, expect 15% revenue increase by Q3.',
          impact: 'high',
          confidence: 82,
          actionItems: [
            'Prepare for scaling operations',
            'Optimize pricing strategy',
            'Expand service offerings'
          ],
          priority: 9
        }
      ];
      
      res.json(mockInsights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      res.status(500).json({ message: 'Failed to fetch AI insights' });
    }
  });

  app.get('/api/ai/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Mock user data and preferences
      const mockUserData = {
        monthlyRevenue: 5800,
        activeProjects: 7,
        aiProficiency: 'Intermediate'
      };

      const mockPreferences = {
        businessFocus: 'Content Creation',
        goals: 'Scale Revenue',
        challenges: 'Time Management',
        workStyle: 'Flexible'
      };

      // Generate recommendations using Gemini
      try {
        const { generatePersonalizedRecommendations } = await import('./gemini');
        const recommendations = await generatePersonalizedRecommendations(mockUserData, mockPreferences);
        
        if (recommendations.length > 0) {
          return res.json(recommendations);
        }
      } catch (error) {
        console.log('Gemini API not available, using mock data');
      }
      
      // Fallback to mock data
      const mockRecommendations = [
        {
          category: 'productivity',
          title: 'Implement Time Blocking',
          description: 'Structure your day with dedicated time blocks for different activities.',
          reasoning: 'Based on your flexible work style and time management challenges, time blocking can improve focus and productivity.',
          expectedBenefit: 'Increase productivity by 25% and reduce context switching.',
          difficulty: 'easy',
          timeToImplement: '1 week',
          steps: [
            'Audit current daily schedule',
            'Identify recurring tasks and meetings',
            'Create time blocks for deep work',
            'Set up calendar blocking system',
            'Review and adjust weekly'
          ]
        },
        {
          category: 'revenue',
          title: 'Premium Content Packages',
          description: 'Create tiered content packages for different client needs.',
          reasoning: 'Your content creation focus and current revenue suggest opportunity for premium offerings.',
          expectedBenefit: 'Increase average project value by 40%.',
          difficulty: 'medium',
          timeToImplement: '2-3 weeks',
          steps: [
            'Analyze current service offerings',
            'Research competitor pricing',
            'Create three service tiers',
            'Develop premium content templates',
            'Launch with existing clients'
          ]
        },
        {
          category: 'ai-tools',
          title: 'Advanced Prompt Library',
          description: 'Build a comprehensive library of optimized prompts for your niche.',
          reasoning: 'Your intermediate AI proficiency suggests you could benefit from more sophisticated prompt engineering.',
          expectedBenefit: 'Improve AI output quality by 30% and reduce iteration time.',
          difficulty: 'medium',
          timeToImplement: '2 weeks',
          steps: [
            'Audit current prompt performance',
            'Research advanced prompt techniques',
            'Create category-based prompt templates',
            'Test and optimize prompts',
            'Implement version control system'
          ]
        }
      ];
      
      res.json(mockRecommendations);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      res.status(500).json({ message: 'Failed to fetch AI recommendations' });
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.claims.sub;
      
      // Simple chat response for now
      const response = `Thank you for your message: "${message}". I'm your AI assistant and I'm here to help you with business insights and recommendations. This feature will be enhanced with full conversational AI capabilities soon.`;
      
      res.json({ response });
    } catch (error) {
      console.error('Error in AI chat:', error);
      res.status(500).json({ message: 'Failed to process chat message' });
    }
  });

  app.post('/api/ai/insights/refresh', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Trigger refresh of insights
      res.json({ message: 'Insights refreshed successfully' });
    } catch (error) {
      console.error('Error refreshing insights:', error);
      res.status(500).json({ message: 'Failed to refresh insights' });
    }
  });

  // Analytics routes
  app.get('/api/analytics/performance', isAuthenticated, async (req: any, res) => {
    try {
      const mockPerformanceData = {
        overall: 78,
        clientSatisfaction: 92,
        aiToolEfficiency: 85,
        projectCompletionRate: 95,
        avgResponseTime: '2.3 hours',
        revenueGrowth: 23,
        aiCostEfficiency: 0.12
      };
      
      res.json(mockPerformanceData);
    } catch (error) {
      console.error('Error fetching performance analytics:', error);
      res.status(500).json({ message: 'Failed to fetch performance analytics' });
    }
  });

  app.get('/api/analytics/trends', isAuthenticated, async (req: any, res) => {
    try {
      const mockTrendsData = {
        revenue: [
          { month: 'Jan', value: 4500 },
          { month: 'Feb', value: 5200 },
          { month: 'Mar', value: 4800 },
          { month: 'Apr', value: 6200 },
          { month: 'May', value: 5800 }
        ],
        productivity: [
          { week: 'W1', value: 75 },
          { week: 'W2', value: 78 },
          { week: 'W3', value: 82 },
          { week: 'W4', value: 78 }
        ],
        aiUsage: [
          { tool: 'Content Gen', usage: 145 },
          { tool: 'Analytics', usage: 98 },
          { tool: 'Scheduling', usage: 67 },
          { tool: 'Optimization', usage: 234 }
        ]
      };
      
      res.json(mockTrendsData);
    } catch (error) {
      console.error('Error fetching trend analytics:', error);
      res.status(500).json({ message: 'Failed to fetch trend analytics' });
    }
  });

  // AI Inspiration Generator routes
  app.get('/api/inspiration/quote', async (req, res) => {
    try {
      const { generateInspirationalQuote } = await import('./openai');
      const quote = await generateInspirationalQuote('solopreneurship');
      res.json(quote);
    } catch (error) {
      console.error('Error generating inspirational quote:', error);
      res.json("Every great journey begins with a single step forward.");
    }
  });

  app.post('/api/inspiration/ideas', isAuthenticated, async (req: any, res) => {
    try {
      const { userContext, ideaType, count } = req.body;
      const { generateCreativeIdeas } = await import('./openai');
      
      const ideas = await generateCreativeIdeas(userContext, ideaType, count);
      
      // Fallback to mock data if OpenAI fails
      if (ideas.length === 0) {
        const mockIdeas = [
          {
            title: "AI-Powered Content Automation Hub",
            description: "Create a comprehensive platform that automatically generates, schedules, and optimizes content across multiple social media platforms using AI.",
            category: "automation",
            difficulty: "medium",
            timeToImplement: "4-6 weeks",
            potentialRevenue: "$2,000-5,000/month",
            requiredSkills: ["AI Integration", "Content Strategy", "Social Media Marketing"],
            nextSteps: [
              "Research AI content generation APIs",
              "Design user interface mockups",
              "Develop MVP with basic automation"
            ],
            inspiration: "Transform your content creation from hours to minutes with the power of AI automation!"
          },
          {
            title: "Micro-SaaS for Small Business Analytics",
            description: "Build a simple, focused analytics tool that helps small businesses track their most important metrics without complexity.",
            category: "business",
            difficulty: "easy",
            timeToImplement: "2-3 weeks",
            potentialRevenue: "$500-2,000/month",
            requiredSkills: ["Data Analysis", "Web Development", "Business Intelligence"],
            nextSteps: [
              "Identify key metrics small businesses need",
              "Create simple dashboard designs",
              "Build basic data visualization features"
            ],
            inspiration: "Simplicity is the ultimate sophistication. Help businesses focus on what matters most!"
          },
          {
            title: "Personal Brand Accelerator Course",
            description: "Develop a comprehensive online course that teaches solopreneurs how to build and monetize their personal brand effectively.",
            category: "content",
            difficulty: "medium",
            timeToImplement: "6-8 weeks",
            potentialRevenue: "$1,000-3,000/month",
            requiredSkills: ["Personal Branding", "Course Creation", "Marketing"],
            nextSteps: [
              "Outline course curriculum",
              "Create video content and materials",
              "Set up course delivery platform"
            ],
            inspiration: "Your unique story is your competitive advantage. Help others discover theirs!"
          }
        ];
        return res.json(mockIdeas);
      }
      
      res.json(ideas);
    } catch (error) {
      console.error('Error generating creative ideas:', error);
      res.status(500).json({ message: 'Failed to generate creative ideas' });
    }
  });

  app.post('/api/inspiration/content', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, contentType, targetAudience, count } = req.body;
      const { generateContentIdeas } = await import('./openai');
      
      const ideas = await generateContentIdeas(topic, contentType, targetAudience, count);
      
      // Fallback to mock data if OpenAI fails
      if (ideas.length === 0) {
        const mockContentIdeas = [
          {
            title: "10 AI Tools Every Solopreneur Should Use in 2025",
            description: "A comprehensive guide showcasing the most powerful AI tools that can transform a solopreneur's workflow and productivity.",
            type: "blog",
            audience: "solopreneurs",
            keyPoints: [
              "AI writing assistants for content creation",
              "Automated social media scheduling tools",
              "AI-powered customer service solutions",
              "Financial management and analytics tools"
            ],
            callToAction: "Download our free AI tools checklist and start automating your business today!",
            estimatedTime: "3-4 hours"
          },
          {
            title: "From Idea to $10K: My 90-Day Solopreneur Journey",
            description: "A behind-the-scenes look at how one solopreneur built a profitable business in just 90 days.",
            type: "video",
            audience: "aspiring entrepreneurs",
            keyPoints: [
              "Day 1-30: Market research and validation",
              "Day 31-60: Building the MVP",
              "Day 61-90: Launch and scaling strategies",
              "Lessons learned and mistakes to avoid"
            ],
            callToAction: "Subscribe for more entrepreneurship insights and get our free 90-day action plan!",
            estimatedTime: "2-3 hours"
          },
          {
            title: "The Solopreneur's Guide to Work-Life Balance",
            description: "Practical strategies for maintaining mental health and productivity while building a solo business.",
            type: "social",
            audience: "solopreneurs",
            keyPoints: [
              "Setting boundaries with clients and customers",
              "Time management techniques that actually work",
              "Building a support network as a solo entrepreneur",
              "When to say no to opportunities"
            ],
            callToAction: "Share your own work-life balance tips in the comments below!",
            estimatedTime: "1-2 hours"
          }
        ];
        return res.json(mockContentIdeas);
      }
      
      res.json(ideas);
    } catch (error) {
      console.error('Error generating content ideas:', error);
      res.status(500).json({ message: 'Failed to generate content ideas' });
    }
  });

  // Gamification routes
  app.get('/api/gamification/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // In a real application, this would fetch from database
      const mockStats = {
        totalProjects: 15,
        completedProjects: 12,
        activeStreak: 7,
        longestStreak: 21,
        totalAiUsage: 234,
        totalRevenue: 5800,
        level: 4,
        xp: 680,
        xpToNextLevel: 320
      };
      
      res.json(mockStats);
    } catch (error) {
      console.error('Error fetching gamification stats:', error);
      res.status(500).json({ message: 'Failed to fetch gamification stats' });
    }
  });

  app.get('/api/gamification/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // In a real application, this would fetch from database
      const mockAchievements = [
        {
          id: 'first-project',
          title: 'First Steps',
          description: 'Complete your first project',
          icon: 'target',
          category: 'milestone',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
          reward: '+50 XP'
        },
        {
          id: 'ai-enthusiast',
          title: 'AI Enthusiast',
          description: 'Use AI tools 100 times',
          icon: 'brain',
          category: 'ai-usage',
          progress: 78,
          maxProgress: 100,
          unlocked: false,
          reward: '+100 XP + AI Master badge'
        },
        {
          id: 'streak-starter',
          title: 'Streak Starter',
          description: 'Maintain a 7-day work streak',
          icon: 'flame',
          category: 'streak',
          progress: 7,
          maxProgress: 7,
          unlocked: true,
          unlockedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
          reward: '+75 XP'
        },
        {
          id: 'productivity-master',
          title: 'Productivity Master',
          description: 'Complete 25 tasks in a week',
          icon: 'zap',
          category: 'productivity',
          progress: 18,
          maxProgress: 25,
          unlocked: false,
          reward: '+120 XP + Productivity Badge'
        },
        {
          id: 'revenue-milestone',
          title: 'First Revenue',
          description: 'Earn your first $1,000',
          icon: 'diamond',
          category: 'revenue',
          progress: 580,
          maxProgress: 1000,
          unlocked: false,
          reward: '+200 XP + Revenue Milestone Badge'
        },
        {
          id: 'community-builder',
          title: 'Community Builder',
          description: 'Help 10 other solopreneurs',
          icon: 'heart',
          category: 'social',
          progress: 3,
          maxProgress: 10,
          unlocked: false,
          reward: '+150 XP + Community Champion Badge'
        }
      ];
      
      res.json(mockAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ message: 'Failed to fetch achievements' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
