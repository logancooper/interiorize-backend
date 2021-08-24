const express = require('express');
const UsersModel = require('../models/Users');
const router = express.Router();
const checkJwt = require('../utilities');

router.use(checkJwt);

//GET single user data or all user data
router.get('/:user_sub?', async (req, res) => {
    if (req.params.user_sub) {
        const { user_sub } = req.params;
        const singleUser = await UsersModel.getUser(user_sub);
        res.json(singleUser).status(200);
    } else {
        const allUsers = await UsersModel.getAll();
        res.json(allUsers).status(200);
    }
});

//POST - add new user
router.post('/add', async (req, res) => {
    const response = await UsersModel.addUser(req.body);
    res.send(response);
});

//POST - delete existing user
router.post('/delete', async (req, res) => {
    const response = await UsersModel.delete(req.body.user_sub);
    res.status(200).send(response);
});

//POST - update existing user
router.post('/update', async (req, res) => {
    const response = await UsersModel.update(req.body);
    res.status(200).send(response);
});

//GET avoid array for a user
router.get('/avoid/:user_id', async (req, res) => {
    if (!!req.params.user_id) {
        const { user_id } = req.params;
        const avoidData = await UsersModel.getUserAvoidData(user_id);
        res.json(avoidData[0].avoid_tags).status(200);
    }
});

//GET avoid array of strings
router.get('/avoid/string/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const avoidStrings = await UsersModel.getUserAvoidStrings(user_id);
    res.json(avoidStrings[0].avoid_tags).status(200);
});

//POST add initial avoid data for a user
router.post('/avoid/add', async (req, res) => {
    const { user_id, avoid_tags } = req.body;
    const response = await UsersModel.addAvoidData(user_id, avoid_tags);
    res.json(response).status(200);
});

//POST delete and reinsert avoid array for a user
router.post('/avoid/update', async (req, res) => {
    const { user_id, avoid_tags } = req.body;
    const response1 = await UsersModel.deleteAvoidData(user_id);
    if (avoid_tags[0] === '' || avoid_tags.length === 0) {
        res.json({
            deleteResponse: response1,
            addResponse: {}
        }).status(200);
    } else {
        const response2 = await UsersModel.addAvoidData(user_id, avoid_tags);
        res.json({
            deleteResponse: response1,
            addResponse: response2
        }).status(200);
    }
});


module.exports = router;