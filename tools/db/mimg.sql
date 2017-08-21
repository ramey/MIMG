CREATE DATABASE IF NOT EXISTS `mimg`;

USE `mimg`;

DROP TABLE IF EXISTS `secondary_images`;
DROP TABLE IF EXISTS `primary_images`;

CREATE TABLE `primary_images` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `image_src` text NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `primary_images` (`image_src`) VALUES('/images/primary/tiger.jpg'),
    ('/images/primary/cat.jpg'),
    ('/images/primary/dog.jpg'),
    ('/images/primary/panda.jpg'),
    ('/images/primary/monkey.jpg'),
    ('/images/primary/giraffe.jpg');

CREATE TABLE `secondary_images` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `primary_image` int(11) NOT NULL,
    `image_src` text NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`primary_image`) REFERENCES `primary_images` (`id`)
);

INSERT INTO `secondary_images` (`primary_image`, `image_src`) VALUES(1, '/images/secondary/tiger1.jpg'),
    (1, '/images/secondary/tiger2.jpg'),
    (1, '/images/secondary/tiger3.jpg'),
    (2, '/images/secondary/cat1.jpg'),
    (2, '/images/secondary/cat2.jpg'),
    (2, '/images/secondary/cat3.jpg'),
    (3, '/images/secondary/dog1.jpg'),
    (3, '/images/secondary/dog2.jpg'),
    (3, '/images/secondary/dog3.jpg'),
    (4, '/images/secondary/panda1.jpg'),
    (4, '/images/secondary/panda2.jpg'),
    (4, '/images/secondary/panda3.jpg'),
    (5, '/images/secondary/monkey1.jpg'),
    (5, '/images/secondary/monkey2.jpg'),
    (5, '/images/secondary/monkey3.jpg'),
    (6, '/images/secondary/giraffe1.jpg'),
    (6, '/images/secondary/giraffe2.jpg'),
    (6, '/images/secondary/giraffe3.jpg');

DROP TABLE if EXISTS `scores`;
DROP TABLE if EXISTS `users`;

CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(16) NOT NULL,
    `hash` varchar(16) NOT NULL,
    `salt` varchar(64) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`username`)
);

CREATE TABLE `scores` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user` varchar(11) NOT NULL,
    `score` int(11) DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user`) REFERENCES `users` (`id`)
);
