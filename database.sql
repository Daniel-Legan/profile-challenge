CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "access_level" INT DEFAULT 0
);

CREATE TABLE "info" (
    "id" SERIAL PRIMARY KEY,
    "image_data" BYTEA NULL,
    "first_name" VARCHAR (80) NOT NULL,
    "last_name" VARCHAR (80) NOT NULL,
    "user_id" INT REFERENCES "user"
);