'use strict';

const express = require('express');
const ItemsModel = require('../models/Items');
const router = express.Router();

//GET by color palette/tag or get all items

router.get('/?', async (req, res) => {
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

module.exports = router;
