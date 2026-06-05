CREATE TABLE `collaborationInvites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`invitedEmail` varchar(255) NOT NULL,
	`invitedBy` int NOT NULL,
	`permission` varchar(32) NOT NULL,
	`token` varchar(128) NOT NULL,
	`accepted` boolean NOT NULL DEFAULT false,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaborationInvites_id` PRIMARY KEY(`id`),
	CONSTRAINT `collaborationInvites_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `collaborations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`ownerId` int NOT NULL,
	`collaboratorId` int NOT NULL,
	`permission` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaborations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`data` json NOT NULL,
	`processed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`preferredCategories` json NOT NULL,
	`toolScores` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `webhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`url` varchar(512) NOT NULL,
	`events` json NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhooks_id` PRIMARY KEY(`id`)
);
