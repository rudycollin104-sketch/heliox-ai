import { describe, it, expect } from "vitest";
import {
  notifyCommentOnConversation,
  notifyConversationShared,
  notifyLongResponseReady,
  notifyMention,
} from "../server/_core/notifications";

describe("Notifications System", () => {
  it("should create comment notification", async () => {
    const result = await notifyCommentOnConversation("user123", "John", "My AI Chat");
    expect(result).toBe(true);
  });

  it("should create share notification", async () => {
    const result = await notifyConversationShared("user123", "Jane", "AI Conversation");
    expect(result).toBe(true);
  });

  it("should notify when long response is ready", async () => {
    const result = await notifyLongResponseReady("user123", "GPT-4");
    expect(result).toBe(true);
  });

  it("should notify on mention", async () => {
    const result = await notifyMention("user123", "Bob", "Check this out");
    expect(result).toBe(true);
  });
});
