import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
          subject: z.string().optional(),
          mode: z.enum(["general", "homework", "exam", "doubt"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          let systemPrompt =
            "You are StudyAI, a helpful AI tutor for students. Provide clear, concise, and educational responses.";

          if (input.subject) {
            systemPrompt += ` You are specialized in ${input.subject}.`;
          }

          if (input.mode === "homework") {
            systemPrompt +=
              " Help the student understand the concept and solve problems step-by-step.";
          } else if (input.mode === "exam") {
            systemPrompt +=
              " Provide concise answers suitable for exam preparation.";
          } else if (input.mode === "doubt") {
            systemPrompt +=
              " Focus on clarifying misconceptions and explaining difficult concepts.";
          }

          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              ...input.messages.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
              })),
            ],
          });

          const aiResponse =
            response.choices[0]?.message?.content ||
            "Unable to generate response";

          return {
            success: true,
            response: aiResponse,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error("Chat error:", error);
          return {
            success: false,
            response: "Sorry, I encountered an error. Please try again.",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),

  studyTools: router({
    generateNotes: publicProcedure
      .input(
        z.object({
          topic: z.string().min(1),
          subject: z.string().min(1),
          detailLevel: z
            .enum(["brief", "standard", "detailed"])
            .default("standard"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const detailInstructions = {
            brief:
              "Provide a concise summary with key points only (2-3 paragraphs).",
            standard:
              "Provide comprehensive notes with main concepts and examples (5-7 paragraphs).",
            detailed:
              "Provide detailed notes with all concepts, examples, and related topics (10+ paragraphs).",
          };

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an expert ${input.subject} tutor. Generate well-structured study notes. ${detailInstructions[input.detailLevel]}`,
              },
              {
                role: "user",
                content: `Generate study notes for: ${input.topic} (Subject: ${input.subject})`,
              },
            ],
          });

          const notes =
            response.choices[0]?.message?.content ||
            "Unable to generate notes";

          return {
            success: true,
            notes,
            topic: input.topic,
            subject: input.subject,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error("Notes generation error:", error);
          return {
            success: false,
            notes: "Unable to generate notes. Please try again.",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),

    generateQuiz: publicProcedure
      .input(
        z.object({
          topic: z.string().min(1),
          subject: z.string().min(1),
          questionCount: z.number().min(1).max(20).default(5),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an expert ${input.subject} teacher. Generate ${input.questionCount} multiple-choice questions about "${input.topic}". For each question provide the question text, four options (A, B, C, D), the correct answer, and a brief explanation.`,
              },
              {
                role: "user",
                content: `Generate ${input.questionCount} quiz questions for ${input.topic}`,
              },
            ],
          });

          const content = response.choices[0]?.message?.content || "";

          return {
            success: true,
            content,
            topic: input.topic,
            subject: input.subject,
            count: input.questionCount,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error("Quiz generation error:", error);
          return {
            success: false,
            content: "",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),

    explain: publicProcedure
      .input(
        z.object({
          content: z.string().min(1),
          level: z.enum(["5year", "10year", "exam"]).default("10year"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const levelInstructions = {
            "5year":
              "Explain this as if you're talking to a 5-year-old. Use very simple words and everyday examples.",
            "10year":
              "Explain this as if you're talking to a 10-year-old. Use simple language with some technical terms.",
            exam: "Explain this in a way suitable for exam preparation. Include key concepts and important details.",
          };

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an excellent educator. ${levelInstructions[input.level]}`,
              },
              {
                role: "user",
                content: `Please explain: ${input.content}`,
              },
            ],
          });

          const explanation =
            response.choices[0]?.message?.content ||
            "Unable to generate explanation";

          return {
            success: true,
            explanation,
            level: input.level,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error("Explanation error:", error);
          return {
            success: false,
            explanation: "Unable to generate explanation. Please try again.",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),

    generateImportantQuestions: publicProcedure
      .input(
        z.object({
          topic: z.string().min(1),
          subject: z.string().min(1),
          count: z.number().min(1).max(20).default(10),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an expert ${input.subject} teacher. Generate ${input.count} important questions likely to appear in exams for: "${input.topic}".`,
              },
              {
                role: "user",
                content: `Generate ${input.count} important questions for ${input.topic}`,
              },
            ],
          });

          const content = response.choices[0]?.message?.content || "";

          return {
            success: true,
            content,
            topic: input.topic,
            subject: input.subject,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error("Important questions error:", error);
          return {
            success: false,
            content: "",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),

    generateFormulaSheet: publicProcedure
      .input(
        z.object({
          topic: z.string().min(1),
          subject: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an expert ${input.subject} teacher. Generate a comprehensive formula sheet for "${input.topic}". Include all important formulas, their meanings, and when to use them.`,
              },
              {
                role: "user",
                content: `Generate a formula sheet for ${input.topic}`,
              },
            ],
          });

          const formulas =
            response.choices[0]?.message?.content ||
            "Unable to generate formula sheet";

          return {
            success: true,
            formulas,
            topic: input.topic,
            subject: input.subject,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error("Formula sheet error:", error);
          return {
            success: false,
            formulas: "Unable to generate formula sheet. Please try again.",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
