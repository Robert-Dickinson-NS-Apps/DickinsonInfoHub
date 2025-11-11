import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { chatWithDeepSeek } from "./openrouter";

const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = sendMessageSchema.parse(req.body);

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

  const httpServer = createServer(app);

  return httpServer;
}
