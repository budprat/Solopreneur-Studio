import {
  users, clients, projects, aiTools, prompts, knowledgeBase, automationWorkflows, revenueTracking, aiUsageLogs,
  type User, type InsertUser, type Client, type InsertClient, type Project, type InsertProject,
  type AiTool, type InsertAiTool, type Prompt, type InsertPrompt, type KnowledgeBase, type InsertKnowledgeBase,
  type AutomationWorkflow, type InsertAutomationWorkflow, type RevenueTracking, type InsertRevenueTracking,
  type AiUsageLog, type InsertAiUsageLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Clients
  getClients(userId: number): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Projects
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByClient(clientId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // AI Tools
  getAiTools(userId: number): Promise<AiTool[]>;
  getAiTool(id: number): Promise<AiTool | undefined>;
  createAiTool(aiTool: InsertAiTool): Promise<AiTool>;
  updateAiTool(id: number, aiTool: Partial<InsertAiTool>): Promise<AiTool>;
  deleteAiTool(id: number): Promise<void>;
  
  // Prompts
  getPrompts(userId: number): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: Partial<InsertPrompt>): Promise<Prompt>;
  deletePrompt(id: number): Promise<void>;
  
  // Knowledge Base
  getKnowledgeBase(userId: number): Promise<KnowledgeBase[]>;
  getKnowledgeBaseItem(id: number): Promise<KnowledgeBase | undefined>;
  createKnowledgeBase(item: InsertKnowledgeBase): Promise<KnowledgeBase>;
  updateKnowledgeBase(id: number, item: Partial<InsertKnowledgeBase>): Promise<KnowledgeBase>;
  deleteKnowledgeBase(id: number): Promise<void>;
  
  // Automation Workflows
  getAutomationWorkflows(userId: number): Promise<AutomationWorkflow[]>;
  getAutomationWorkflow(id: number): Promise<AutomationWorkflow | undefined>;
  createAutomationWorkflow(workflow: InsertAutomationWorkflow): Promise<AutomationWorkflow>;
  updateAutomationWorkflow(id: number, workflow: Partial<InsertAutomationWorkflow>): Promise<AutomationWorkflow>;
  deleteAutomationWorkflow(id: number): Promise<void>;
  
  // Revenue Tracking
  getRevenueTracking(userId: number): Promise<RevenueTracking[]>;
  getRevenueByDateRange(userId: number, startDate: Date, endDate: Date): Promise<RevenueTracking[]>;
  createRevenueTracking(revenue: InsertRevenueTracking): Promise<RevenueTracking>;
  updateRevenueTracking(id: number, revenue: Partial<InsertRevenueTracking>): Promise<RevenueTracking>;
  deleteRevenueTracking(id: number): Promise<void>;
  
  // AI Usage Logs
  getAiUsageLogs(userId: number): Promise<AiUsageLog[]>;
  createAiUsageLog(log: InsertAiUsageLog): Promise<AiUsageLog>;
  getAiUsageByDateRange(userId: number, startDate: Date, endDate: Date): Promise<AiUsageLog[]>;
  
  // Dashboard Analytics
  getDashboardStats(userId: number): Promise<{
    monthlyRevenue: number;
    activeProjects: number;
    aiToolsCost: number;
    hoursSaved: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Clients
  async getClients(userId: number): Promise<Client[]> {
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
  async getProjects(userId: number): Promise<Project[]> {
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
  async getAiTools(userId: number): Promise<AiTool[]> {
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
  async getPrompts(userId: number): Promise<Prompt[]> {
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
  async getKnowledgeBase(userId: number): Promise<KnowledgeBase[]> {
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
  async getAutomationWorkflows(userId: number): Promise<AutomationWorkflow[]> {
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
  async getRevenueTracking(userId: number): Promise<RevenueTracking[]> {
    return await db.select().from(revenueTracking).where(eq(revenueTracking.userId, userId)).orderBy(desc(revenueTracking.date));
  }

  async getRevenueByDateRange(userId: number, startDate: Date, endDate: Date): Promise<RevenueTracking[]> {
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
  async getAiUsageLogs(userId: number): Promise<AiUsageLog[]> {
    return await db.select().from(aiUsageLogs).where(eq(aiUsageLogs.userId, userId)).orderBy(desc(aiUsageLogs.createdAt));
  }

  async createAiUsageLog(log: InsertAiUsageLog): Promise<AiUsageLog> {
    const [newLog] = await db.insert(aiUsageLogs).values(log).returning();
    return newLog;
  }

  async getAiUsageByDateRange(userId: number, startDate: Date, endDate: Date): Promise<AiUsageLog[]> {
    return await db.select().from(aiUsageLogs).where(
      and(
        eq(aiUsageLogs.userId, userId),
        gte(aiUsageLogs.createdAt, startDate),
        lte(aiUsageLogs.createdAt, endDate)
      )
    ).orderBy(desc(aiUsageLogs.createdAt));
  }

  // Dashboard Analytics
  async getDashboardStats(userId: number): Promise<{
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
}

export const storage = new DatabaseStorage();
