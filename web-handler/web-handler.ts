/**
 * Created by anuradhawick on 9/5/17.
 */
import * as express from 'express';
import * as http from 'http';
import * as  bodyParser from 'body-parser';
import * as cors from 'cors';
import * as  morgan from 'morgan';
import * as  compression from 'compression';
import router from './auth-routes';

export default class WebHandler {
    app: express.Application;
    server: http.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.use(morgan('dev'));

        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.app.use(cors());
    }

    start() {
        // add routes
        this.app.use(router);
        this.server.listen(process.env.PORT, () => {
            console.info('Server started on port %d', process.env.PORT);
        });
    }

    getServer() {
        return this.server;
    }

}