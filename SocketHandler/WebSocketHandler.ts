/**
 * Created by anuradhawick on 6/8/17.
 */

import * as WebSocket from 'ws';
import * as _ from 'lodash';

import UserManagement from '../UserManagement/UserManagement';


export default class WebSocketHandler {
    wss: WebSocket.Server;
    // Indexed by device id and username
    static activeUsers: Object = {};

    constructor() {
        this.wss = new WebSocket.Server({port: 8080});
        this.init();
    }

    init() {
        this.wss.on('connection', (ws: WebSocket) => WebSocketHandler.connected(ws));
    }

    static connected(ws: WebSocket) {
        ws.on('message', (data: string) => WebSocketHandler.onMessage(data, ws));
        ws.on('close', () => WebSocketHandler.onClose(ws));
    }

    static onMessage(msg: string, ws: WebSocket) {
        let msgObj;
        try {
            msgObj = JSON.parse(msg);
            WebSocketHandler.parseMessage(msgObj, ws);
        } catch (e) {
            // Do nothing
        }
    }

    static onClose(ws: WebSocket) {
        console.log('closed');
        ws.close();
    }

    static async parseMessage(msg: any, ws: WebSocket) {

        switch (msg.type) {
            // register the user in central server
            case 'createAccount':
                let userData = msg.data;
                let status = await UserManagement.createUser(userData);
                ws.send(JSON.stringify({success: status, error: !status ? 'user exists' : ''}));
                break;
            case 'registerDevice':
                let deviceInfo = msg.data;
                // Update -> check if already registered
                WebSocketHandler.activeUsers[deviceInfo.deviceId] = {ws: ws};
                ws.send(JSON.stringify({success: true, error: ''}));
                break;
            case 'connectTo':
                let targetInfo = msg.data;
                break;
            case 'isOnline':
                let info = msg.data;
                if (_.get(WebSocketHandler.activeUsers, info.targetId, false)) {
                    ws.send(true);
                } else {
                    ws.send(false);
                }
                break;
            case 'getActiveDevices':
                break;
        }
    }
}
/**
 * security needs to be added using tokens or something
 * Sample messages
 * createAccount {"username":"anuradha","firstName":"Anuradha","lastName":"Wickramarachchi","password":"1234"}
 * registerDevice {"username":"anuradha","deviceId":"device1234"}
 * connectTo {"targetId":"device1234","offer":<OFFER STRING>}
 * isOnline {"targetId":"device1234"}
 */