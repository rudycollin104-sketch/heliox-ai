import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toolId: varchar("toolId", { length: 64 }).notNull(),
  toolName: varchar("toolName", { length: 255 }).notNull(),
  title: text("title"),
  messageCount: int("messageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toolId: varchar("toolId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toolId: varchar("toolId", { length: 64 }).notNull(),
  timeSpent: int("timeSpent").default(0).notNull(), // en secondes
  usageCount: int("usageCount").default(1).notNull(),
  lastUsed: timestamp("lastUsed").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

export const sharedConversations = mysqlTable("sharedConversations", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  shareToken: varchar("shareToken", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt"),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SharedConversation = typeof sharedConversations.$inferSelect;
export type InsertSharedConversation = typeof sharedConversations.$inferInsert;

export const offlineCache = mysqlTable("offlineCache", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toolId: varchar("toolId", { length: 64 }).notNull(),
  cachedResponse: text("cachedResponse").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OfflineCache = typeof offlineCache.$inferSelect;
export type InsertOfflineCache = typeof offlineCache.$inferInsert;

// Webhooks & Events
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  events: json("events").notNull(),
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
  preferredCategories: json("preferredCategories").notNull(),
  toolScores: json("toolScores").notNull(),
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
  permission: varchar("permission", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Collaboration = typeof collaborations.$inferSelect;
export type InsertCollaboration = typeof collaborations.$inferInsert;

export const collaborationInvites = mysqlTable("collaborationInvites", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  invitedEmail: varchar("invitedEmail", { length: 255 }).notNull(),
  invitedBy: int("invitedBy").notNull(),
  permission: varchar("permission", { length: 32 }).notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  accepted: boolean("accepted").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CollaborationInvite = typeof collaborationInvites.$inferSelect;
export type InsertCollaborationInvite = typeof collaborationInvites.$inferInsert;
