const db = require('./conn');

class UsersModel {
    constructor(id, user_sub, first_name, last_name, email) {
        this.id = id;
        this.user_sub = user_sub;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    };

    //Get all users in the database
    static async getAll() {
        try {
            const response = await db.any(`
                SELECT * FROM users; `
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    //
    static async getUser(user_id) {
        try {
            const response = await db.any(`
                SELECT * FROM users
                WHERE id = ${user_id};`
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async addUser(reqBody) {
        //parse reqBody
        const { user_sub, first_name, last_name, email } = reqBody;
        try {
            const query = `
            INSERT INTO users
            (user_sub, first_name, last_name, email)
            VALUES
            ('${user_sub}', '${first_name}', '${last_name}', '${email}');`;
            const response = await db.one(query);
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    // static async updateUser() {
    //     Which things do we want to update?
    // };

    static async deleteUser(user_sub) {
        try {
            const response = await db.one(`
            DELETE FROM users
            WHERE user_sub = '${user_sub}';`
            );
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async getUserAvoidData(user_id) {
        try {
            const response = await db.any(`
                SELECT ARRAY_AGG(tag_id) as avoid_tags FROM users_avoid_tags
<<<<<<< HEAD
                INNER JOIN tags ON tags.id = users_avoid_tags.tag_id
=======
>>>>>>> 89f799283e56769fa7bc3f66e10feb7b8ce3329e
                WHERE user_id = ${user_id};
            `);
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async getUserAvoidStrings(user_id) {
        try {
            const response = await db.any(`
                SELECT ARRAY_AGG(tag_description) as avoid_tags  
                FROM users_avoid_tags
                INNER JOIN tags ON users_avoid_tags.tag_id = tags.id
                WHERE user_id = ${user_id};
            `);
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async deleteAvoidData(user_id) {
        try {
            const response = await db.any(`
                DELETE FROM users_avoid_tags
                WHERE user_id = ${user_id};
            `)
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async addAvoidData(user_id, avoid_tags) {
        let tagInserts = '';
        avoid_tags.forEach(tag => {
            if (tagInserts === '') {
                tagInserts += `(${user_id}, ${tag})`
            } else {
                tagInserts += `,(${user_id}, ${tag})`
            }
        })
        try {
            const query = `
                INSERT INTO users_avoid_tags
                    (user_id, tag_id)
                VALUES
                    ${tagInserts};
            `
            const response = await db.any(query)
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };
}

module.exports = UsersModel;
