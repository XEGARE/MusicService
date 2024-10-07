CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE pictures(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    file_path VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE albums(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    user_id INTEGER,
    picture_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (picture_id) REFERENCES pictures (id)
);

CREATE TABLE songs(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    file_path VARCHAR(255),
    file_size INTEGER,
    album_id INTEGER,
    FOREIGN KEY (album_id) REFERENCES albums (id)
);

CREATE TABLE favorites(
    user_id INTEGER,
    album_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (album_id) REFERENCES albums (id)
);