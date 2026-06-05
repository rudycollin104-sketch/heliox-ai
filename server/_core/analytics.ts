import { getDb } from "../db";
import { analytics, offlineCache, sharedConversations } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function trackToolUsage(userId: number, toolId: string, timeSpent: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db
      .select()
      .from(analytics)
      .where(and(eq(analytics.userId, userId), eq(analytics.toolId, toolId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(analytics)
        .set({
          usageCount: existing[0].usageCount + 1,
          timeSpent: existing[0].timeSpent + timeSpent,
          lastUsed: new Date(),
        })
        .where(eq(analytics.id, existing[0].id));
    } else {
      await db.insert(analytics).values({
        userId,
        toolId,
        timeSpent,
        usageCount: 1,
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to track tool usage:", error);
    return null;
  }
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const stats = await db.select().from(analytics).where(eq(analytics.userId, userId));
    return stats;
  } catch (error) {
    console.error("Failed to get user stats:", error);
    return [];
  }
}

export async function createShareToken(conversationId: number, userId: number, expiresIn?: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const shareToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    await db.insert(sharedConversations).values({
      conversationId,
      userId,
      shareToken,
      expiresAt,
    });

    return shareToken;
  } catch (error) {
    console.error("Failed to create share token:", error);
    return null;
  }
}

export async function getSharedConversation(shareToken: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const shared = await db
      .select()
      .from(sharedConversations)
      .where(eq(sharedConversations.shareToken, shareToken))
      .limit(1);

    if (shared.length === 0) return null;

    const record = shared[0];

    // Check if expired
    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      return null;
    }

    // Increment view count
    await db
      .update(sharedConversations)
      .set({ viewCount: record.viewCount + 1 })
      .where(eq(sharedConversations.id, record.id));

    return record;
  } catch (error) {
    console.error("Failed to get shared conversation:", error);
    return null;
  }
}

export async function cacheResponse(userId: number, toolId: string, response: string, expiresIn: number = 86400) {
  const db = await getDb();
  if (!db) return null;

  try {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await db.insert(offlineCache).values({
      userId,
      toolId,
      cachedResponse: response,
      expiresAt,
    });

    return true;
  } catch (error) {
    console.error("Failed to cache response:", error);
    return null;
  }
}

export async function getCachedResponse(userId: number, toolId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const cached = await db
      .select()
      .from(offlineCache)
      .where(and(eq(offlineCache.userId, userId), eq(offlineCache.toolId, toolId)))
      .limit(1);

    if (cached.length === 0) return null;

    const record = cached[0];

    // Check if expired
    if (new Date(record.expiresAt) < new Date()) {
      await db.delete(offlineCache).where(eq(offlineCache.id, record.id));
      return null;
    }

    return record.cachedResponse;
  } catch (error) {
    console.error("Failed to get cached response:", error);
    return null;
  }
}
