import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("solopreneur"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  company: text("company"),
  avatar: text("avatar"),
  status: text("status").notNull().default("active"), // active, inactive, churned
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  clientId: integer("client_id").references(() => clients.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, completed, paused, cancelled
  progress: integer("progress").default(0), // 0-100
  budget: decimal("budget", { precision: 10, scale: 2 }),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Tools table
export const aiTools = pgTable("ai_tools", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  provider: text("provider").notNull(), // openai, anthropic, google, etc.
  apiKey: text("api_key"),
  monthlyBudget: decimal("monthly_budget", { precision: 10, scale: 2 }),
  currentSpend: decimal("current_spend", { precision: 10, scale: 2 }).default("0"),
  tokensUsed: integer("tokens_used").default(0),
  requestsCount: integer("requests_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Prompts table
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  version: text("version").default("1.0"),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0"),
  usageCount: integer("usage_count").default(0),
  aiToolId: integer("ai_tool_id").references(() => aiTools.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Knowledge Base table
export const knowledgeBase = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // article, note, resource, template
  category: text("category"),
  tags: text("tags").array(),
  projectId: integer("project_id").references(() => projects.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Automation Workflows table
export const automationWorkflows = pgTable("automation_workflows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: text("trigger").notNull(), // email, schedule, webhook, etc.
  actions: jsonb("actions").notNull(), // Array of action objects
  isActive: boolean("is_active").default(true),
  triggerCount: integer("trigger_count").default(0),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Revenue Tracking table
export const revenueTracking = pgTable("revenue_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  clientId: integer("client_id").references(() => clients.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // invoice, payment, expense
  description: text("description"),
  date: timestamp("date").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Usage Logs table
export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  aiToolId: integer("ai_tool_id").references(() => aiTools.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  promptId: integer("prompt_id").references(() => prompts.id),
  tokensUsed: integer("tokens_used").default(0),
  cost: decimal("cost", { precision: 10, scale: 4 }).default("0"),
  responseTime: integer("response_time"), // in milliseconds
  success: boolean("success").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  projects: many(projects),
  aiTools: many(aiTools),
  prompts: many(prompts),
  knowledgeBase: many(knowledgeBase),
  automationWorkflows: many(automationWorkflows),
  revenueTracking: many(revenueTracking),
  aiUsageLogs: many(aiUsageLogs),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  projects: many(projects),
  revenueTracking: many(revenueTracking),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  knowledgeBase: many(knowledgeBase),
  revenueTracking: many(revenueTracking),
  aiUsageLogs: many(aiUsageLogs),
}));

export const aiToolsRelations = relations(aiTools, ({ one, many }) => ({
  user: one(users, { fields: [aiTools.userId], references: [users.id] }),
  prompts: many(prompts),
  aiUsageLogs: many(aiUsageLogs),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  user: one(users, { fields: [prompts.userId], references: [users.id] }),
  aiTool: one(aiTools, { fields: [prompts.aiToolId], references: [aiTools.id] }),
  aiUsageLogs: many(aiUsageLogs),
}));

export const knowledgeBaseRelations = relations(knowledgeBase, ({ one }) => ({
  user: one(users, { fields: [knowledgeBase.userId], references: [users.id] }),
  project: one(projects, { fields: [knowledgeBase.projectId], references: [projects.id] }),
}));

export const automationWorkflowsRelations = relations(automationWorkflows, ({ one }) => ({
  user: one(users, { fields: [automationWorkflows.userId], references: [users.id] }),
}));

export const revenueTrackingRelations = relations(revenueTracking, ({ one }) => ({
  user: one(users, { fields: [revenueTracking.userId], references: [users.id] }),
  project: one(projects, { fields: [revenueTracking.projectId], references: [projects.id] }),
  client: one(clients, { fields: [revenueTracking.clientId], references: [clients.id] }),
}));

export const aiUsageLogsRelations = relations(aiUsageLogs, ({ one }) => ({
  user: one(users, { fields: [aiUsageLogs.userId], references: [users.id] }),
  aiTool: one(aiTools, { fields: [aiUsageLogs.aiToolId], references: [aiTools.id] }),
  project: one(projects, { fields: [aiUsageLogs.projectId], references: [projects.id] }),
  prompt: one(prompts, { fields: [aiUsageLogs.promptId], references: [prompts.id] }),
}));

// Schema types
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  avatar: true,
  role: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiToolSchema = createInsertSchema(aiTools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAutomationWorkflowSchema = createInsertSchema(automationWorkflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRevenueTrackingSchema = createInsertSchema(revenueTracking).omit({
  id: true,
  createdAt: true,
});

export const insertAiUsageLogSchema = createInsertSchema(aiUsageLogs).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type AiTool = typeof aiTools.$inferSelect;
export type InsertAiTool = z.infer<typeof insertAiToolSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type AutomationWorkflow = typeof automationWorkflows.$inferSelect;
export type InsertAutomationWorkflow = z.infer<typeof insertAutomationWorkflowSchema>;
export type RevenueTracking = typeof revenueTracking.$inferSelect;
export type InsertRevenueTracking = z.infer<typeof insertRevenueTrackingSchema>;
export type AiUsageLog = typeof aiUsageLogs.$inferSelect;
export type InsertAiUsageLog = z.infer<typeof insertAiUsageLogSchema>;
