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
                SELECT item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                GROUP BY item_name, description, img_src, price, brand, category_name, color_name; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    //Get by tag, category, color. Need to write WHERE statement
    static async getBy(reqBody) {
        try {
            const response = await db.any(`
                SELECT item_name, description, img_src, price, brand, category_name, color_name, array_agg(tag_description) as tags
                FROM items
                INNER JOIN item_categories ON items.id = item_categories.item_id
                INNER JOIN categories ON categories.id = item_categories.category_id
                INNER JOIN colors ON items.color_id = colors.id
                INNER JOIN items_tags ON items.id = items_tags.item_id
                INNER JOIN tags ON tags.id = items_tags.tag_id
                GROUP BY item_name, description, img_src, price, brand, category_name, color_name; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

}

module.exports = ItemsModel;