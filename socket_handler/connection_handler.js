/**
 * Created by anuradhawick on 6/8/17.
 */
const clients = [];

function handleConnection(wss) {
    wss.on('connection', function connection(ws, req) {
        clients.push(ws);
        ws.on('message', function handleMessage(message) {
            for (i = 0; i < clients.length; i++) {
                if (ws !== clients[i]) {
                    try {
                        clients[i].send(message);
                    } catch (e) {
                        continue;
                    }
                }
            }
        });
    });
}

module.exports = {
    handleConnection
};