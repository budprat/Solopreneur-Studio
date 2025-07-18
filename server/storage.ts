import {
  users, clients, projects, aiTools, prompts, knowledgeBase, automationWorkflows, revenueTracking, aiUsageLogs,
  experiments, insights, collaborations, businessMetrics,
  type User, type InsertUser, type Client, type InsertClient, type Project, type InsertProject,
  type AiTool, type InsertAiTool, type Prompt, type InsertPrompt, type KnowledgeBase, type InsertKnowledgeBase,
  type AutomationWorkflow, type InsertAutomationWorkflow, type RevenueTracking, type InsertRevenueTracking,
  type AiUsageLog, type InsertAiUsageLog, type Experiment, type InsertExperiment,
  type Insight, type InsertInsight, type Collaboration, type InsertCollaboration,
  type BusinessMetric, type InsertBusinessMetric,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Clients
  getClients(userId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Projects
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByClient(clientId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // AI Tools
  getAiTools(userId: string): Promise<AiTool[]>;
  getAiTool(id: number): Promise<AiTool | undefined>;
  createAiTool(aiTool: InsertAiTool): Promise<AiTool>;
  updateAiTool(id: number, aiTool: Partial<InsertAiTool>): Promise<AiTool>;
  deleteAiTool(id: number): Promise<void>;
  
  // Prompts
  getPrompts(userId: string): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: Partial<InsertPrompt>): Promise<Prompt>;
  deletePrompt(id: number): Promise<void>;
  
  // Knowledge Base
  getKnowledgeBase(userId: string): Promise<KnowledgeBase[]>;
  getKnowledgeBaseItem(id: number): Promise<KnowledgeBase | undefined>;
  createKnowledgeBase(item: InsertKnowledgeBase): Promise<KnowledgeBase>;
  updateKnowledgeBase(id: number, item: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase>;
  deleteKnowledgeBase(id: number): Promise<void>;
  
  // Automation Workflows
  getAutomationWorkflows(userId: string): Promise<AutomationWorkflow[]>;
  getAutomationWorkflow(id: number): Promise<AutomationWorkflow | undefined>;
  createAutomationWorkflow(workflow: InsertAutomationWorkflow): Promise<AutomationWorkflow>;
  updateAutomationWorkflow(id: number, workflow: Partial<InsertAutomationWorkflow>): Promise<AutomationWorkflow>;
  deleteAutomationWorkflow(id: number): Promise<void>;
  
  // Revenue Tracking
  getRevenueTracking(userId: string): Promise<RevenueTracking[]>;
  getRevenueByDateRange(userId: string, startDate: Date, endDate: Date): Promise<RevenueTracking[]>;
  createRevenueTracking(revenue: InsertRevenueTracking): Promise<RevenueTracking>;
  updateRevenueTracking(id: number, revenue: Partial<InsertRevenueTracking>): Promise<RevenueTracking>;
  deleteRevenueTracking(id: number): Promise<void>;
  
  // AI Usage Logs
  getAiUsageLogs(userId: string): Promise<AiUsageLog[]>;
  createAiUsageLog(log: InsertAiUsageLog): Promise<AiUsageLog>;
  getAiUsageByDateRange(userId: string, startDate: Date, endDate: Date): Promise<AiUsageLog[]>;
  
  // Dashboard Analytics
  getDashboardStats(userId: string): Promise<{
    monthlyRevenue: number;
    activeProjects: number;
    aiToolsCost: number;
    hoursSaved: number;
  }>;

  // Experiments (AI Experimentation Lab)
  getExperiments(userId: string): Promise<Experiment[]>;
  getExperiment(id: number): Promise<Experiment | undefined>;
  createExperiment(experiment: InsertExperiment): Promise<Experiment>;
  updateExperiment(id: number, experiment: Partial<InsertExperiment>): Promise<Experiment>;
  runExperiment(id: number): Promise<Experiment>;
  deleteExperiment(id: number): Promise<void>;

  // Insights (Strategic Growth Advisor)
  getInsights(userId: string): Promise<Insight[]>;
  getInsight(id: number): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  updateInsight(id: number, insight: Partial<InsertInsight>): Promise<Insight>;
  deleteInsight(id: number): Promise<void>;
  getGrowthMetrics(userId: string): Promise<any>;

  // Collaborations (Real-time Collaboration)
  getCollaborations(userId: string): Promise<Collaboration[]>;
  getCollaboration(id: number): Promise<Collaboration | undefined>;
  createCollaboration(collaboration: InsertCollaboration): Promise<Collaboration>;
  updateCollaboration(id: number, collaboration: Partial<InsertCollaboration>): Promise<Collaboration>;
  deleteCollaboration(id: number): Promise<void>;

  // Business Intelligence
  getBusinessMetrics(userId: string): Promise<BusinessMetric[]>;
  createBusinessMetric(metric: InsertBusinessMetric): Promise<BusinessMetric>;
  getBusinessAnalytics(userId: string, period: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Users (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  // Clients
  async getClients(userId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Projects
  async getProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByClient(clientId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.clientId, clientId)).orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // AI Tools
  async getAiTools(userId: string): Promise<AiTool[]> {
    return await db.select().from(aiTools).where(eq(aiTools.userId, userId)).orderBy(desc(aiTools.createdAt));
  }

  async getAiTool(id: number): Promise<AiTool | undefined> {
    const [aiTool] = await db.select().from(aiTools).where(eq(aiTools.id, id));
    return aiTool || undefined;
  }

  async createAiTool(aiTool: InsertAiTool): Promise<AiTool> {
    const [newAiTool] = await db.insert(aiTools).values(aiTool).returning();
    return newAiTool;
  }

  async updateAiTool(id: number, aiTool: Partial<InsertAiTool>): Promise<AiTool> {
    const [updatedAiTool] = await db.update(aiTools).set(aiTool).where(eq(aiTools.id, id)).returning();
    return updatedAiTool;
  }

  async deleteAiTool(id: number): Promise<void> {
    await db.delete(aiTools).where(eq(aiTools.id, id));
  }

  // Prompts
  async getPrompts(userId: string): Promise<Prompt[]> {
    return await db.select().from(prompts).where(eq(prompts.userId, userId)).orderBy(desc(prompts.createdAt));
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || undefined;
  }

  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const [newPrompt] = await db.insert(prompts).values(prompt).returning();
    return newPrompt;
  }

  async updatePrompt(id: number, prompt: Partial<InsertPrompt>): Promise<Prompt> {
    const [updatedPrompt] = await db.update(prompts).set(prompt).where(eq(prompts.id, id)).returning();
    return updatedPrompt;
  }

  async deletePrompt(id: number): Promise<void> {
    await db.delete(prompts).where(eq(prompts.id, id));
  }

  // Knowledge Base
  async getKnowledgeBase(userId: string): Promise<KnowledgeBase[]> {
    return await db.select().from(knowledgeBase).where(eq(knowledgeBase.userId, userId)).orderBy(desc(knowledgeBase.createdAt));
  }

  async getKnowledgeBaseItem(id: number): Promise<KnowledgeBase | undefined> {
    const [item] = await db.select().from(knowledgeBase).where(eq(knowledgeBase.id, id));
    return item || undefined;
  }

  async createKnowledgeBase(item: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const [newItem] = await db.insert(knowledgeBase).values(item).returning();
    return newItem;
  }

  async updateKnowledgeBase(id: number, item: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase> {
    const [updatedItem] = await db.update(knowledgeBase).set(item).where(eq(knowledgeBase.id, id)).returning();
    return updatedItem;
  }

  async deleteKnowledgeBase(id: number): Promise<void> {
    await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
  }

  // Automation Workflows
  async getAutomationWorkflows(userId: string): Promise<AutomationWorkflow[]> {
    return await db.select().from(automationWorkflows).where(eq(automationWorkflows.userId, userId)).orderBy(desc(automationWorkflows.createdAt));
  }

  async getAutomationWorkflow(id: number): Promise<AutomationWorkflow | undefined> {
    const [workflow] = await db.select().from(automationWorkflows).where(eq(automationWorkflows.id, id));
    return workflow || undefined;
  }

  async createAutomationWorkflow(workflow: InsertAutomationWorkflow): Promise<AutomationWorkflow> {
    const [newWorkflow] = await db.insert(automationWorkflows).values(workflow).returning();
    return newWorkflow;
  }

  async updateAutomationWorkflow(id: number, workflow: Partial<InsertAutomationWorkflow>): Promise<AutomationWorkflow> {
    const [updatedWorkflow] = await db.update(automationWorkflows).set(workflow).where(eq(automationWorkflows.id, id)).returning();
    return updatedWorkflow;
  }

  async deleteAutomationWorkflow(id: number): Promise<void> {
    await db.delete(automationWorkflows).where(eq(automationWorkflows.id, id));
  }

  // Revenue Tracking
  async getRevenueTracking(userId: string): Promise<RevenueTracking[]> {
    return await db.select().from(revenueTracking).where(eq(revenueTracking.userId, userId)).orderBy(desc(revenueTracking.date));
  }

  async getRevenueByDateRange(userId: string, startDate: Date, endDate: Date): Promise<RevenueTracking[]> {
    return await db.select().from(revenueTracking).where(
      and(
        eq(revenueTracking.userId, userId),
        gte(revenueTracking.date, startDate),
        lte(revenueTracking.date, endDate)
      )
    ).orderBy(desc(revenueTracking.date));
  }

  async createRevenueTracking(revenue: InsertRevenueTracking): Promise<RevenueTracking> {
    const [newRevenue] = await db.insert(revenueTracking).values(revenue).returning();
    return newRevenue;
  }

  async updateRevenueTracking(id: number, revenue: Partial<InsertRevenueTracking>): Promise<RevenueTracking> {
    const [updatedRevenue] = await db.update(revenueTracking).set(revenue).where(eq(revenueTracking.id, id)).returning();
    return updatedRevenue;
  }

  async deleteRevenueTracking(id: number): Promise<void> {
    await db.delete(revenueTracking).where(eq(revenueTracking.id, id));
  }

  // AI Usage Logs
  async getAiUsageLogs(userId: string): Promise<AiUsageLog[]> {
    return await db.select().from(aiUsageLogs).where(eq(aiUsageLogs.userId, userId)).orderBy(desc(aiUsageLogs.createdAt));
  }

  async createAiUsageLog(log: InsertAiUsageLog): Promise<AiUsageLog> {
    const [newLog] = await db.insert(aiUsageLogs).values(log).returning();
    return newLog;
  }

  async getAiUsageByDateRange(userId: string, startDate: Date, endDate: Date): Promise<AiUsageLog[]> {
    return await db.select().from(aiUsageLogs).where(
      and(
        eq(aiUsageLogs.userId, userId),
        gte(aiUsageLogs.createdAt, startDate),
        lte(aiUsageLogs.createdAt, endDate)
      )
    ).orderBy(desc(aiUsageLogs.createdAt));
  }

  // Dashboard Analytics
  async getDashboardStats(userId: string): Promise<{
    monthlyRevenue: number;
    activeProjects: number;
    aiToolsCost: number;
    hoursSaved: number;
  }> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Get monthly revenue
    const monthlyRevenueResult = await db
      .select({ total: sql<number>`sum(${revenueTracking.amount})` })
      .from(revenueTracking)
      .where(
        and(
          eq(revenueTracking.userId, userId),
          eq(revenueTracking.type, 'payment'),
          gte(revenueTracking.date, currentMonth),
          lte(revenueTracking.date, nextMonth)
        )
      );

    // Get active projects count
    const activeProjectsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(
        and(
          eq(projects.userId, userId),
          eq(projects.status, 'active')
        )
      );

    // Get AI tools cost
    const aiToolsCostResult = await db
      .select({ total: sql<number>`sum(${aiTools.currentSpend})` })
      .from(aiTools)
      .where(eq(aiTools.userId, userId));

    return {
      monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
      activeProjects: activeProjectsResult[0]?.count || 0,
      aiToolsCost: aiToolsCostResult[0]?.total || 0,
      hoursSaved: 47 // This would be calculated based on automation metrics
    };
  }

  // Experiments (AI Experimentation Lab)
  async getExperiments(userId: string): Promise<Experiment[]> {
    return await db.select().from(experiments).where(eq(experiments.userId, userId)).orderBy(desc(experiments.createdAt));
  }

  async getExperiment(id: number): Promise<Experiment | undefined> {
    const [experiment] = await db.select().from(experiments).where(eq(experiments.id, id));
    return experiment || undefined;
  }

  async createExperiment(experiment: InsertExperiment): Promise<Experiment> {
    const [newExperiment] = await db.insert(experiments).values(experiment).returning();
    return newExperiment;
  }

  async updateExperiment(id: number, experiment: Partial<InsertExperiment>): Promise<Experiment> {
    const [updatedExperiment] = await db.update(experiments).set(experiment).where(eq(experiments.id, id)).returning();
    return updatedExperiment;
  }

  async runExperiment(id: number): Promise<Experiment> {
    // Mock implementation - in production this would integrate with AI APIs
    const mockResults = [
      {
        id: Date.now().toString(),
        model: 'gpt-4',
        prompt: 'Test prompt',
        response: 'Mock response from GPT-4',
        tokens: 150,
        cost: 0.0045,
        latency: 1200,
        qualityScore: 8.5,
        timestamp: new Date().toISOString()
      }
    ];
    
    const [updatedExperiment] = await db.update(experiments)
      .set({ status: 'completed', results: mockResults })
      .where(eq(experiments.id, id))
      .returning();
    return updatedExperiment;
  }

  async deleteExperiment(id: number): Promise<void> {
    await db.delete(experiments).where(eq(experiments.id, id));
  }

  // Insights (Strategic Growth Advisor)
  async getInsights(userId: string): Promise<Insight[]> {
    return await db.select().from(insights).where(eq(insights.userId, userId)).orderBy(desc(insights.createdAt));
  }

  async getInsight(id: number): Promise<Insight | undefined> {
    const [insight] = await db.select().from(insights).where(eq(insights.id, id));
    return insight || undefined;
  }

  async createInsight(insight: InsertInsight): Promise<Insight> {
    const [newInsight] = await db.insert(insights).values(insight).returning();
    return newInsight;
  }

  async updateInsight(id: number, insight: Partial<InsertInsight>): Promise<Insight> {
    const [updatedInsight] = await db.update(insights).set(insight).where(eq(insights.id, id)).returning();
    return updatedInsight;
  }

  async deleteInsight(id: number): Promise<void> {
    await db.delete(insights).where(eq(insights.id, id));
  }

  async getGrowthMetrics(userId: string): Promise<any> {
    // Mock implementation - in production this would calculate real metrics
    return {
      currentRevenue: 127500,
      growthRate: 23,
      clientCount: 8,
      avgProjectValue: 15938,
      profitMargin: 68,
      marketPosition: 'Growing',
      riskLevel: 'Medium'
    };
  }

  // Collaborations (Real-time Collaboration)
  async getCollaborations(userId: string): Promise<Collaboration[]> {
    return await db.select().from(collaborations).where(eq(collaborations.userId, userId)).orderBy(desc(collaborations.createdAt));
  }

  async getCollaboration(id: number): Promise<Collaboration | undefined> {
    const [collaboration] = await db.select().from(collaborations).where(eq(collaborations.id, id));
    return collaboration || undefined;
  }

  async createCollaboration(collaboration: InsertCollaboration): Promise<Collaboration> {
    const [newCollaboration] = await db.insert(collaborations).values(collaboration).returning();
    return newCollaboration;
  }

  async updateCollaboration(id: number, collaboration: Partial<InsertCollaboration>): Promise<Collaboration> {
    const [updatedCollaboration] = await db.update(collaborations).set(collaboration).where(eq(collaborations.id, id)).returning();
    return updatedCollaboration;
  }

  async deleteCollaboration(id: number): Promise<void> {
    await db.delete(collaborations).where(eq(collaborations.id, id));
  }

  // Business Intelligence
  async getBusinessMetrics(userId: string): Promise<BusinessMetric[]> {
    return await db.select().from(businessMetrics).where(eq(businessMetrics.userId, userId)).orderBy(desc(businessMetrics.createdAt));
  }

  async createBusinessMetric(metric: InsertBusinessMetric): Promise<BusinessMetric> {
    const [newMetric] = await db.insert(businessMetrics).values(metric).returning();
    return newMetric;
  }

  async getBusinessAnalytics(userId: string, period: string): Promise<any> {
    // Mock implementation - in production this would calculate real analytics
    return {
      revenue: {
        current: 127500,
        previous: 98200,
        growth: 29.8,
        forecast: 156000
      },
      clients: {
        active: 8,
        churn: 12.5,
        lifetime_value: 45600,
        satisfaction: 4.7
      },
      projects: {
        active: 14,
        completed: 47,
        avg_duration: 28,
        success_rate: 94.2
      },
      ai_usage: {
        total_requests: 15420,
        total_cost: 847.30,
        avg_response_time: 1850,
        cost_per_request: 0.055
      },
      productivity: {
        billable_hours: 124,
        utilization_rate: 82.5,
        profit_margin: 68.3,
        efficiency_score: 91
      }
    };
  }
}

export const storage = new DatabaseStorage();
