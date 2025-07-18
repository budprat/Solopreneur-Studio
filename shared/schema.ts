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
  experiments: many(experiments),
  insights: many(insights),
  collaborations: many(collaborations),
}));

// Experiments table for AI Experimentation Lab
export const experiments = pgTable("experiments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  basePrompt: text("base_prompt").notNull(),
  variations: text("variations").array().notNull(),
  models: text("models").array().notNull(),
  results: jsonb("results").default([]),
  status: text("status").notNull().default("draft"), // draft, running, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Growth Insights table for Strategic Growth Advisor
export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // opportunity, risk, optimization, trend
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(), // high, medium, low
  priority: integer("priority").notNull(),
  actionItems: text("action_items").array().notNull(),
  timeframe: text("timeframe").notNull(),
  potentialValue: decimal("potential_value", { precision: 10, scale: 2 }).default("0"),
  confidence: integer("confidence").notNull(), // 0-100
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collaborations table for Real-time Collaboration
export const collaborations = pgTable("collaborations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  type: text("type").notNull(), // document, project, workflow
  permissions: text("permissions").notNull(), // read, write, admin
  invitedEmail: text("invited_email"),
  status: text("status").notNull().default("pending"), // pending, active, revoked
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Intelligence Metrics table
export const businessMetrics = pgTable("business_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  metricType: text("metric_type").notNull(), // revenue, clients, projects, ai_usage, productivity
  metricName: text("metric_name").notNull(),
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  period: text("period").notNull(), // daily, weekly, monthly, yearly
  date: timestamp("date").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Management tables
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // text, image, video, audio
  status: text("status").notNull().default("draft"), // draft, review, published
  platform: text("platform"),
  tags: text("tags").array(),
  scheduledFor: timestamp("scheduled_for"),
  performance: jsonb("performance").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email Intelligence tables
export const emailAnalyses = pgTable("email_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  sender: text("sender").notNull(),
  recipient: text("recipient").notNull(),
  content: text("content").notNull(),
  receivedAt: timestamp("received_at").notNull(),
  urgency: text("urgency").notNull(), // low, medium, high, critical
  category: text("category").notNull(), // project_request, follow_up, payment, support, other
  extractedData: jsonb("extracted_data").default({}),
  sentiment: text("sentiment").notNull(), // positive, neutral, negative
  suggestedActions: text("suggested_actions").array(),
  autoResponse: text("auto_response"),
  status: text("status").notNull().default("unread"), // unread, read, responded, archived
  createdAt: timestamp("created_at").defaultNow(),
});

// Task Management for Intelligent Scheduling
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  estimatedHours: integer("estimated_hours").notNull(),
  deadline: timestamp("deadline"),
  project: text("project"),
  energyRequired: text("energy_required").notNull().default("medium"), // low, medium, high
  scheduledFor: timestamp("scheduled_for"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  focusTimeRequired: boolean("focus_time_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Digital Asset Management
export const digitalAssets = pgTable("digital_assets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  type: text("type").notNull(), // image, video, audio, document, other
  size: integer("size").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags").array(),
  aiGeneratedTags: text("ai_generated_tags").array(),
  description: text("description"),
  usage: jsonb("usage").default({}),
  metadata: jsonb("metadata").default({}),
  aiAnalysis: jsonb("ai_analysis").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Knowledge Graph entities
export const knowledgeEntities = pgTable("knowledge_entities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // person, project, concept, skill, tool, client, document, insight
  description: text("description").notNull(),
  importance: integer("importance").notNull(), // 0-100
  connectionCount: integer("connection_count").default(0),
  tags: text("tags").array(),
  metadata: jsonb("metadata").default({}),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge Graph connections
export const knowledgeConnections = pgTable("knowledge_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fromEntity: integer("from_entity").references(() => knowledgeEntities.id).notNull(),
  toEntity: integer("to_entity").references(() => knowledgeEntities.id).notNull(),
  relationshipType: text("relationship_type").notNull(), // related_to, depends_on, created_by, used_in, influences, part_of
  strength: integer("strength").notNull(), // 0-100
  context: text("context"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
});

// Content Pipeline automation
export const contentPipelines = pgTable("content_pipelines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  stages: jsonb("stages").default([]),
  status: text("status").notNull().default("active"), // active, paused, completed, failed
  progress: integer("progress").default(0),
  totalRuns: integer("total_runs").default(0),
  successRate: integer("success_rate").default(0),
  averageTime: integer("average_time").default(0),
  lastRun: timestamp("last_run"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export const experimentsRelations = relations(experiments, ({ one }) => ({
  user: one(users, { fields: [experiments.userId], references: [users.id] }),
}));

export const insightsRelations = relations(insights, ({ one }) => ({
  user: one(users, { fields: [insights.userId], references: [users.id] }),
}));

export const collaborationsRelations = relations(collaborations, ({ one }) => ({
  user: one(users, { fields: [collaborations.userId], references: [users.id] }),
  project: one(projects, { fields: [collaborations.projectId], references: [projects.id] }),
}));

export const businessMetricsRelations = relations(businessMetrics, ({ one }) => ({
  user: one(users, { fields: [businessMetrics.userId], references: [users.id] }),
}));

// New table relations
export const contentItemsRelations = relations(contentItems, ({ one }) => ({
  user: one(users, { fields: [contentItems.userId], references: [users.id] }),
}));

export const emailAnalysesRelations = relations(emailAnalyses, ({ one }) => ({
  user: one(users, { fields: [emailAnalyses.userId], references: [users.id] }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const digitalAssetsRelations = relations(digitalAssets, ({ one }) => ({
  user: one(users, { fields: [digitalAssets.userId], references: [users.id] }),
}));

export const knowledgeEntitiesRelations = relations(knowledgeEntities, ({ one, many }) => ({
  user: one(users, { fields: [knowledgeEntities.userId], references: [users.id] }),
  connectionsFrom: many(knowledgeConnections, { relationName: "fromEntity" }),
  connectionsTo: many(knowledgeConnections, { relationName: "toEntity" }),
}));

export const knowledgeConnectionsRelations = relations(knowledgeConnections, ({ one }) => ({
  user: one(users, { fields: [knowledgeConnections.userId], references: [users.id] }),
  fromEntity: one(knowledgeEntities, { fields: [knowledgeConnections.fromEntity], references: [knowledgeEntities.id], relationName: "fromEntity" }),
  toEntity: one(knowledgeEntities, { fields: [knowledgeConnections.toEntity], references: [knowledgeEntities.id], relationName: "toEntity" }),
}));

export const contentPipelinesRelations = relations(contentPipelines, ({ one }) => ({
  user: one(users, { fields: [contentPipelines.userId], references: [users.id] }),
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

// New advanced feature schema exports
export const insertExperimentSchema = createInsertSchema(experiments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollaborationSchema = createInsertSchema(collaborations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessMetricSchema = createInsertSchema(businessMetrics).omit({
  id: true,
  createdAt: true,
});

export type Experiment = typeof experiments.$inferSelect;
export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Collaboration = typeof collaborations.$inferSelect;
export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;
export type BusinessMetric = typeof businessMetrics.$inferSelect;
export type InsertBusinessMetric = z.infer<typeof insertBusinessMetricSchema>;

// New feature schema exports
export const insertContentItemSchema = createInsertSchema(contentItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmailAnalysisSchema = createInsertSchema(emailAnalyses).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDigitalAssetSchema = createInsertSchema(digitalAssets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertKnowledgeEntitySchema = createInsertSchema(knowledgeEntities).omit({ id: true, createdAt: true, lastUpdated: true });
export const insertKnowledgeConnectionSchema = createInsertSchema(knowledgeConnections).omit({ id: true, discoveredAt: true });
export const insertContentPipelineSchema = createInsertSchema(contentPipelines).omit({ id: true, createdAt: true, updatedAt: true });

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type EmailAnalysis = typeof emailAnalyses.$inferSelect;
export type InsertEmailAnalysis = z.infer<typeof insertEmailAnalysisSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type DigitalAsset = typeof digitalAssets.$inferSelect;
export type InsertDigitalAsset = z.infer<typeof insertDigitalAssetSchema>;
export type KnowledgeEntity = typeof knowledgeEntities.$inferSelect;
export type InsertKnowledgeEntity = z.infer<typeof insertKnowledgeEntitySchema>;
export type KnowledgeConnection = typeof knowledgeConnections.$inferSelect;
export type InsertKnowledgeConnection = z.infer<typeof insertKnowledgeConnectionSchema>;
export type ContentPipeline = typeof contentPipelines.$inferSelect;
export type InsertContentPipeline = z.infer<typeof insertContentPipelineSchema>;
