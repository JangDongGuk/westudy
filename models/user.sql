CREATE TABLE `users`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(20),
    `password` CHAR(16),
    `create_at` DATE,
    PRIMARY KEY (`id`)
);

INSERT INTO `users` VALUES (1,'장동국','1234');