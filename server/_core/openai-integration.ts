import OpenAI from "openai";
import { ENV } from "./env";

const client = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function generateAIResponse(
  systemPrompt: string,
  messages: ChatMessage[],
  toolId: string,
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in response");
    }

    return content;
  } catch (error) {
    console.error(`OpenAI error for tool ${toolId}:`, error);
    throw error;
  }
}

export async function validateOpenAIKey(): Promise<boolean> {
  try {
    const models = await client.models.list();
    return models.data.length > 0;
  } catch (error) {
    console.error("OpenAI validation failed:", error);
    return false;
  }
}
