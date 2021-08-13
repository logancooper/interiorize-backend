const express = require('express');
const UsersModel = require('../models/Users');
const router = express.Router();

//GET single user data or all user data
router.get('/:user_sub?', async (req, res) => {
    if (!!req.params.user_sub) {
        const { user } = req.params;
        const singleUser = await UsersModel.getUser(user_sub);
        if (singleUser.count = 0) {
            res.send(singleUser)
        }
        res.json(singleUser).status(200);
    } else {
        const allUsers = await UsersModel.getAll();
        res.json(allUsers).status(200);
    }
});

//POST - add new user
router.post('/add', async (req, res) => {
    const response = await UsersModel.add(req.body);
    res.send(response);
});

//POST - delete existing user
router.post('/delete', async (req, res) => {
    const response = await UsersModel.delete(req.body.user_id);
    res.status(200).send(response);
});

//POST - update existing user
router.post('/update', async (req, res) => {
    const response = await UsersModel.update(req.body);
    res.status(200).send(response);
});


module.exports = router;