import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateAIResponse } from "./_core/openai-integration";
import { COOKIE_NAME } from "../shared/const";
import { conversations, messages, favorites, type InsertConversation, type InsertMessage, type InsertFavorite } from "../drizzle/schema";
import { eq, like, gte, lte, and } from "drizzle-orm";
import { getDb } from "./db";
import { trackToolUsage, getUserStats, createShareToken, getSharedConversation, cacheResponse, getCachedResponse } from "./_core/analytics";
import { createWebhook, triggerWebhook, updateUserPreferences, getRecommendedTools, addCollaborator, createCollaborationInvite, acceptCollaborationInvite, getCollaborators, removeCollaborator } from "./_core/advanced-features";

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

  favorites: router({
    add: protectedProcedure
      .input(z.object({ toolId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db || !ctx.user?.id) return { success: false };

        try {
          await db.insert(favorites).values({
            userId: ctx.user.id,
            toolId: input.toolId,
          });
          return { success: true };
        } catch (error) {
          console.error("Failed to add favorite:", error);
          return { success: false };
        }
      }),

    remove: protectedProcedure
      .input(z.object({ toolId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db || !ctx.user?.id) return { success: false };

        try {
          await db.delete(favorites).where(
            and(
              eq(favorites.userId, ctx.user.id),
              eq(favorites.toolId, input.toolId)
            )
          );
          return { success: true };
        } catch (error) {
          console.error("Failed to remove favorite:", error);
          return { success: false };
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db || !ctx.user?.id) return [];

      try {
        const result = await db.select().from(favorites).where(eq(favorites.userId, ctx.user.id));
        return result;
      } catch (error) {
        console.error("Failed to list favorites:", error);
        return [];
      }
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

        try {
          // Try OpenAI first if API key is available
          const content = await generateAIResponse(
            systemPrompt,
            messages,
            input.toolId
          );
          return { content };
        } catch (openaiError) {
          console.warn("OpenAI failed, falling back to built-in LLM", openaiError);
          
          // Fallback to built-in LLM
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
        }
      }),
  }),

  analytics: router({
    trackUsage: protectedProcedure
      .input(z.object({ toolId: z.string(), timeSpent: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false };
        const result = await trackToolUsage(ctx.user.id, input.toolId, input.timeSpent);
        return { success: !!result };
      }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      return await getUserStats(ctx.user.id);
    }),
  }),

  sharing: router({
    createShareLink: protectedProcedure
      .input(z.object({ conversationId: z.number(), expiresIn: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false, token: null };
        const token = await createShareToken(input.conversationId, ctx.user.id, input.expiresIn);
        return { success: !!token, token };
      }),

    getShared: publicProcedure
      .input(z.object({ shareToken: z.string() }))
      .query(async ({ input }) => {
        return await getSharedConversation(input.shareToken);
      }),
  }),

  offlineCache: router({
    cache: protectedProcedure
      .input(z.object({ toolId: z.string(), response: z.string(), expiresIn: z.number().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false };
        const result = await cacheResponse(ctx.user.id, input.toolId, input.response, input.expiresIn);
        return { success: !!result };
      }),

    get: protectedProcedure
      .input(z.object({ toolId: z.string() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user?.id) return null;
        return await getCachedResponse(ctx.user.id, input.toolId);
      }),
  }),

  webhooks: router({
    create: protectedProcedure
      .input(z.object({ url: z.string().url(), events: z.array(z.string()) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false };
        const result = await createWebhook(ctx.user.id, input.url, input.events);
        return { success: !!result };
      }),
  }),

  recommendations: router({
    getRecommended: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      await updateUserPreferences(ctx.user.id);
      return await getRecommendedTools(ctx.user.id);
    }),
  }),

  collaboration: router({
    addCollaborator: protectedProcedure
      .input(z.object({ conversationId: z.number(), collaboratorId: z.number(), permission: z.enum(["read", "write"]) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false };
        const result = await addCollaborator(input.conversationId, ctx.user.id, input.collaboratorId, input.permission);
        return { success: !!result };
      }),

    createInvite: protectedProcedure
      .input(z.object({ conversationId: z.number(), email: z.string().email(), permission: z.enum(["read", "write"]) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false, token: null };
        const token = await createCollaborationInvite(input.conversationId, input.email, ctx.user.id, input.permission);
        return { success: !!token, token };
      }),

    acceptInvite: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false };
        const result = await acceptCollaborationInvite(input.token, ctx.user.id);
        return { success: !!result };
      }),

    getCollaborators: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        return await getCollaborators(input.conversationId);
      }),

    removeCollaborator: protectedProcedure
      .input(z.object({ collaborationId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) return { success: false };
        const result = await removeCollaborator(input.collaborationId);
        return { success: !!result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
