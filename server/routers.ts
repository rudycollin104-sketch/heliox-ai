import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { COOKIE_NAME } from "../shared/const";
import { conversations, messages, type InsertConversation, type InsertMessage } from "../drizzle/schema";
import { eq, like, gte, lte, and } from "drizzle-orm";
import { getDb } from "./db";

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: "ok", app: "Heliox AI" })),

  auth: router({
    logout: protectedProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, {
        maxAge: -1,
        secure: true,
        sameSite: "none",
        httpOnly: true,
        path: "/",
      });
      return { success: true };
    }),
  }),

  conversations: router({
    save: protectedProcedure
      .input(
        z.object({
          toolId: z.string(),
          toolName: z.string(),
          title: z.string().optional(),
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db || !ctx.user?.id) return { success: false };

        try {
          await db.insert(conversations).values({
            userId: ctx.user.id,
            toolId: input.toolId,
            toolName: input.toolName,
            title: input.title || `Chat with ${input.toolName}`,
            messageCount: input.messages.length,
          });

          return { success: true };
        } catch (error) {
          console.error("Failed to save conversation:", error);
          return { success: false };
        }
      }),

    list: protectedProcedure
      .input(
        z.object({
          search: z.string().optional(),
          toolId: z.string().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db || !ctx.user?.id) return [];

        try {
          let whereClause = eq(conversations.userId, ctx.user.id);

          if (input.search) {
            whereClause = and(whereClause, like(conversations.title, `%${input.search}%`))!;
          }
          if (input.toolId) {
            whereClause = and(whereClause, eq(conversations.toolId, input.toolId))!;
          }

          const result = await db.select().from(conversations).where(whereClause).orderBy(conversations.updatedAt);
          return result;
        } catch (error) {
          console.error("Failed to list conversations:", error);
          return [];
        }
      }),
  }),

  ai: router({
    chatStream: publicProcedure
      .input(
        z.object({
          toolId: z.string(),
          systemPrompt: z.string(),
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const { systemPrompt, messages } = input;

        const llmMessages = [
          { role: "system" as const, content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        // Return a marker that indicates streaming should be used
        return { streaming: true, toolId: input.toolId };
      }),

    chat: publicProcedure
      .input(
        z.object({
          toolId: z.string(),
          systemPrompt: z.string(),
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const { systemPrompt, messages } = input;

        const llmMessages = [
          { role: "system" as const, content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        const response = await invokeLLM({
          messages: llmMessages,
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const content = typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
          ? rawContent.map((c: any) => c.text ?? "").join("")
          : "Désolé, je n'ai pas pu générer une réponse.";

        return { content };
      }),
  }),
});

export type AppRouter = typeof appRouter;
