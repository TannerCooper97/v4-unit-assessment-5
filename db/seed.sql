CREATE TABLE helo_users (
    id serial primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    profile_pic text
);

CREATE TABLE helo_posts (
    id serial primary key,
    title varchar(255) not null,
    content text,
    img text,
    author_id INT NOT null references helo_users(id),
    date_created timestamp
);