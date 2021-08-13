# Interiorize - Backend

    BASE URL - https://api.interiorize.design

    GET /

returns "Welcome to the Interiorize API!"

## ITEMS ENDPOINTS

    GET /items

returns array of all items in the database
item_name (string)
description (string)
img_src (string)
price (integer)
brand (string)
category_name (string)
color_name (string)
tags (string[])

    GET /items/byid/:order_id

params: order_id (integer)

returns an array of all items contained in a certain order_id
item_name (string),
description (string),
img_src (string),
price (integer),
brand (string)

    GET /items/single/:item_id

returns one item object with a matching item_id
item_name (string)
description (string)
img_src (string)
price (integer)
brand (string)
category_name (string)
color_name (string)
tags (string[])

## USERS ENDPOINTS

    GET /users

returns an array of all users

    GET /users/:user_sub

returns one user object

    POST /users/add

Adds a new user to the database

body: {
    
}