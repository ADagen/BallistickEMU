DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  -- Account details --
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `password` CHAR(255) NOT NULL,
  -- Extra account info --
  `created` INT(8) NOT NULL DEFAULT DATE_FORMAT(CURDATE(), '%Y%m%d'),
  `last_login` INT(8) NOT NULL DEFAULT DATE_FORMAT(CURDATE(), '%Y%m%d'),
  `ticket_date` INT(8) NOT NULL DEFAULT DATE_FORMAT(CURDATE(), '%Y%m%d'),
  `user_level` BOOLEAN NOT NULL DEFAULT 0,
  `banned` BOOLEAN NOT NULL DEFAULT 0,
  `muted` BOOLEAN NOT NULL DEFAULT 0,
  `lab_pass` BOOLEAN NOT NULL DEFAULT 0,
  `lab_pass_days` SMALLINT(4) NOT NULL DEFAULT 0 CHECK (`lab_pass_days` BETWEEN 0 AND 9999),
  `credits` MEDIUMINT(6) NOT NULL DEFAULT 0 CHECK (`credits` BETWEEN 0 AND 999999),
  -- Stats --
  `rounds` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `kills` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `deaths` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `wins` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  `losses` INT(10) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  -- Item info --
  `id` INT(10) UNSIGNED NOT NULL,
  `uniqueItemId` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `itemType` TINYINT(1) NOT NULL,
  `itemId` TINYINT(3) UNSIGNED NOT NULL,
  `selected` BOOLEAN NOT NULL DEFAULT 0,
  -- Item inner color --
  `redInner` TINYINT(3) UNSIGNED ZEROFILL NOT NULL DEFAULT 255,
  `greenInner` TINYINT(3) UNSIGNED ZEROFILL NOT NULL DEFAULT 0,
  `blueInner` TINYINT(3) UNSIGNED ZEROFILL NOT NULL DEFAULT 0,
  -- Item outer color --
  `redOuter` TINYINT(3) UNSIGNED ZEROFILL NOT NULL DEFAULT 255,
  `greenOuter` TINYINT(3) UNSIGNED ZEROFILL NOT NULL DEFAULT 0,
  `blueOuter` TINYINT(3) UNSIGNED ZEROFILL NOT NULL DEFAULT 0,
  PRIMARY KEY (`uniqueItemId`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  -- Report account details --
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `reporter_username` VARCHAR(20) NOT NULL,
  `reported_username` VARCHAR(20) NOT NULL,
  `reported_ip` VARCHAR(15) NOT NULL,
  -- Report --
  `msg` CHAR(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
INSERT INTO `users` (`id`, `username`, `password`) VALUES (100, 'Zaseth', '$argon2id$v=19$m=65536,t=4,p=1$Q28xMEFkejZ0RDV3ZEEwUw$v6Ci2fDOfBk388UrzKgA+KlgmHF7TVLedlHJY/tzCmc');
UNLOCK TABLES;

LOCK TABLES `inventory` WRITE;
INSERT INTO `inventory` (`id`, `itemType`, `itemId`, `selected`) VALUES (100, 1, 100, 1);
INSERT INTO `inventory` (`id`, `itemType`, `itemId`, `selected`, `redInner`, `redOuter`) VALUES (100, 2, 200, 0, 0, 0);
UNLOCK TABLES;
