/**
 * Content Moderation System
 * Filters inappropriate content for public conversations
 */

const INAPPROPRIATE_KEYWORDS = [
  "violence",
  "hate",
  "harassment",
  "spam",
  "adult",
  "explicit",
  "illegal",
  "drugs",
  "weapon",
];

const SPAM_PATTERNS = [
  /\b(?:click|buy|visit|shop)\b.*(?:link|url|site|now)/gi,
  /(?:http|https):\/\/[^\s]+/g,
  /\b(?:free|limited|offer|deal)\b.*(?:today|now|urgent)/gi,
];

export interface ModerationResult {
  isAppropriate: boolean;
  reason?: string;
  severity: "none" | "low" | "medium" | "high";
  flaggedWords: string[];
}

export function moderateContent(content: string): ModerationResult {
  const lowerContent = content.toLowerCase();
  const flaggedWords: string[] = [];
  let severity: "none" | "low" | "medium" | "high" = "none";

  // Check for inappropriate keywords
  for (const keyword of INAPPROPRIATE_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      flaggedWords.push(keyword);
      severity = "medium";
    }
  }

  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      severity = "high";
      return {
        isAppropriate: false,
        reason: "Contenu détecté comme spam",
        severity,
        flaggedWords,
      };
    }
  }

  // Check for excessive repetition (spam indicator)
  const words = content.split(/\s+/);
  const wordFreq = new Map<string, number>();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }

  const maxFreq = Math.max(...wordFreq.values());
  if (maxFreq > words.length * 0.3) {
    severity = "low";
    return {
      isAppropriate: false,
      reason: "Contenu répétitif détecté",
      severity,
      flaggedWords,
    };
  }

  return {
    isAppropriate: flaggedWords.length === 0,
    reason: flaggedWords.length > 0 ? `Contenu potentiellement inapproprié: ${flaggedWords.join(", ")}` : undefined,
    severity,
    flaggedWords,
  };
}

export function sanitizeContent(content: string): string {
  let sanitized = content;

  // Remove URLs
  sanitized = sanitized.replace(/(?:http|https):\/\/[^\s]+/g, "[URL supprimée]");

  // Remove excessive punctuation
  sanitized = sanitized.replace(/([!?.])\1{2,}/g, "$1");

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
}

export function canPublishConversation(content: string): boolean {
  const moderation = moderateContent(content);
  return moderation.isAppropriate && moderation.severity !== "high";
}
