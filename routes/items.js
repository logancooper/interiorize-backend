'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const UsersModel = require('../models/Users');
const QuizzesModel = require('../models/Quizzes');
const OrdersModel = require('../models/Orders');
const router = express.Router();
const checkJwt = require('../utilities');

//GET array of all items in the database
//Refactor and add single route to this one
router.get('/', async (req, res) => {
    const allData = await ItemsModel.getAll();
    res.json(allData).status(200);
});

//GET array of items included in a specific order_id
router.get('/byid/:order_id', checkJwt, async (req, res) => {
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

const cleanArray = (inputArray) =>
{
    inputArray = inputArray.split(',');
    let returnArray = [];
    if(inputArray.length === 1 && inputArray[0] === '')
    {
        inputArray = [];
    }
    returnArray = inputArray.map(i=>Number(i));
    return returnArray;
}

//GET filtered array of matching items
router.get('/shop-search', async (req, res) => {
    let { designArray, categoryArray, colorArray, priceTierArray } = req.query;
    
    designArray = cleanArray(designArray);
    categoryArray = cleanArray(categoryArray);
    colorArray = cleanArray(colorArray);
    priceTierArray = cleanArray(priceTierArray);

    const byDesign = (item) => {
        let cleanFlag = false;
        item.tag_ids.forEach(tag_id => {
            designArray.forEach(design_tag => {
                if(design_tag === tag_id)
                {
                    cleanFlag = true;
                }
            })
        })
        return cleanFlag;
    }

    const byCategory = (item) => {
        let cleanFlag = false;
        categoryArray.forEach(category_tag => {
            if(category_tag === item.category_id)
            {
                cleanFlag = true;
            }
        })
        return cleanFlag;
    }

    const byColor = (item) => {
        let cleanFlag = false;
        colorArray.forEach(color_id => {
            if(color_id === item.color_id)
            {
                cleanFlag = true;
            }
        })
        return cleanFlag;
    }

    const byPriceTier = (item) => {
        let cleanFlag = false;
        priceTierArray.forEach(priceTier => {
            if(priceTier === 1 && item.price >= 0 && item.price <= 40)
            {
                cleanFlag = true;
            }
            if(priceTier === 2 && item.price >= 40 && item.price <= 80)
            {
                cleanFlag = true;
            }
            if(priceTier === 3 && item.price >= 80 && item.price <= 120)
            {
                cleanFlag = true;
            }
        });
        return cleanFlag;
    }

    let allItems = await ItemsModel.getAll();

    //filter by design
    let filteredItems = allItems;
    if(designArray.length > 0)
    {
        filteredItems = allItems.filter(byDesign);
    }

    //filter by category
    if(categoryArray.length > 0)
    {
        filteredItems = filteredItems.filter(byCategory);
    }

    //filter by color
    if(colorArray.length > 0)
    {
        filteredItems = filteredItems.filter(byColor);
    }
    
    //filter by price tier
    if(priceTierArray.length > 0)
    {
        filteredItems = filteredItems.filter(byPriceTier);
    }

    res.json(filteredItems).status(200);
});

//GET array of all items matching quiz data for provided user, then generate an order from those items
router.post('/generate-order', checkJwt, async (req, res) => {
    console.log(req.body);
    const { user_id } = req.body;

    //GET all items
    const allItems = await ItemsModel.getAll();
    //console.log(allItems);
    
    //GET quiz info
    const quizData = await QuizzesModel.getAllUserQuizData(user_id);
    const budget = quizData.budget;
    const category = quizData.category_name;
    const style_id = quizData.style_id;
    
    //GET user inventory
    const userInventory = await ItemsModel.getUserInventory(user_id);
    //console.log("User Inventory: ",userInventory);
    
    //GET avoid tags
    const avoidTagsReturn = await UsersModel.getUserAvoidStrings(user_id);
    const avoidTags = avoidTagsReturn[0].avoid_tags;
    //console.log(avoidTags);

    //FILTER BY BUDGET & CATEGORY
    const filteredByBudget = allItems.filter(item => item.price < budget);
    
    //FILTER BY CATEGORY
    const filteredByBudgetCategory = filteredByBudget.filter(item => item.category_name === category);
    //console.log(filteredByBudgetCategory);

    //FILTER BY STYLE TAG
    let filteredByBudgetCategoryStyle = [];
    filteredByBudgetCategory.forEach(item => {
        //console.log(item.tag_ids);
        //If the tags of the item contain the style tag ID, add that item to the new list
        item.tag_ids.forEach(tag_id => {
            if(style_id === tag_id)
            {
                filteredByBudgetCategoryStyle.push(item);
            }
        });
    });

    
    //FILTER BY COLORS
    //const filteredByBudgetCategoryColor = filteredByBudgetCategory.filter(item => item.color_id === colorOneId || item.color_id === colorTwoId || item.color_id === colorThreeId);
    
    //FILTER BY INVENTORY
    //foreach item in the user inventory, filter the list based on off that item
    let filteredByBudgetCategoryStyleInventory = filteredByBudgetCategoryStyle;
    if(userInventory != null && userInventory.length > 0)
    {
        //console.log(userInventory);
        userInventory.forEach(userItem => {
            filteredByBudgetCategoryStyleInventory.forEach(item => {
                if(item.id === userItem.id)
                {
                    //console.log("Item exists in inventory: ", item);
                    filteredByBudgetCategoryStyleInventory.splice(filteredByBudgetCategoryStyleInventory.indexOf(item),1);
                }
            });
            //filteredByBudgetCategoryStyleInventory = filteredByBudgetCategory.filter(item => userItem.id !== item.id);
        });
    }
    //console.log("Filtered by Inventory: ", filteredByBudgetCategoryStyleInventory);

    //FILTER BY AVOID TAGS
    //Foreach tag in avoid tags, check each tag in the item tags list. If the avoid tag is there, filter that item out
    let finalFilteredList = [];
    //for each item in the filtered list
    filteredByBudgetCategoryStyleInventory.forEach(item => {
        let isDirty = false;
        //check against each tag
        if(avoidTags != null)
        {
            avoidTags.forEach(avoidTag => {
                //if the item tag list includes an avoidTag, mark the item as dirty and exclude it from the final list
                if(item.tags.includes(avoidTag))
                {
                    isDirty = true;
                }
            });
        }
        if(!isDirty)
        {
            finalFilteredList.push(item);
        }
    });

    //console.log(finalFilteredList);

    //SELECT ITEMS FOR ORDER
    let orderItems = [];
    let remainingBudget = budget;
    //console.log("Budget Remaining: ", remainingBudget);
    
    while(remainingBudget > 0 && finalFilteredList.length > 0)
    {
        //console.log(finalFilteredList);
        //Select an item index at random
        const randomItemIndex = Math.floor(Math.random() * finalFilteredList.length);
        //console.log("Random Index: ", randomItemIndex);
        //console.log(finalFilteredList[randomItemIndex]);
        //if the price of that item is less than the remaining budget
        if(finalFilteredList[randomItemIndex].price && finalFilteredList[randomItemIndex].price < remainingBudget)
        {
            //add it to the orderItems
            orderItems.push(finalFilteredList[randomItemIndex]);
            //console.log("Adding item to order:", finalFilteredList[randomItemIndex]);
            //subtract the price from the budget
            remainingBudget -= finalFilteredList[randomItemIndex].price;
            //remove it from the finalFilteredList
            finalFilteredList.splice(randomItemIndex,1);
            //console.log("Budget Remaining: ", remainingBudget);
        }
        else
        {
            //remove it from the finalFilteredList
            finalFilteredList.splice(randomItemIndex,1);
        }
    }

    console.log("Items in order: ", orderItems);
    //console.log("Budget Remaining: ", remainingBudget);
    let orderItemIDs = [];
    if(orderItems.length > 0)
    {
        orderItems.forEach(item => {
            orderItemIDs.push(item.id);
        });
        //console.log(orderItemIDs);
        //GENERATE & POST ORDER
        const response1 = await OrdersModel.createOrder(user_id);
        const order_id = response1.id;
        const response2 = await OrdersModel.addItemsToOrder(order_id, orderItemIDs);
        const response3 = await ItemsModel.addItemsToInventory(user_id, orderItemIDs);
        console.log("Created Order!");
        res.json(orderItems).status(200);
    }
    else
    {
        console.log("No items found matching the quiz criteria");
        res.json({success: false}).status(500);
    }
    
});

module.exports = router;
