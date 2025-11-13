import { pgTable, serial, varchar, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects table for portfolio gallery
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: text("technologies").array().notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  projectUrl: varchar("project_url", { length: 500 }),
  featured: boolean("featured").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Blog articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Chat conversations table for history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("session_id_idx").on(table.sessionId),
}));

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Resume metadata table
export const resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  active: boolean("active").default(true),
});

export const insertResumeSchema = createInsertSchema(resume).omit({ id: true, uploadedAt: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resume.$inferSelect;

// Analytics page views
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  section: varchar("section", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({ id: true, timestamp: true });
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

// Analytics chat interactions
export const chatInteractions = pgTable("chat_interactions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  messageCount: integer("message_count").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertChatInteractionSchema = createInsertSchema(chatInteractions).omit({ id: true, timestamp: true });
export type InsertChatInteraction = z.infer<typeof insertChatInteractionSchema>;
export type ChatInteraction = typeof chatInteractions.$inferSelect;

// Legacy chat schemas for backwards compatibility
export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.number().optional(),
});

export type SendMessage = z.infer<typeof sendMessageSchema>;
