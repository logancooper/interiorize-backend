CREATE TABLE users(
    id serial PRIMARY KEY,
    user_sub text,
    first_name text,
    last_name text,
    email varchar(200),
    UNIQUE(email)
);

CREATE TABLE items(
    id serial PRIMARY KEY,
    item_name text,
    description text,
    img_src text,
    price integer,
    brand text,
    color_id integer REFERENCES colors(id)
);

CREATE TABLE orders(
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    created_date TIMESTAMP
);

CREATE TABLE orders_items(
    order_id integer REFERENCES orders(id),
    item_id integer REFERENCES items(id)
);

CREATE TABLE categories(
    id serial PRIMARY KEY,
    category_name text
);

CREATE TABLE item_categories(
    item_id integer REFERENCES items(id),
    category_id integer REFERENCES categories(id)
);

CREATE TABLE tags(
    id serial PRIMARY KEY,
    tag_description text
);

CREATE TABLE items_tags(
    item_id integer REFERENCES items(id),
    tag_id integer REFERENCES tags(id)
);

CREATE TABLE colors(
    id serial PRIMARY KEY,
    color_name text
);

CREATE TABLE reviews(
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    item_id integer REFERENCES items(id),
    rating integer
);

CREATE TABLE quizzes(
    id serial PRIMARY KEY,
    user_id integer REFERENCES UNIQUE users(id),
    budget integer default 0,
    color_one_id integer REFERENCES colors(id),
    color_two_id integer REFERENCES colors(id),
    color_three_id integer REFERENCES colors(id),
    category_id integer REFERENCES categories(id)
);

CREATE TABLE users_tags(
    user_id integer REFERENCES users(id),
    tag_id integer REFERENCES tags(id)
);

CREATE TABLE users_avoid_tags(
    user_id integer REFERENCES users(id),
    tag_id integer REFERENCES tags(id)
);

CREATE TABLE users_inventory(
    user_id integer REFERENCES users(id),
    item_id integer REFERENCES items(id)
);