import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { COOKIE_NAME } from "../shared/const";

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

  ai: router({
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
