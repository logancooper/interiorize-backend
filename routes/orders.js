'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const OrdersModel = require('../models/Orders');
const checkJwt = require('../utilities');
const router = express.Router();

router.use(checkJwt);

//GET by userID or get all
router.get('/:user_id?', async (req, res) => {
    if (!!req.params.user_id) {
        const { user_id } = req.params;
        const ordersData = await OrdersModel.getByUserID(user_id);
        let orderIds = [];
        ordersData.forEach(object => {
            orderIds.push(object.id)
            })
        if (orderIds.length === 0) {
            res.json({
                orderHistory: {},
                orderedItems: {}
            })
        }
        let orderItemData = [];
        let count = 0;
        for(let i = 0; i < orderIds.length; i++) {
            let itemData = await ItemsModel.getItemsByOrder(orderIds[i]);
            orderItemData.push(itemData);
            count += 1;
            if (count === orderIds.length || count === 3) {
                res.status(200).json({
                    orderHistory: orderIds,
                    orderedItems: orderItemData
                });
                break;
            }
        }
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