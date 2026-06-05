import { describe, it, expect } from "vitest";
import { ENV } from "../server/_core/env";

describe("OpenAI Integration", () => {
  it("should have OPENAI_API_KEY configured", () => {
    expect(ENV.OPENAI_API_KEY).toBeDefined();
    expect(ENV.OPENAI_API_KEY.length).toBeGreaterThan(0);
  });

  it("should have valid OpenAI API key format", () => {
    const apiKey = ENV.OPENAI_API_KEY;
    expect(apiKey).toMatch(/^sk-/);
  });
});
