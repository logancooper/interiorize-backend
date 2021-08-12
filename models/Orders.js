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
                SELECT orders.id as order_id, users.id as user_id, created_date, array_agg(item_name) FROM orders
                INNER JOIN users ON orders.user_id = users.id
                INNER JOIN orders_items ON orders.id = orders_items.order_id
                INNER JOIN items ON orders_items.item_id = items.id
                GROUP BY orders.id, users.id, created_date; `
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
                SELECT id, created_date FROM orders
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