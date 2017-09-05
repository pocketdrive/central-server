/**
 * Created by anuradhawick on 9/5/17.
 */
import * as express from 'express';

const router = express.Router();

router.post('/login', (req, res, next) => {
    console.log(req.body);
    res.send('oh yeah');
});

export default router;