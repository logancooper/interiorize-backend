const db = require('./conn');

class ItemsModel {
    constructor(id, description, img_src, price, brand, color_id) {
        this.id = id;
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
                SELECT * FROM items; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    //Get by tag, category, color. Need to join with colors, categories, and tags
    static async getBy(reqBody) {
        try {
            const response = await db.any(`
                SELECT * FROM items; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

}

module.exports = ItemsModel;