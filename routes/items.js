'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const UsersModel = require('../models/Users');
const QuizzesModel = require('../models/Quizzes');
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
    const allItems = await ItemsModel.getAll();
    //GET quiz info
    const quizData = await QuizzesModel.getAllUserQuizData(user_id);
    //console.log(quizData);
    //GET user inventory
    const userInventory = await ItemsModel.getUserInventory(user_id);
    //GET avoid tags
    const avoidTags = await UsersModel.getUserAvoidData(user_id);
    //console.log(avoidTags);

    const budget = quizData.budget;
    //FILTER BY BUDGET & CATEGORY
    const filteredByBudget = allItems.filter(item => item.price < budget);
    console.log(filteredByBudget);
    //FILTER BY COLORS
    //FILTER BY INVENTORY
    //FILTER BY AVOID TAGS

    res.json(allItems).status(200);
});

module.exports = router;
