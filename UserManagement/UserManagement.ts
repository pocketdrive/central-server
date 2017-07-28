/**
 * Created by anuradhawick on 7/5/17.
 */

import * as DataStore from 'nedb';
import * as _ from 'lodash';

export default class UserManagement {
    static db = new DataStore({filename: './db/users.db', autoload: true});

    static async createUser(userData) {
        const user = await new Promise(resolve =>
            UserManagement.db.findOne({username: userData.username}, (err, doc) => resolve(doc))
        );

        if (_.isEmpty(user)) {
            UserManagement.db.insert(userData);
            return true;
        } else {
            return false;
        }
    }

    static async deleteUser() {

    }

    static async updateUser() {

    }
}