/**
 * Created by anuradhawick on 7/6/17.
 */
import * as WebSocket from 'ws';
import * as _ from 'lodash';

import UserManagement from '../user-management/user-management';
import * as wsm from './ws-messages';

const sampleMessage = {type: '', success: true, error: '', message: ''};
const sampleActiveUser: { deviceId: string, username: string, ws: WebSocket } = {deviceId: '', username: '', ws: null};

let activeUsers: Array<any> = [];

export function removeActiveUser(ws: WebSocket) {
    _.remove(activeUsers, data => {
        return data.ws === ws;
    });
    console.log('closed');
    ws.close();
}

export function registerDevice(data, ws: WebSocket) {
    let deviceInfo = data;
    let outputMessage = _.cloneDeep(sampleMessage);
    let activeUser = _.cloneDeep(sampleActiveUser);

    activeUser.username = deviceInfo.username;
    activeUser.deviceId = deviceInfo.deviceId;
    activeUser.ws = ws;

    if (_.findIndex(activeUsers, {
            deviceId: deviceInfo.deviceId,
            username: deviceInfo.username
        }) === -1) {
        activeUsers.push(activeUser);
    }

    outputMessage.type = wsm.registerDevice;
    outputMessage.message = 'Registration success';

    ws.send(JSON.stringify(outputMessage));
}

export async function createAccount(userData, ws: WebSocket) {
    let status = await UserManagement.createUser(userData);
    let outputMessage = _.cloneDeep(sampleMessage);

    outputMessage.type = wsm.createAccount;
    outputMessage.message = status ? 'Account created successfully' : 'Failed';
    outputMessage.success = status;

    ws.send(JSON.stringify(outputMessage));
}

export function isOnline(info, ws: WebSocket) {
    let index = _.findIndex(activeUsers, {
        deviceId: info.deviceId,
        username: info.username
    });
    let outputMessage = _.cloneDeep(sampleMessage);
    outputMessage.type = wsm.isOnline;

    if (index > -1) {
        outputMessage.message = 'User online';
        ws.send(JSON.stringify(outputMessage));
    } else {
        outputMessage.success = false;
        outputMessage.message = 'User offline';
        ws.send(JSON.stringify(outputMessage));
    }
}

export function getOnlineUsers(ws: WebSocket) {
    let outputMessage = _.cloneDeep(sampleMessage);
    outputMessage.type = wsm.getActiveDevices;
    outputMessage.message = 'Active users';
    outputMessage['data'] = _.map(_.cloneDeep(activeUsers), (data: any) => {
        delete data.ws;
        return data;
    });

    ws.send(JSON.stringify(outputMessage));
}

export function sendOfferToDevice(data, ws: WebSocket) {
    let outputMessage = _.cloneDeep(sampleMessage);
    let targetUser = _.find(activeUsers, {
        deviceId: data.deviceId,
        username: data.username
    });

    outputMessage.type = wsm.getActiveDevices;

    if (_.isEmpty(targetUser)) {
        outputMessage.message = 'No user found to send the offer';
        outputMessage.success = false;
        outputMessage.error = `Target user don't exists or not online`;
    } else {
        outputMessage.message = 'Sending offer to target';
        ws.send(JSON.stringify(outputMessage));

        const messageToPeer = {
            type: wsm.connectionOffer,
            offer: data.offer,
            fromUsername: data.fromUsername,
            fromDeviceId: data.fromDeviceId
        };
        targetUser.ws.send(JSON.stringify(messageToPeer));
    }
}

export function passAnswerToTarget(data) {
    let targetUser = _.find(activeUsers, {
        username: data.acceptedUsername,
        deviceId: data.acceptedDeviceId
    });

    if (!_.isEmpty(targetUser)) {
        let outputMessage = _.cloneDeep(sampleMessage);
        outputMessage.type = wsm.acceptOffer;
        outputMessage['answer'] = data.answer;
        targetUser.ws.send(JSON.stringify(outputMessage));
    }
}