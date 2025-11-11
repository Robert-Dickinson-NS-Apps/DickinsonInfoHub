import { z } from "zod";

// Chat message schema
export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
