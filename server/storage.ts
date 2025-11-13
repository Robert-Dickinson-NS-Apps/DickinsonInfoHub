import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";
import { eq, desc, ne } from "drizzle-orm";
import type { 
  Project, InsertProject,
  Article, InsertArticle,
  Conversation, InsertConversation,
  ChatMessage, InsertChatMessage,
  Resume, InsertResume,
  PageView, InsertPageView,
  ChatInteraction, InsertChatInteraction
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;

  // Articles
  getArticles(publishedOnly?: boolean): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<void>;

  // Chat conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationsBySession(sessionId: string): Promise<Conversation[]>;
  createConversation(sessionId: string, title?: string): Promise<Conversation>;
  getCurrentConversation(sessionId: string): Promise<Conversation | undefined>;
  getConversationMessages(conversationId: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Resume
  getActiveResume(): Promise<Resume | undefined>;
  uploadResume(resume: InsertResume): Promise<Resume>;

  // Analytics
  trackPageView(view: InsertPageView): Promise<PageView>;
  trackChatInteraction(interaction: InsertChatInteraction): Promise<ChatInteraction>;
  getAnalytics(): Promise<{ pageViews: PageView[]; chatInteractions: ChatInteraction[] }>;
}

export class DbStorage implements IStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(schema.projects).orderBy(desc(schema.projects.displayOrder));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await db.select().from(schema.projects)
      .where(eq(schema.projects.featured, true))
      .orderBy(desc(schema.projects.displayOrder));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const results = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
    return results[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const results = await db.insert(schema.projects).values(project).returning();
    return results[0];
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const results = await db.update(schema.projects)
      .set(project)
      .where(eq(schema.projects.id, id))
      .returning();
    return results[0];
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
  }

  // Articles
  async getArticles(publishedOnly = true): Promise<Article[]> {
    if (publishedOnly) {
      return await db.select().from(schema.articles)
        .where(eq(schema.articles.published, true))
        .orderBy(desc(schema.articles.publishedAt));
    }
    return await db.select().from(schema.articles).orderBy(desc(schema.articles.createdAt));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const results = await db.select().from(schema.articles).where(eq(schema.articles.id, id));
    return results[0];
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const results = await db.select().from(schema.articles).where(eq(schema.articles.slug, slug));
    return results[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const results = await db.insert(schema.articles).values(article).returning();
    return results[0];
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const results = await db.update(schema.articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(schema.articles.id, id))
      .returning();
    return results[0];
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(schema.articles).where(eq(schema.articles.id, id));
  }

  // Chat conversations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const results = await db.select().from(schema.conversations).where(eq(schema.conversations.id, id));
    return results[0];
  }

  async getConversationsBySession(sessionId: string): Promise<Conversation[]> {
    return await db.select().from(schema.conversations)
      .where(eq(schema.conversations.sessionId, sessionId))
      .orderBy(desc(schema.conversations.createdAt));
  }

  async createConversation(sessionId: string, title?: string): Promise<Conversation> {
    // Always create a new conversation - UI decides when to start fresh chat
    const results = await db.insert(schema.conversations)
      .values({ sessionId, title })
      .returning();
    return results[0];
  }

  async getCurrentConversation(sessionId: string): Promise<Conversation | undefined> {
    // Get the most recent conversation for this session
    const results = await db.select().from(schema.conversations)
      .where(eq(schema.conversations.sessionId, sessionId))
      .orderBy(desc(schema.conversations.createdAt))
      .limit(1);
    
    return results[0];
  }

  async getConversationMessages(conversationId: number): Promise<ChatMessage[]> {
    return await db.select().from(schema.chatMessages)
      .where(eq(schema.chatMessages.conversationId, conversationId))
      .orderBy(schema.chatMessages.createdAt);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const results = await db.insert(schema.chatMessages).values(message).returning();
    return results[0];
  }

  // Resume
  async getActiveResume(): Promise<Resume | undefined> {
    const results = await db.select().from(schema.resume)
      .where(eq(schema.resume.active, true))
      .orderBy(desc(schema.resume.uploadedAt))
      .limit(1);
    return results[0];
  }

  async uploadResume(resume: InsertResume): Promise<Resume> {
    // Insert new active resume first (Neon HTTP doesn't support transactions)
    const results = await db.insert(schema.resume).values(resume).returning();
    const newResume = results[0];
    
    // Then deactivate all other resumes (excluding the newly created one)
    await db.update(schema.resume)
      .set({ active: false })
      .where(ne(schema.resume.id, newResume.id));
    
    return newResume;
  }

  // Analytics
  async trackPageView(view: InsertPageView): Promise<PageView> {
    const results = await db.insert(schema.pageViews).values(view).returning();
    return results[0];
  }

  async trackChatInteraction(interaction: InsertChatInteraction): Promise<ChatInteraction> {
    const results = await db.insert(schema.chatInteractions).values(interaction).returning();
    return results[0];
  }

  async getAnalytics(): Promise<{ pageViews: PageView[]; chatInteractions: ChatInteraction[] }> {
    const pageViews = await db.select().from(schema.pageViews)
      .orderBy(desc(schema.pageViews.timestamp))
      .limit(1000);
    
    const chatInteractions = await db.select().from(schema.chatInteractions)
      .orderBy(desc(schema.chatInteractions.timestamp))
      .limit(1000);

    return { pageViews, chatInteractions };
  }
}

export const storage = new DbStorage();
