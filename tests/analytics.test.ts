import { describe, it, expect } from "vitest";
import { trackToolUsage, getUserStats, createShareToken, cacheResponse, getCachedResponse } from "../server/_core/analytics";

describe("Analytics", () => {
  it("should track tool usage", async () => {
    const result = await trackToolUsage(1, "test-tool", 100);
    expect(result).toBe(true);
  });

  it("should get user stats", async () => {
    await trackToolUsage(1, "test-tool-2", 50);
    const stats = await getUserStats(1);
    expect(Array.isArray(stats)).toBe(true);
  });

  it("should create share token", async () => {
    const token = await createShareToken(1, 1, 3600);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
  });

  it("should cache and retrieve response", async () => {
    const response = "Test response content";
    const cacheResult = await cacheResponse(1, "test-tool-3", response, 3600);
    expect(cacheResult).toBe(true);

    const cached = await getCachedResponse(1, "test-tool-3");
    expect(cached).toBe(response);
  });
});
