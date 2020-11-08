CREATE DATABASE `gotcha`;
ALTER DATABASE `gotcha` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `gotcha`;

CREATE TABLE IF NOT EXISTS `user` (
  `user_userId` SERIAL,
  `user_username` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_displayName` varchar(50) NOT NULL,
  `user_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_userId`),
  UNIQUE KEY `uq_user_username` (`user_username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `game` (
  `game_gameId` SERIAL,
  `game_title` varchar(100) NOT NULL,
  `game_ownerId` BIGINT UNSIGNED NOT NULL,
  `game_joinCode` varchar(100) NOT NULL,
  `game_startedAt` TIMESTAMP NULL DEFAULT NULL,
  `game_finishedAt` TIMESTAMP NULL DEFAULT NULL,
  `game_toFinishAt` TIMESTAMP NULL DEFAULT NULL,
  `game_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `game_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_gameId`),
  FOREIGN KEY (`game_ownerId`) REFERENCES `user`(`user_userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `player` (
  `player_gameId` BIGINT UNSIGNED NOT NULL,
  `player_userId` BIGINT UNSIGNED NOT NULL,
  `player_leftAt` TIMESTAMP NULL DEFAULT NULL,
  `player_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `player_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`player_gameId`, `player_userId`),
  FOREIGN KEY (`player_gameId`) REFERENCES `game`(`game_gameId`),
  FOREIGN KEY (`player_userId`) REFERENCES `user`(`user_userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mission` (
  `mission_missionId` SERIAL,
  `mission_description` TEXT,
  `mission_disabled` BOOLEAN NOT NULL DEFAULT 0,
  `mission_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mission_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`mission_missionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gameUserMission` (
  `gameUserMission_gameId` BIGINT UNSIGNED NOT NULL,
  `gameUserMission_userId` BIGINT UNSIGNED NOT NULL,
  `gameUserMission_missionId` BIGINT UNSIGNED NOT NULL,
  `gameUserMission_status` ENUM ('pending', 'completed', 'failed') DEFAULT 'pending',
  `gameUserMission_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gameUserMission_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gameUserMission_gameId`,`gameUserMission_userId`, `gameUserMission_missionId`),
  FOREIGN KEY (`gameUserMission_gameId`) REFERENCES `game`(`game_gameId`),
  FOREIGN KEY (`gameUserMission_userId`) REFERENCES `user`(`user_userId`),
  FOREIGN KEY (`gameUserMission_missionId`) REFERENCES `mission`(`mission_missionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;