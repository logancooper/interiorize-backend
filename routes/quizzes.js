const express = require('express');
const QuizzesModel = require('../models/Quizzes');
const router = express.Router();
const checkJwt = require('../utilities');

router.use(checkJwt);

//GET quiz data for a user
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const quizData = await QuizzesModel.getAllUserQuizData(user_id);
    res.json(quizData).status(200);
});

//POST - add new quiz data
router.post('/add', async (req, res) => {
    const response = await QuizzesModel.addQuizData(req.body);
    res.status(200).send(response);
});

//POST - update existing quiz data
router.post('/update', async (req, res) => {
    const response = await QuizzesModel.updateQuizData(req.body);
    res.status(200).send(response);
});


module.exports = router;