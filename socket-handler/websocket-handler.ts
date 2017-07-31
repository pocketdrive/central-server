/**
 * Created by anuradhawick on 6/8/17.
 */
import * as WebSocket from 'ws';

import * as wsh from './ws-helper';
import * as wsm from './ws-messages'


export default class WebSocketHandler {
    wss: WebSocket.Server;

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
        console.log('Message received: ' + msg);
        let msgObj;
        try {
            msgObj = JSON.parse(msg);
            WebSocketHandler.parseMessage(msgObj, ws);
        } catch (e) {
            // Do nothing
        }
    }

    static onClose(ws: WebSocket) {
        wsh.removeActiveUser(ws);
    }

    static async parseMessage(msg: any, ws: WebSocket) {
        switch (msg.type) {
            // register the user in central server
            case wsm.createAccount:
                await wsh.createAccount(msg.data, ws);
                break;
            case wsm.registerDevice:
                wsh.registerDevice(msg.data, ws);
                break;
            case wsm.connectTo:
                let targetInfo = msg.data;
                // TODO
                break;
            case wsm.isOnline:
                wsh.isOnline(msg.data, ws);
                break;
            case wsm.getActiveDevices:
                wsh.getOnlineUsers(ws);
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
 * isOnline {"targetId":"device1234", "username":"anuradha"}
 */