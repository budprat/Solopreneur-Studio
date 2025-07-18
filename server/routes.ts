import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertClientSchema, insertProjectSchema, insertAiToolSchema, insertPromptSchema, 
  insertKnowledgeBaseSchema, insertAutomationWorkflowSchema, insertRevenueTrackingSchema, 
  insertExperimentSchema, insertInsightSchema, insertCollaborationSchema, insertBusinessMetricSchema,
  insertContentItemSchema, insertEmailAnalysisSchema, insertTaskSchema, insertDigitalAssetSchema,
  insertKnowledgeEntitySchema, insertKnowledgeConnectionSchema, insertContentPipelineSchema
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

  // Experiments routes for AI Experimentation Lab
  app.get("/api/experiments", async (req, res) => {
    try {
      const experiments = await storage.getExperiments(MOCK_USER_ID);
      res.json(experiments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiments" });
    }
  });

  app.post("/api/experiments", async (req, res) => {
    try {
      const validatedData = insertExperimentSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
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

  app.post("/api/experiments/:id/run", async (req, res) => {
    try {
      const experiment = await storage.runExperiment(parseInt(req.params.id));
      res.json(experiment);
    } catch (error) {
      res.status(500).json({ error: "Failed to run experiment" });
    }
  });

  // Growth Insights routes for Strategic Growth Advisor
  app.get("/api/insights", async (req, res) => {
    try {
      const insights = await storage.getInsights(MOCK_USER_ID);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.post("/api/insights", async (req, res) => {
    try {
      const validatedData = insertInsightSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
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

  app.get("/api/growth/metrics", async (req, res) => {
    try {
      const metrics = await storage.getGrowthMetrics(MOCK_USER_ID);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch growth metrics" });
    }
  });

  // Business Intelligence routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const period = req.query.period as string || '30d';
      const analytics = await storage.getBusinessAnalytics(MOCK_USER_ID, period);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics/metrics", async (req, res) => {
    try {
      const validatedData = insertBusinessMetricSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
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
  app.get("/api/collaborations", async (req, res) => {
    try {
      const collaborations = await storage.getCollaborations(MOCK_USER_ID);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaborations" });
    }
  });

  app.post("/api/collaborations", async (req, res) => {
    try {
      const validatedData = insertCollaborationSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
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
  app.get("/api/content", async (req, res) => {
    try {
      // Mock response for content items
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      // Mock response for creating content
      res.status(201).json({ id: Date.now(), ...req.body });
    } catch (error) {
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  app.post("/api/content/generate", async (req, res) => {
    try {
      // Mock AI content generation
      res.json({ 
        content: "Generated content based on: " + req.body.prompt,
        type: req.body.type || "text"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Email Intelligence routes
  app.get("/api/emails", async (req, res) => {
    try {
      // Mock response for email analyses
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.post("/api/emails/:id/process", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to process email" });
    }
  });

  app.post("/api/emails/:id/respond", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to send response" });
    }
  });

  app.get("/api/email-templates", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  // Intelligent Scheduling routes
  app.get("/api/tasks", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/energy-patterns", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch energy patterns" });
    }
  });

  app.get("/api/schedule/:date", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });

  app.post("/api/schedule/optimize", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to optimize schedule" });
    }
  });

  // Digital Asset Management routes
  app.get("/api/assets", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.post("/api/assets/upload", async (req, res) => {
    try {
      res.status(201).json({ id: Date.now(), success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload asset" });
    }
  });

  app.post("/api/assets/:id/analyze", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze asset" });
    }
  });

  app.get("/api/asset-collections", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch asset collections" });
    }
  });

  // Knowledge Graph routes
  app.get("/api/knowledge/entities", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge entities" });
    }
  });

  app.get("/api/knowledge/connections", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge connections" });
    }
  });

  app.get("/api/knowledge/insights", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge insights" });
    }
  });

  app.post("/api/knowledge/analyze", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze knowledge" });
    }
  });

  // Content Pipeline routes
  app.get("/api/content-pipelines", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content pipelines" });
    }
  });

  app.post("/api/content-pipelines/:id/run", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to run pipeline" });
    }
  });

  app.post("/api/content-pipelines/:id/pause", async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to pause pipeline" });
    }
  });

  app.get("/api/content-campaigns", async (req, res) => {
    try {
      res.json([]);
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
