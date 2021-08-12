'use strict';

const express = require('express');
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

module.exports = router;