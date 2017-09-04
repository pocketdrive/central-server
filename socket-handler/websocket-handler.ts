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
        if (msg.event) {
            switch(msg.event) {
                case wsm.webConsoleRegister:
                    wsh.registerDevice(msg.data, ws);
                    break;
                case wsm.webConsoleRelay:
                    console.log('RELAY TO DEVICE', msg.data);
                    wsh.relayWebConsoleMessage(msg.data)
                    break;
            }
        } else {
            switch (msg.type) {
                case wsm.createAccount:
                    await wsh.createAccount(msg.data, ws);
                    break;
                case wsm.registerDevice:
                    wsh.registerDevice(msg.data, ws);
                    break;
                case wsm.connectionOffer:
                    let targetInfo = msg.data;
                    wsh.sendOfferToDevice(targetInfo, ws);
                    break;
                case wsm.acceptOffer:
                    wsh.passAnswerToTarget(msg.data);
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
}
/**
 * security needs to be added using tokens or something
 * Sample messages
 * createAccount {"username":"anuradha","firstName":"Anuradha","lastName":"Wickramarachchi","password":"1234"}
 * registerDevice {"username":"anuradha","deviceId":"device1234"}
 * connectionOffer {"deviceId":"device1234","username":"anuradha","offer":<OFFER STRING>,
 *                  "fromUsername":"username",
 *                  "fromDeviceId": "deviceId"}
 * acceptOffer {"acceptedUsername":"username", "acceptedDeviceId":"deviceId","answer":<ANSWER STRING>}
 * isOnline {"deviceId":"device1234", "username":"anuradha"}
 */