'use strict';
//Adding test comment

const http = require('http');
const hostname = '127.0.0.1';
const port = 3333;

const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server is running at ${hostname}:${port}`)
});

const rootController = require('./routes/index');
const itemController = require('./routes/items');
const orderController = require('./routes/orders');
const userController = require('./routes/users');

app.use('/', rootController);
app.use('/items', itemController);
app.use('/orders', orderController);
app.use('/users', userController);

