import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { chatWithDeepSeek } from "./openrouter";
import { storage } from "./storage";
import { insertProjectSchema, insertArticleSchema, sendMessageSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "server/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "server/uploads")));

  // Image upload endpoint with proper error handling
  app.post("/api/upload", (req, res) => {
    upload.single("image")(req, res, (err) => {
      // Handle Multer errors
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FILE_SIZE":
              return res.status(400).json({ 
                error: "File too large. Maximum size is 5MB",
                code: "FILE_TOO_LARGE"
              });
            case "LIMIT_UNEXPECTED_FILE":
              return res.status(400).json({ 
                error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed",
                code: "INVALID_FILE_TYPE"
              });
            default:
              return res.status(400).json({ 
                error: "Upload failed. Please try again.",
                code: "UPLOAD_ERROR"
              });
          }
        }
        
        // Handle non-Multer errors
        return res.status(500).json({ 
          error: err.message || "Upload failed",
          code: "UPLOAD_ERROR"
        });
      }

      // No error but no file
      if (!req.file) {
        return res.status(400).json({ 
          error: "No file uploaded",
          code: "NO_FILE"
        });
      }

      // Success
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl, code: "SUCCESS" });
    });
  });
  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, data);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = z.object({ message: z.string().min(1) }).parse(req.body);

      const systemPrompt = `You are an AI assistant representing Robert Dickinson, an expert in Storm Water Management Modeling (SWMM) and environmental engineering. Robert specializes in:

- SWMM (Storm Water Management Model) for urban drainage systems
- Water quality management and flood control
- Computational modeling and data analysis for water flow patterns
- Infrastructure engineering for water treatment facilities
- Sustainable urban drainage systems (SUDS)

When answering questions:
1. Be professional, knowledgeable, and helpful
2. Focus on SWMM, water management, and environmental engineering topics
3. If asked about Robert's work or projects, reference his expertise in the areas mentioned above
4. Keep responses concise but informative
5. If questions are outside your expertise area, politely redirect to relevant topics

Remember: You're representing Robert Dickinson's professional expertise and helping visitors learn about his work.`;

      const reply = await chatWithDeepSeek(message, systemPrompt);

      res.json({ reply });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: error.errors 
        });
      }

      console.error("Chat error:", error);
      res.status(500).json({ 
        error: "Failed to process chat message",
        message: "Please try again in a moment"
      });
    }
  });

  // Error handling middleware - must be after all routes
  app.use((err: any, req: any, res: any, next: any) => {
    // Handle Multer errors that weren't caught in route handlers
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          return res.status(400).json({ 
            error: "File too large. Maximum size is 5MB",
            code: "FILE_TOO_LARGE"
          });
        case "LIMIT_UNEXPECTED_FILE":
          return res.status(400).json({ 
            error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed",
            code: "INVALID_FILE_TYPE"
          });
        default:
          return res.status(400).json({ 
            error: "Upload failed. Please try again.",
            code: "UPLOAD_ERROR"
          });
      }
    }
    
    // Pass other errors to default handler
    next(err);
  });

  const httpServer = createServer(app);

  return httpServer;
}
