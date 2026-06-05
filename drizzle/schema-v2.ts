import { mysqlTable, int, varchar, text, timestamp, boolean, json } from "drizzle-orm/mysql-core";

// Webhooks & Events
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  events: json("events").notNull(), // ["conversation.created", "favorite.added", etc]
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  data: json("data").notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Recommendations
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  preferredCategories: json("preferredCategories").notNull(), // array of category IDs
  toolScores: json("toolScores").notNull(), // { toolId: score, ... }
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

// Collaboration
export const collaborations = mysqlTable("collaborations", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  ownerId: int("ownerId").notNull(),
  collaboratorId: int("collaboratorId").notNull(),
  permission: varchar("permission", { length: 32 }).notNull(), // "read" | "write"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Collaboration = typeof collaborations.$inferSelect;
export type InsertCollaboration = typeof collaborations.$inferInsert;

export const collaborationInvites = mysqlTable("collaborationInvites", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  invitedEmail: varchar("invitedEmail", { length: 255 }).notNull(),
  invitedBy: int("invitedBy").notNull(),
  permission: varchar("permission", { length: 32 }).notNull(), // "read" | "write"
  token: varchar("token", { length: 128 }).notNull().unique(),
  accepted: boolean("accepted").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CollaborationInvite = typeof collaborationInvites.$inferSelect;
export type InsertCollaborationInvite = typeof collaborationInvites.$inferInsert;
