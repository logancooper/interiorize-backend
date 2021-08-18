'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const OrdersModel = require('../models/Orders');
const router = express.Router();

//GET by userID or get all
router.get('/:user_id?', async (req, res) => {
    if (!!req.params) {
        const { user_id } = req.params;
        const filteredData = await OrdersModel.getByUserID(user_id);
        let orderIds = [];
        filteredData.forEach(object => {
            orderIds.push(object.id)
            })
        let newArray = [];
        let count = 0;

        orderIds.forEach(async (id) => {
            let orderData = await ItemsModel.getItemsByOrder(id);
            newArray.push(orderData);
            count += 1
            if (count === orderIds.length || count === 3) {
                res.json({
                    orderHistory: filteredData,
                    orderedItems: newArray
                }).status(200);
            }
        });   
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