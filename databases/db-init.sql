CREATE TABLE users (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, status INTEGER);
CREATE TABLE requests (requestID INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, username TEXT, time TEXT, page TEXT);
CREATE TABLE logins (loginHash TEXT PRIMARY KEY, userID INTEGER, FOREIGN KEY (userID) REFERENCES users(userID));
INSERT INTO users (username, password, status) VALUES ('Admin', 'Admin123', 1);
INSERT INTO users (username, password, status) VALUES ('Sub-Admin', 'Subad123', 2);