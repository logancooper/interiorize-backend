'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const router = express.Router();

//GET array of all items in the database
router.get('/', async (req, res) => {
    const allData = await ItemsModel.getAll();
    res.json(allData).status(200);
});

//GET array of items included in a specific order_id
router.get('/byid/:order_id', async (req, res) => {
    const { order_id } = req.params;
    const orderData = await ItemsModel.getItemsByOrder(order_id);
    res.json(orderData).status(200);
});

//GET a single item by its itemID
router.get('/single/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const singleItem = await ItemsModel.getSingleItem(item_id);
    res.json(singleItem).status(200);
});

//GET filtered array of matching items
router.get('/filter/?', async (req, res) => {
    console.log(req.query);
    const { category } = req.query;
    const filteredItems = await ItemsModel.getBy(category);
    res.json(filteredItems).status(200);
});

module.exports = router;
