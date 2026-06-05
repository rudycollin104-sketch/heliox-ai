export const TOOL_THEMES: Record<string, { primary: string; secondary: string; icon: string }> = {
  // Musique & Audio
  rapper: { primary: "#ec4899", secondary: "#f472b6", icon: "🎤" },
  composer: { primary: "#f59e0b", secondary: "#fbbf24", icon: "🎵" },
  voice: { primary: "#8b5cf6", secondary: "#a78bfa", icon: "🎙️" },

  // Écriture & Contenu
  stories: { primary: "#06b6d4", secondary: "#22d3ee", icon: "📖" },
  social: { primary: "#10b981", secondary: "#34d399", icon: "📱" },
  grammar: { primary: "#f97316", secondary: "#fb923c", icon: "✏️" },
  legal: { primary: "#6366f1", secondary: "#818cf8", icon: "⚖️" },

  // Jeux & Divertissement
  rpg: { primary: "#d946ef", secondary: "#f0abfc", icon: "🗡️" },
  quests: { primary: "#06b6d4", secondary: "#22d3ee", icon: "🗺️" },
  scenarios: { primary: "#f59e0b", secondary: "#fbbf24", icon: "🎬" },
  companion: { primary: "#8b5cf6", secondary: "#a78bfa", icon: "🤖" },

  // Création Visuelle
  images: { primary: "#ec4899", secondary: "#f472b6", icon: "🎨" },
  logos: { primary: "#06b6d4", secondary: "#22d3ee", icon: "✨" },

  // Productivité & Business
  productivity: { primary: "#10b981", secondary: "#34d399", icon: "📋" },
  finance: { primary: "#f59e0b", secondary: "#fbbf24", icon: "💰" },
  customer: { primary: "#06b6d4", secondary: "#22d3ee", icon: "💬" },
  coding: { primary: "#6366f1", secondary: "#818cf8", icon: "💻" },

  // Apprentissage & Éducation
  homework: { primary: "#10b981", secondary: "#34d399", icon: "📚" },
  translator: { primary: "#8b5cf6", secondary: "#a78bfa", icon: "🌍" },
  languages: { primary: "#06b6d4", secondary: "#22d3ee", icon: "🗣️" },
  quiz: { primary: "#f59e0b", secondary: "#fbbf24", icon: "❓" },

  // Santé & Bien-être
  fitness: { primary: "#ef4444", secondary: "#f87171", icon: "💪" },

  // Voyage & Exploration
  travel: { primary: "#10b981", secondary: "#34d399", icon: "✈️" },

  // Analyse & Tech
  analytics: { primary: "#6366f1", secondary: "#818cf8", icon: "📊" },
  video: { primary: "#ec4899", secondary: "#f472b6", icon: "🎥" },
};

export function getToolTheme(toolId: string) {
  return TOOL_THEMES[toolId] || { primary: "#06b6d4", secondary: "#8b5cf6", icon: "🤖" };
}
