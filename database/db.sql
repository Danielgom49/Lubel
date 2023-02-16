CREATE DATABASE lubel; -- creating the database

USE lubel; -- using the database

-- creating a table users
CREATE TABLE users(
    id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(255) NOT NULL
);

DESCRIBE users;

-- creating a table rooms
CREATE TABLE rooms(
    id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    number_room INT(11),
    price DECIMAL(10,2) NOT NULL,
    type_room VARCHAR(13) NOT NULL, -- cuarto o apartaestudio
    cant_beds TINYINT(11) NOT NULL,
    active VARCHAR(10) NULL DEFAULT 'Disponible', -- disponible u ocupado
    users_id INT(11),
    state INT(1) NULL DEFAULT '1',

    CONSTRAINT fk_user FOREIGN KEY (users_id) REFERENCES users(id)
);

-- creating a table customers
CREATE TABLE customers(
    id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username VARCHAR(100) NOT NULL,
    document CHAR(15) NOT NULL,
    phone CHAR (30),
    nationality VARCHAR(100),
    cant_person char(15),
    cant_day char(15) NOT NULL,
    rooms_id INT(11),
    users_id INT(11),
    price_customer DECIMAL(65,2) NOT NULL, -- Valor a pagar
    created_at VARCHAR(100) NOT NULL,
    state INT(1) NULL DEFAULT '1',
    topay VARCHAR(100) NULL DEFAULT '1',

    CONSTRAINT fk_room FOREIGN KEY (rooms_id) REFERENCES rooms(id),
    CONSTRAINT fk_userC FOREIGN KEY (users_id) REFERENCES users(id)
);
INSERT INTO users (id, username, password,  fullname) VALUES (1, 'Administrador', '$2a$10$CzkPIhAN9gJidT3QwICA5uNnEr0INg37Y2vG62ancR8ueI7.HOg.y', 'Lubel Admin');