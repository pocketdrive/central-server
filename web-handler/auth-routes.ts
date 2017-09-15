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
    const user  = await UserManagement.searchUser(userData);

    let result = {success:false};
    if(_.isEmpty(user)) {
        res.send(result);
    } else {
        result.success=true;
        res.send(result);
    }





});

export default router;