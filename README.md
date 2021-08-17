# Interiorize - Backend

    BASE URL - https://api.interiorize.design

    GET /

<b>Returns text: "Welcome to the Interiorize API!"</b>

## ITEMS ENDPOINTS

    GET /items

<b>Returns an array of all items in the database</b>
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


    GET /items/byid/:order_id

params: order_id (integer)

<b>Returns an array of all items that match the input order_id in the orders_items table</b>
Each object contains: 
<ul>
    <li>item_name (string)</li>
    <li>description (string)</li>
    <li>img_src (string)</li>
    <li>price (integer)</li>
    <li>brand (string)</li>
</ul>

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

    GET /items/items-match

<b>Returns an array of all items matching the quiz/avoid criteria for this user</b>

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

## USERS/AVOID ENDPOINTS

    GET /users/avoid/:user_id

params: user_id (integer)

<b>Returns an array of tag_ids that the user has chosen to avoid</b>

    POST /users/avoid/add

body: {
    user_id: (integer),
    tags_array: (integer[])
}

    POST /users/avoid/update

body: {
    user_id: (integer),
    tags_array: (integer[])
}

<b>First deletes exists entries for this user_id in the users_tags table. Then, adds new tags</b>

## QUIZZES ENDPOINTS

    GET /quizzes/:user_id

params: user_id (integer)

<b>Returns an object containing a user's quiz data</b>

<ul>
    <li>user_id: (integer)</li>
    <li>budget: (integer)</li>
    <li>colors: (integer[])</li>
    <li>category_name: (integer)</li>
</ul>

    GET /quizzes/add

body: {
    user_id: (integer),
    budget: (integer),
    color_one_id: (integer),
    color_two_id: (integer),
    color_three_id: (integer),
    category_id: (integer),
    style_id: (integer)
}

<b>Adds new quiz data for a user</b>

    GET /quizzes/update

body: {
    user_id: (integer),
    budget: (integer),
    color_one_id: (integer),
    color_two_id: (integer),
    color_three_id: (integer),
    category_id: (integer),
    style_id: (integer)
}

<b>Updates all quiz data for a user</b>

## ORDERS ENDPOINTS

    GET /orders

<b>Returns an array of all order objects in the database</b>

<ul>
    <li>order_id: (integer)</li>
    <li>user_id: (integer)</li>
    <li>created_data: (timestamp)</li>
    <li>items: (text[])</li>
</ul>

    GET /orders/:user_id

<b>Returns an array of all orders associated with the input user_id</b>

<ul>
    <li>order_id: (integer)</li>
    <li>user_id: (integer)</li>
    <li>created_data: (timestamp)</li>
    <li>items: (text[])</li>
</ul>

    POST orders/add

body: {
    user_id: (integer),
    items: (integer[]) - contains item ids for all items you wish to add to the new order
}

<ul>
    <li>Creates a new order with timestamp and order_id</li>
    <li>Adds all items in the items array to that order</li>
    <li>Add all items in the items array to user inventory</li>
    <li>Returns the new order_id</li>
</ul>