/**
 * Created by anuradhawick on 6/8/17.
 */
// const WebSocket = require('ws');
import * as WebSocket from 'ws';
const uuid = require('uuid/v4');
const wss = new WebSocket.Server({port: 8080});
const _ = require('lodash');


export class WebSocketHandler() {
    
}

let connections = {};
let connectionsCount = 0;

const wsTemplate = {
    username: null,
    peerId: null,
};


wss.on('connection', function connection(ws, req) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function handleMessage(message) {
        const data = JSON.parse(message);
        console.log(data);
        switch (data.type) {
            case 'register':
                let wsObj = _.cloneDeep(wsTemplate);
                wsObj.username = data.username;
                wsObj.peerId = data.peerId;
                connectionsCount++;
                connections[wsObj.peerId] = wsObj;
                break;
            case 'offer':
                // Find the target peer and send the signal
                break;
            case 'answer':
                // send the initiator and send the signal
                break;
        }
    });
});

function heartbeat() {
    this.isAlive = true;
}

setInterval(function ping() {
    console.log('interval actions');
    wss.clients.forEach(function each(ws) {
        console.log('each ws ', ws.uuid);
        if (ws.isAlive === false) {
            console.log('socket destroyed');
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 5000);