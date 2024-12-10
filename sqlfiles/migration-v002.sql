USE ynov_ci;
CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT,
    firstName varchar(255),
    lastName varchar(255),
    mail varchar(255),
    postalCode varchar(255),
    city varchar(255),
    birthday DATE,
    PRIMARY KEY (id)
);