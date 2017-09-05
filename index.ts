/**
 * Created by anuradhawick on 7/5/17.
 */
require('dotenv').config();

import WebSocketHandler from './socket-handler/websocket-handler';
import WebHander from './web-handler/web-handler';

const wh = new WebHander();
wh.start();
const wss = new WebSocketHandler(wh.getServer());
console.log('Started WS Server');

