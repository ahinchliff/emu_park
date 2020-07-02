CREATE DATABASE `[project_name]`;
ALTER DATABASE `[project_name]` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `[project_name]`;

CREATE TABLE IF NOT EXISTS `user` (
  `user_userId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_authId` varchar(50) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_createdAt` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `user_updatedAt` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_userId`),
  UNIQUE KEY `uq_user_authId` (`user_authId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  