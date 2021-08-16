'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const UsersModel = require('../models/Users');
const router = express.Router();

//GET array of all items in the database
//Refactor and add single route to this one
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
    const { category, color } = req.query;
    const filteredItems = await ItemsModel.getBy(category, color);
    res.json(filteredItems).status(200);
});

//GET array of all items matching quiz data for provided user
router.post('/items-match', async (req, res) => {
    console.log(req.body);
    const { user_id } = req.body;

    //GET all items
    const allItems = await this.getAll();

    //GET quiz info
    //FILTER BY BUDGET & CATEGORY

    //GET user inventory
    const userInventory = await this.getUserInventory(user_id);

    //FILTER BY INVENTORY

    //GET avoid tags
    const avoidTags = await UsersModel.avoidTags
    //FILTER BY AVOID TAGS
    //FILTER BY COLORS
    const matchingItems = await ItemsModel.getItemsMatchingQuizData(user_id);
    res.json(matchingItems).status(200);
});

module.exports = router;
