CREATE DATABASE chat ;

USE chat;


CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  rooms_id INT NOT NULL,
  users_id INT NOT NULL,
  FOREIGN KEY (rooms_id) REFERENCES users (id),
  FOREIGN KEY (users_id) REFERENCES rooms (id),
  text VARCHAR(255),
  PRIMARY KEY(id)
);


/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
