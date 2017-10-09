/**
 * Created by anuradhawick on 7/5/17.
 */

import * as DataStore from 'nedb';
import * as _ from 'lodash';
import * as sha256 from 'sha256';

const db = new DataStore({filename: './db/users.db', autoload: true});

export default class UserManagement {

    static createUser(userData) {
        const user = new Promise(resolve =>
            db.findOne({username: userData.username}, (err, doc) => {
                resolve(doc)
            }));
        if (_.isEmpty(user)) {
            db.insert(userData);
        }
    }

    static async deleteUser() {

    }

    static async updateUser() {

    }

    static searchUser(searchObj) {
        return new Promise(resolve =>
            db.findOne({username: searchObj.username, password: sha256(searchObj.password)},
                (err, doc) => {
                    resolve(!err ? doc : null);
                }));
    }


}