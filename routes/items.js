'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const router = express.Router();

//GET by color palette/tag/category or get all items
router.get('/', async (req, res) => {
    if (!!req.body) {
        const filteredData = await ItemsModel.getBy(req.body);
        if (filteredData.count = 0) {
            res.send(filteredData)
        }
        res.json(filteredData).status(200);
    } else {
        const allData = await ItemsModel.getAll();
        res.json(allData).status(200);
    }
});

router.get('/:order_id', async (req, res) => {
    const { order_id } = req.params;
    console.log(order_id)
    const orderData = await ItemsModel.getItemsByOrder(order_id);
    res.json(orderData).status(200);
})

module.exports = router;
