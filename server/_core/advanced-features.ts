import { getDb } from "../db";
import { webhooks, events, userPreferences, collaborations, collaborationInvites, analytics, conversations } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

// ===== WEBHOOKS =====
export async function createWebhook(userId: number, url: string, eventTypes: string[]) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(webhooks).values({
      userId,
      url,
      events: eventTypes,
    });
    return true;
  } catch (error) {
    console.error("Failed to create webhook:", error);
    return null;
  }
}

export async function triggerWebhook(userId: number, eventType: string, data: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Save event
    await db.insert(events).values({
      userId,
      eventType,
      data,
    });

    // Get user's webhooks
    const userWebhooks = await db
      .select()
      .from(webhooks)
      .where(and(eq(webhooks.userId, userId), eq(webhooks.active, true)));

    // Send to matching webhooks
    for (const webhook of userWebhooks) {
      const events_array = webhook.events as string[];
      if (events_array.includes(eventType)) {
        // Send webhook asynchronously (fire and forget)
        fetch(webhook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventType, data, timestamp: new Date() }),
        }).catch((err) => console.error("Webhook delivery failed:", err));
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to trigger webhook:", error);
    return null;
  }
}

// ===== RECOMMENDATIONS =====
export async function updateUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Get user's analytics
    const userAnalytics = await db.select().from(analytics).where(eq(analytics.userId, userId));

    // Calculate tool scores
    const toolScores: Record<string, number> = {};
    const categories: Set<string> = new Set();

    for (const stat of userAnalytics) {
      const score = stat.usageCount * (stat.timeSpent / 60); // usage * minutes spent
      toolScores[stat.toolId] = score;
    }

    // Get preferred categories from top tools
    const topTools = Object.entries(toolScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([toolId]) => toolId);

    // Update or create preferences
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userPreferences)
        .set({
          toolScores,
          preferredCategories: Array.from(categories),
        })
        .where(eq(userPreferences.userId, userId));
    } else {
      await db.insert(userPreferences).values({
        userId,
        toolScores,
        preferredCategories: Array.from(categories),
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return null;
  }
}

export async function getRecommendedTools(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  try {
    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (prefs.length === 0) return [];

    const toolScores = prefs[0].toolScores as Record<string, number>;
    const recommended = Object.entries(toolScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([toolId]) => toolId);

    return recommended;
  } catch (error) {
    console.error("Failed to get recommended tools:", error);
    return [];
  }
}

// ===== COLLABORATION =====
export async function addCollaborator(conversationId: number, ownerId: number, collaboratorId: number, permission: "read" | "write") {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(collaborations).values({
      conversationId,
      ownerId,
      collaboratorId,
      permission,
    });
    return true;
  } catch (error) {
    console.error("Failed to add collaborator:", error);
    return null;
  }
}

export async function createCollaborationInvite(conversationId: number, invitedEmail: string, invitedBy: number, permission: "read" | "write", expiresIn: number = 604800) {
  const db = await getDb();
  if (!db) return null;

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await db.insert(collaborationInvites).values({
      conversationId,
      invitedEmail,
      invitedBy,
      permission,
      token,
      expiresAt,
    });

    return token;
  } catch (error) {
    console.error("Failed to create collaboration invite:", error);
    return null;
  }
}

export async function acceptCollaborationInvite(token: string, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const invite = await db
      .select()
      .from(collaborationInvites)
      .where(eq(collaborationInvites.token, token))
      .limit(1);

    if (invite.length === 0) return null;

    const inv = invite[0];

    // Check if expired
    if (new Date(inv.expiresAt) < new Date()) {
      return null;
    }

    // Add collaborator
    await addCollaborator(inv.conversationId, inv.invitedBy, userId, inv.permission as "read" | "write");

    // Mark invite as accepted
    await db
      .update(collaborationInvites)
      .set({ accepted: true })
      .where(eq(collaborationInvites.id, inv.id));

    return true;
  } catch (error) {
    console.error("Failed to accept collaboration invite:", error);
    return null;
  }
}

export async function getCollaborators(conversationId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(collaborations)
      .where(eq(collaborations.conversationId, conversationId));
  } catch (error) {
    console.error("Failed to get collaborators:", error);
    return [];
  }
}

export async function removeCollaborator(collaborationId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.delete(collaborations).where(eq(collaborations.id, collaborationId));
    return true;
  } catch (error) {
    console.error("Failed to remove collaborator:", error);
    return null;
  }
}
