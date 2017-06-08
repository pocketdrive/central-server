/**
 * Created by anuradhawick on 6/8/17.
 */
var handleMessage = require('message_handler').handleMessage;

function handleConnection(wss) {
    wss.on('connection', function connection(ws) {
        ws.on('message', handleMessage);
    });
}

module.exports = {
    handleConnection
};