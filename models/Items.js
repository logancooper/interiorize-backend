const db = require('./conn');

class ItemsModel {
    constructor(id, item_name, description, img_src, price, brand, color_id) {
        this.id = id;
        this.item_name = item_name;
        this.description = description;
        this.img_src = img_src;
        this.price = price;
        this.brand = brand;
        this.color_id = color_id;
    };

    //Get all items in the database
    //Need to join with colors, categories, and tags
    static async getAll() {
        try {
            const response = await db.any(`
                SELECT items.id, item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                GROUP BY items.id, item_name, description, img_src, price, brand, category_name, color_name; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    //Get by tag, category, color. Need to write WHERE statement
    static async getBy(category) {
        try {
            // if category AND not color and not price , query1
            
            const response = await db.any(`
                SELECT item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                WHERE categories.id = ${category}
                GROUP BY item_name, description, img_src, price, brand, category_name, color_name;
            `)
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async getItemsByOrder(order_id) {
        try {
            const response = await db.any(`
                SELECT item_name, description, img_src, price, brand 
                FROM items
                INNER JOIN orders_items ON orders_items.item_id = items.id
                WHERE order_id = ${order_id}; 
            `)
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error;
        }
    };

    static async getSingleItem(item_id) {
        try {
            const response = await db.any(`
                SELECT item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                WHERE items.id = ${item_id}
                GROUP BY item_name, description, img_src, price, brand, category_name, color_name;
            `);
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    //GET User inventory
    static async getUserInventory(user_id)
    {
        try {
            const response = await db.any(`
                SELECT item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                INNER JOIN users_inventory ON users_inventory.item_id = items.id
                WHERE users_inventory.user_id = ${user_id}
                GROUP BY item_name, description, img_src, price, brand, category_name, color_name;
            `);
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async getItemsMatchingQuizData(user_id, budget, color_one_id, color_two_id, color_three_id, category_name)
    {
        //GET all items
        const allItems = getAll();
        //FILTER BY BUDGET & CATEGORY
        //GET user inventory
        const userInventory = getUserInventory(user_id);
        //FILTER BY INVENTORY
        //GET avoid tags
        //FILTER BY AVOID TAGS
        //FILTER BY COLORS
        try {
            const response = await db.any(`
                SELECT item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                WHERE items.id = ${item_id}
                GROUP BY item_name, description, img_src, price, brand, category_name, color_name;
            `);
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };


}

module.exports = ItemsModel;
