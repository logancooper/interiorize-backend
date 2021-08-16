'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const OrdersModel = require('../models/Orders');
const router = express.Router();

//GET by userID or get all
router.get('/', async (req, res) => {
    if (!!req.body.user_id) {
        const filteredData = await OrdersModel.getByUserID(req.body.user_id);
        if (filteredData.count = 0) {
            res.send(filteredData)
        }
        res.json(filteredData).status(200);
    } else {
        const allData = await OrdersModel.getAll();
        res.json(allData).status(200);
    }
});

// POST create new order 
router.post('/add', async (req, res) => {
    const { user_id, items } = req.body;
    const itemArray = items.split(',');
    //Call createOrder, returning an order_id
    const response1 = await OrdersModel.createOrder(user_id);
    const order_id = response1.id;
    const response2 = await OrdersModel.addItemsToOrder(order_id, itemArray);
    const response3 = await ItemsModel.addItemsToInventory(user_id, itemArray);
    res.send(response1).status(200);
});

module.exports = router;