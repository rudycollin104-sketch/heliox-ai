import { ENV } from "./env";

interface OpenAIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateOpenAIResponse(
  messages: OpenAIMessage[],
  toolContext: string
): Promise<string> {
  if (!ENV.OPENAI_API_KEY || ENV.OPENAI_API_KEY === "") {
    // Fallback to built-in LLM if OpenAI key is not configured
    return generateFallbackResponse(toolContext);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant IA spécialisé dans: ${toolContext}. Réponds en français de manière utile, créative et précise.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, response.statusText);
      return generateFallbackResponse(toolContext);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return data.choices[0]?.message?.content || generateFallbackResponse(toolContext);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return generateFallbackResponse(toolContext);
  }
}

export async function* generateOpenAIResponseStream(
  messages: OpenAIMessage[],
  toolContext: string
): AsyncGenerator<string, void, unknown> {
  if (!ENV.OPENAI_API_KEY || ENV.OPENAI_API_KEY === "") {
    // Fallback to built-in LLM if OpenAI key is not configured
    yield generateFallbackResponse(toolContext);
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant IA spécialisé dans: ${toolContext}. Réponds en français de manière utile, créative et précise.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, response.statusText);
      yield generateFallbackResponse(toolContext);
      return;
    }

    if (!response.body) {
      yield generateFallbackResponse(toolContext);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data) as {
              choices: Array<{ delta: { content?: string } }>;
            };
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (error) {
    console.error("Error calling OpenAI API stream:", error);
    yield generateFallbackResponse(toolContext);
  }
}

function generateFallbackResponse(toolContext: string): string {
  const responses: Record<string, string> = {
    "Rappeur": "🎤 Yo, c'est un vrai flow que tu viens de demander! Je vais te proposer des rimes chaudes et des beats qui vont te faire danser.",
    "Compositeur Musical": "🎵 La musique est l'art suprême! Je vais te créer une composition originale avec des mélodies captivantes.",
    "Générateur d'Images": "🖼️ Je vais créer une image magnifique basée sur ta description avec des détails époustouflants.",
    "Coach Sportif": "💪 C'est l'heure de l'entraînement! Je vais te proposer un programme personnalisé pour atteindre tes objectifs.",
    "Traducteur": "🌍 Je vais traduire ton texte avec précision dans la langue souhaitée.",
    "Assistant Scolaire": "📚 Je vais t'aider à comprendre ce concept complexe avec des explications claires et des exemples.",
    "Chatbot Service Client": "👋 Bienvenue! Comment puis-je t'aider aujourd'hui?",
  };

  return responses[toolContext] || `Je suis ton assistant IA pour: ${toolContext}. Comment puis-je t'aider?`;
}
