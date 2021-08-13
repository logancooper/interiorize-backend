'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const router = express.Router();

//GET by color palette/tag/category or get all items
router.get('/', async (req, res) => {
    if (req.query.category_id) {
        const { category_id } = req.query;
        const filteredData = await ItemsModel.getBy(category_id);
        if (filteredData.count = 0) {
            res.send(filteredData)
        }
        res.json(filteredData).status(200);
    } else {
        // const allData = await ItemsModel.getAll();
        // res.json(allData).status(200);
        res.status(500)
    }
});

//GET array of items in a specific order
router.get('/:order_id', async (req, res) => {
    const { order_id } = req.params;
    const orderData = await ItemsModel.getItemsByOrder(order_id);
    res.json(orderData).status(200);
});

//Route to get a single item by itemID
router.get('/single/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const singleItem = await ItemsModel.getSingleItem(item_id);
    res.json(singleItem).status(200);
})

module.exports = router;
