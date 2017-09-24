/**
 * Created by anuradhawick on 9/5/17.
 */
import * as express from 'express';
import * as _ from 'lodash';

import UserManagement from '../user-management/user-management';

const router = express.Router();

router.post('/login', async (req, res, next) => {
    res.set('Content-Type', 'application/json');

    const userData = req.body;
    const user = <any>await UserManagement.searchUser(userData);

    let result = {success: false, device: [],message:""};
    if (_.isEmpty(user)) {
        result.message="Invalid";
        res.send(result);
    } else {
        if (user.device) {
            result.device = user.device;
            result.success = true;
            res.send(result);
        } else {
            result.message="NoDevice";
            res.send(result);
        }

    }


});

export default router;