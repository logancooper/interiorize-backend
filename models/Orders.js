const db = require('./conn');

class OrdersModel {
    constructor(id, user_id, created_date) {
        this.id = id;
        this.user_id = user_id;
        this.created_date = created_date;
    };

    //Get all orders in the database
    static async getAll() {
        try {
            const response = await db.any(`
                SELECT * FROM orders; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    }

    // Get all orders for a user and sort by newest
    static async getByUserID(user_id) {
        try {
            const response = await db.any(`
                SELECT * FROM orders
                WHERE user_id = ${user_id}
                ORDER BY created_date DESC; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    }
}

module.exports = OrdersModel;