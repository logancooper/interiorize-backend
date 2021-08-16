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

<b>Returns one item object with a matching item_id</b>
<ul>
    <li>item_name (string)</li>
    <li>description (string)</li>
    <li>img_src (string)</li>
    <li>price (integer)</li>
    <li>brand (string)</li>
    <li>category_name (string)</li>
    <li>color_name (string)</li>
    <li>tags (string[])</li>
</ul>

## USERS ENDPOINTS

    GET /users

returns an array of all users

    GET /users/:user_sub

returns one user object

    POST /users/add

Adds a new user to the database

body: {
    user_sub: (string) - from Auth0 but slice off 'auth0|' and insert just the numbers
    first_name: (string)
    last_name: (string)
    email: (string)
}

    POST /users/delete

body: {
    user_sub: (string) - from Auth0 but slice off 'auth0|' and insert just the numbers
}
