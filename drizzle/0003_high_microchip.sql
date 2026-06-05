CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`toolId` varchar(64) NOT NULL,
	`timeSpent` int NOT NULL DEFAULT 0,
	`usageCount` int NOT NULL DEFAULT 1,
	`lastUsed` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offlineCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`toolId` varchar(64) NOT NULL,
	`cachedResponse` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offlineCache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sharedConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`userId` int NOT NULL,
	`shareToken` varchar(128) NOT NULL,
	`expiresAt` timestamp,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sharedConversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `sharedConversations_shareToken_unique` UNIQUE(`shareToken`)
);
