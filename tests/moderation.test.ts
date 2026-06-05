import { describe, it, expect } from "vitest";
import { moderateContent, sanitizeContent, canPublishConversation } from "../server/_core/content-moderation";

describe("Content Moderation", () => {
  it("should detect inappropriate content", () => {
    const result = moderateContent("This contains violence and hate speech");
    expect(result.isAppropriate).toBe(false);
    expect(result.severity).toBe("medium");
  });

  it("should detect spam patterns", () => {
    const result = moderateContent("Click here now for free offer! Visit https://example.com");
    expect(result.isAppropriate).toBe(false);
    expect(result.severity).toBe("high");
  });

  it("should allow appropriate content", () => {
    const result = moderateContent("This is a great conversation about programming");
    expect(result.isAppropriate).toBe(true);
    expect(result.severity).toBe("none");
  });

  it("should sanitize content", () => {
    const dirty = "Check this out!!! https://example.com   lots   of   spaces";
    const clean = sanitizeContent(dirty);
    expect(clean).not.toContain("https://");
    expect(clean).not.toContain("!!!");
  });

  it("should determine if conversation can be published", () => {
    const appropriate = "Great conversation about AI and technology";
    const inappropriate = "This contains violence and hate";
    
    expect(canPublishConversation(appropriate)).toBe(true);
    expect(canPublishConversation(inappropriate)).toBe(false);
  });
});
