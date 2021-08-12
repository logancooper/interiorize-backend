const express = require('express');
const QuizzesModel = require('../models/Quizzes');
const router = express.Router();

//GET quiz data for a user
router.get('/', async (req, res) => {
    const { user_sub } = req.body;
    const quizData = await QuizzesModel.getAllUserQuizData(user_sub);
    if (quizData.count = 0) {
        res.send(quizData)
    }
    res.json(quizData).status(200);
});

//POST - add new quiz data
router.post('/add', async (req, res) => {
    const response = await QuizzesModel.add(req.body);
    res.status(200).send(response);
});

//POST - update existing quiz data
router.post('/update', async (req, res) => {
    const response = await QuizzesModel.updateQuizData(req.body);
    res.status(200).send(response);
});


module.exports = router;