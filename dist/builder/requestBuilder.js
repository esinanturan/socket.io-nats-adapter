"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UniqueId_1 = __importDefault(require("../service/UniqueId"));
function addSockets(opts, rooms) {
    return {
        type: 'ADD_SOCKETS',
        opts: {
            rooms: [...opts.rooms],
            except: opts.except ? [...opts.except] : [],
        },
        rooms: [...rooms],
    };
}
function delSockets(opts, rooms) {
    return {
        type: 'DEL_SOCKETS',
        opts: {
            rooms: [...opts.rooms],
            except: opts.except ? [...opts.except] : [],
        },
        rooms: [...rooms],
    };
}
function disconnSockets(opts, close) {
    return {
        type: 'DISCONNECT_SOCKETS',
        opts: {
            rooms: [...opts.rooms],
            except: opts.except ? [...opts.except] : [],
        },
        close,
    };
}
function remoteFetch(opts) {
    return {
        type: 'REMOTE_FETCH',
        requestId: new UniqueId_1.default().toString(),
        opts: {
            rooms: [...opts.rooms],
            except: opts.except ? [...opts.except] : [],
        },
    };
}
function serverSideEmit(uid, packet, requestId) {
    return {
        uid: uid,
        type: 'SERVER_SIDE_EMIT',
        data: packet,
        requestId: requestId,
    };
}
exports.default = {
    addSockets,
    delSockets,
    disconnSockets,
    remoteFetch,
    serverSideEmit,
};
