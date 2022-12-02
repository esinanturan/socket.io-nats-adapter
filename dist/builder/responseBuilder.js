"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function allRooms(request, rooms) {
    if (request.type !== 'ALL_ROOMS') {
        throw new Error('Cannot build ALL_ROOMS request');
    }
    return {
        requestId: request.requestId,
        rooms: [...rooms],
    };
}
function broadcastOpt(request) {
    if (request.type !== 'ADD_SOCKETS'
        && request.type !== 'REMOTE_FETCH'
        && request.type !== 'DEL_SOCKETS'
        && request.type !== 'DISCONNECT_SOCKETS') {
        throw new Error('Cannot build broadcastOption');
    }
    return {
        rooms: new Set(request.opts.rooms),
        except: new Set(request.opts.except),
    };
}
function bare(request) {
    if (request.type !== 'REMOTE_JOIN'
        && request.type !== 'REMOTE_LEAVE'
        && request.type !== 'REMOTE_DISCONNECT') {
        throw new Error('Bare request');
    }
    return { requestId: request.requestId };
}
function sockets(request, sockets) {
    if (request.type !== 'SOCKETS') {
        throw new Error('Cannot build SOCKETS request');
    }
    return {
        requestId: request.requestId,
        sockets: [...sockets],
    };
}
function remoteFetch(request, sockets) {
    if (request.type !== 'REMOTE_FETCH') {
        throw new Error('Cannot build REMOTE_FETCH request');
    }
    return {
        requestId: request.requestId,
        sockets: sockets.map((socket) => ({
            id: socket.id,
            handshake: socket.handshake,
            rooms: [...socket.rooms],
            data: socket.data,
        })),
    };
}
exports.default = {
    allRooms,
    bare,
    broadcastOpt,
    sockets,
    remoteFetch,
};
