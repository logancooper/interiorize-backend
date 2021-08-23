<h1 align="center">Interiorize API</h1>
<p>The Interiorize API is a RESTful API deployed to serve data to <a href="https://interiorize.design">Interiorize</a><a href="https://github.com/natelee3/interiorize">(see frontend repo)</a>. Several public routes are denoted with * below, but the majority of the routes require a JSON Web Token only available to logged-in users.</p>
<p><a href="https://interiorize.design/images/db_schema.png">View our database schema</a></p>
<details>
  <summary align="center">Table of Contents</summary>
  <ol>
    <li>
      <a href="#items-endpoints">Items Endpoints</a>
      <ul>
        <li>GET /items*</li>
        <li>GET /items/byId/:order_id</li>
        <li>GET /items/single/:item_id*</li>
        <li>GET /items/items-match</li>
        <li>GET /items/shop-search</li>
        <li>POST /items/generate-order</li>
      </ul>
    </li>
    <li>
      <a href="#users-endpoints">Users Endpoints</a>
      <ul>
        <li>GET /users</li>
        <li>GET /users/:user_id</li>
        <li>POST /users/add</li>
        <li>POST /users/delete</li>
      </ul>
    </li>
    <li>
        <a href="#avoid-endpoints">Avoid Endpoints</a>
        <ul>
            <li>GET /users/avoid/:user_id</li>
            <li>GET /users/avoid/string/:user_id</li>
            <li>POST /users/avoid/add</li>
            <li>POST /users/avoid/update</li>
        </ul>
    </li>
    <li>
        <a href="#quizzes-endpoints">Quizzes Endpoints</a>
         <ul>
            <li>GET /quizzes/:user_id</li>
            <li>POST /quizzes/add</li>
            <li>POST /quizzes/update</li>
        </ul>
    </li>
    <li>
        <a href="#orders-endpoints">Orders Endpoints</a>
        <ul>
        <li>GET /orders</li>
        <li>GET /orders/:user_id</li>
        <li>POST /orders/add</li>
      </ul>
    </li>    
  </ol>
</details><hr/>

    BASE URL - https://api.interiorize.design

    GET /

<b>Returns text: "Welcome to the Interiorize API!"</b>

## ITEMS ENDPOINTS

    GET /items

<b>Returns an array of all items in the database</b>
<ul>
    <li>id (integer)</li>
    <li>item_name (string)</li>
    <li>description (string)</li>
    <li>img_src (string)</li>
    <li>price (integer)</li>
    <li>brand (string)</li>
    <li>category_name (string)</li>
    <li>category_id (integer)</li>
    <li>color_name (string)</li>
    <li>color_id (integer)</li>
    <li>tags (string[])</li>
    <li>tag_ids (integer[])</li>
</ul>


    GET /items/byid/:order_id

params: order_id (integer)

<b>Returns an array of all items that match the input order_id in the orders_items table</b>
<ul>
    <li>order_id (integer)</li>
    <li>item_name (string)</li>
    <li>description (string)</li>
    <li>img_src (string)</li>
    <li>price (integer)</li>
    <li>brand (string)</li>
</ul>

    GET /items/single/:item_id

<b>Returns one item object with a matching item_id</b>
<ul>
    <li>id (integer)</li>
    <li>item_name (string)</li>
    <li>description (string)</li>
    <li>img_src (string)</li>
    <li>price (integer)</li>
    <li>brand (string)</li>
    <li>category_name (string)</li>
    <li>category_id (integer)</li>
    <li>color_name (string)</li>
    <li>color_id (integer)</li>
    <li>tags (string[])</li>
    <li>tag_ids (integer[])</li>
</ul>

    GET /items/items-match

body: {
    user_id: (integer)
}

<b>Returns an array of all items matching the quiz/avoid criteria for this user</b>

    GET /items/shop-search

<b>Returns an array of items filtered by the checkboxes selected by the user</b>

    GET /items/generate-order

body: { user_id: (integer) }

<b>Creates a custom order using the user's saved style quiz results</b>

<p align="center">
    <a href="#interiorize-api">Back to Top</a>
</p>

## USERS ENDPOINTS

    GET /users

<b>Returns an array of all user objects</b>

<ul>
    <li>id: (integer)</li>
    <li>user_sub: (string) - from Auth0</li>
    <li>nickname: (string)</li>
    <li>email: (string)</li>
</ul>

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

<p align="center">
    <a href="#interiorize-api">Back to Top</a>
</p>

## AVOID ENDPOINTS

    GET /users/avoid/:user_id

params: user_id (integer)

<b>Returns an array of tag_ids that the user has chosen to avoid</b>

    GET /users/avoid/string/:user_id

params: user_id (integer)

<b>Returns an array of tag_descriptions (string) that the user has chosen to avoid</b>

    POST /users/avoid/add

body: {
    user_id: (integer),
    avoid_tags: (integer[])
}

    POST /users/avoid/update

body: {
    user_id: (integer),
    avoid_tags: (integer[])
}

<b>First deletes exists entries for this user_id in the users_tags table. Then, adds new tags</b>
<p align="center">
    <a href="#interiorize-api">Back to Top</a>
</p>

## QUIZZES ENDPOINTS

    GET /quizzes/:user_id

params: user_id (integer)

<b>Returns an object containing a user's quiz data</b>

<ul>
    <li>user_id: (integer)</li>
    <li>budget: (integer)</li>
    <li>colors: (integer[])</li>
    <li>color1: (string)</li>
    <li>color2: (string)</li>
    <li>color3: (string)</li>
    <li>category_id: (integer)</li>
    <li>category_name: (integer)</li>
    <li>style_id: (integer)</li>
    <li>style_name: (string)</li>
</ul>

    POST /quizzes/add

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

    POST /quizzes/update

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

<p align="center">
    <a href="#interiorize-api">Back to Top</a>
</p>

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

<ul>orderHistory objects
    <li>id: (integer) - order_id</li>
    <li>created_data: (timestamp)</li>
</ul>
<ul>orderedItems objects</ul>
    <li>order_id: (integer)</li>
    <li>item_name: (string)</li>
    <li>description: (string)</li>
    <li>img_src: (string)</li>
    <li>price: (integer)</li>
    <li>brand: (integer)</li>

    POST /orders/add

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

<p align="center">
    <a href="#interiorize-api">Back to Top</a>
</p>