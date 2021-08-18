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

//GET array of all items matching quiz data for provided user, then generate an order from those items
router.post('/generate-order', async (req, res) => {
    console.log(req.body);
    const { user_id } = req.body;

    //GET all items
    const allItems = await ItemsModel.getAll();
    
    //GET quiz info
    const quizData = await QuizzesModel.getAllUserQuizData(user_id);
    const budget = quizData.budget;
    const category = quizData.category_name;
    //const quizColors = quizData.colors[0];
    //const colorOneId = quizColors[0];
    //const colorTwoId = quizColors[1];
    //const colorThreeId = quizColors[2];
    
    //GET user inventory
    const userInventory = await ItemsModel.getUserInventory(user_id);
    
    //GET avoid tags
    const avoidTagsReturn = await UsersModel.getUserAvoidData(user_id);
    const avoidTags = avoidTagsReturn[0].avoid_tags;

    //FILTER BY BUDGET & CATEGORY
    const filteredByBudget = allItems.filter(item => item.price < budget);
    
    //FILTER BY CATEGORY
    const filteredByBudgetCategory = filteredByBudget.filter(item => item.category_name === category);
    
    //FILTER BY COLORS
    //const filteredByBudgetCategoryColor = filteredByBudgetCategory.filter(item => item.color_id === colorOneId || item.color_id === colorTwoId || item.color_id === colorThreeId);
    
    //FILTER BY INVENTORY
    //foreach item in the user inventory, filter the list based on off that item
    let filteredByBudgetCategoryColorInventory;
    userInventory.forEach(userItem => {
        filteredByBudgetCategoryColorInventory = filteredByBudgetCategory.filter(item => userItem.id !== item.id);
    });
    
    //FILTER BY AVOID TAGS
    //Foreach tag in avoid tags, check each tag in the item tags list. If the avoid tag is there, filter that item out
    let finalFilteredList = [];
    //for each item in the filtered list
    filteredByBudgetCategoryColorInventory.forEach(item => {
        let isDirty = false;
        //check against each tag
        avoidTags.forEach(avoidTag => {
            //if the item tag list includes an avoidTag, mark the item as dirty and exclude it from the final list
            if(item.tags.includes(avoidTag))
            {
                isDirty = true;
            }
        });
        if(!isDirty)
        {
            finalFilteredList.push(item);
        }
    });

    //SELECT ITEMS FOR ORDER
    let orderItems = [];
    let remainingBudget = budget;
    
    while(remainingBudget > 0 || finalFilteredList.length > 0)
    {
        //Select an item index at random
        const randomItemIndex = Math.floor(Math.random() * finalFilteredList.length);
        //if the price of that item is less than the remaining budget
        if(finalFilteredList[randomItemIndex].price < remainingBudget)
        {
            //add it to the orderItems
            orderItems.push(finalFilteredList[randomItemIndex]);
            //remove it from the finalFilteredList
            finalFilteredList.remove(randomItemIndex);

        }
        else
        {
            //remove it from the finalFilteredList
            finalFilteredList.remove(randomItemIndex);
        }
    }
    //Add their price to the total, make sure it doesn't go over budget
    //if no matches, end search and post the order

    //GENERATE & POST ORDER
    

    res.json(finalFilteredList).status(200);
});

module.exports = router;
