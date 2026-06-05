import { describe, it, expect } from "vitest";
import { createWebhook, getRecommendedTools, addCollaborator, createCollaborationInvite } from "../server/_core/advanced-features";

describe("Advanced Features", () => {
  it("should create a webhook", async () => {
    const result = await createWebhook(1, "https://example.com/webhook", ["conversation.created", "favorite.added"]);
    expect(result).toBe(true);
  });

  it("should get recommended tools", async () => {
    const tools = await getRecommendedTools(1, 5);
    expect(Array.isArray(tools)).toBe(true);
  });

  it("should add a collaborator", async () => {
    const result = await addCollaborator(1, 1, 2, "read");
    expect(result).toBe(true);
  });

  it("should create a collaboration invite", async () => {
    const token = await createCollaborationInvite(1, "test@example.com", 1, "write");
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
  });
});
