const db = require('./conn');

class UsersModel {
    constructor(id, auth0_id, first_name, last_name, email) {
        this.id = id;
        this.auth0_id = auth0_id;
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
    static async getUser(user) {
        try {
            const response = await db.any(`
                SELECT * FROM users
                WHERE auth0_id = '${user}';`
            )
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };

    static async addUser(reqBody) {
        //parse reqBody
        const { auth0_id, first_name, last_name, email } = reqBody;
        try {
            const query = `
            INSERT INTO users
            (auth0_id, first_name, last_name, email)
            VALUES
            ('${auth0_id}', '${first_name}', '${last_name}', '${email}');`;
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

    static async deleteUser(user) {
        try {
            const response = await db.one(`
            DELETE FROM users
            WHERE auth0_id = '${user}';`
            );
            return response;
        } catch (error) {
            console.error('ERROR', error)
            return error
        }
    };
}

module.exports = UsersModel;