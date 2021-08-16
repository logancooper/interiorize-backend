const db = require('./conn');

class QuizzesModel {
    constructor(id, user_sub, budget, color_one_id, color_two_id, color_three_id, category_id) {
        this.id = id;
        this.user_sub = user_sub;
        this.budget = budget;
        this.color_one_id = color_one_id;
        this.color_two_id = color_two_id;
        this.color_three_id = color_three_id;
        this.category_id = category_id;
        this.style_id = style_id;
    };

    static async getAllUserQuizData(user_id) {
        try {
            const response = await db.one(`
                SELECT user_id, budget, json_agg(json_build_array(color_one_id, color_two_id, color_three_id)) as colors, category_name FROM quizzes
                INNER JOIN categories ON categories.id = quizzes.category_id
                WHERE user_id = ${user_id}
                GROUP BY user_id, budget, category_name; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async addQuizData(reqBody) {
        console.log(reqBody)
        const { user_id, budget, color_one_id, color_two_id, color_three_id, category_id, style_id } = reqBody;
        try {
            const response = await db.any(`
                INSERT INTO quizzes
                    (user_id, budget, color_one_id, color_two_id, color_three_id, category_id, style_id)
                VALUES
                    (${user_id}, ${budget}, ${color_one_id}, ${color_two_id}, ${color_three_id}, ${category_id}, ${style_id}); `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async updateQuizData(reqBody) {
        const { user_id, budget, color_one_id, color_two_id, color_three_id, category_id } = reqBody;
        try {
            const response = await db.one(`
                UPDATE quizzes
                SET budget = ${budget},
                    color_one_id = ${color_one_id},
                    color_two_id = ${color_two_id},
                    color_three_id = ${color_three_id},
                    category_id = ${category_id}
                WHERE user_id = ${user_id}; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };
};

module.exports = QuizzesModel;