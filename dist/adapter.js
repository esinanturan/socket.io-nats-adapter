"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_adapter_1 = require("socket.io-adapter");
const requestBuilder_1 = __importDefault(require("./builder/requestBuilder"));
const responseBuilder_1 = __importDefault(require("./builder/responseBuilder"));
const msgPackModule_1 = __importDefault(require("./module/msgPackModule"));
const requestStoreModule_1 = __importDefault(require("./module/requestStoreModule"));
const pubSubModule_1 = __importDefault(require("./module/pubSubModule"));
const UniqueId_1 = __importDefault(require("./service/UniqueId"));
const debug = require('debug')('socket.io-adapter');
/**
 * Returns a function that will create a NatsIoAdapter instance
 *
 * @param natsIoClient - a nats.io client that will be used to pub/sub messages
 *
 * @public
 */
class NatsIoAdapter extends socket_io_adapter_1.Adapter {
    /**
     * Adapter constructor
     *
     * @param nsp - the namespace
     * @param natsIoClient - a nats.io client that will be used to pub/sub messages
     */
    constructor(nsp, natsIoClient) {
        super(nsp);
        this.requestsTimeout = 500;
        this.uid = new UniqueId_1.default().toString();
        const prefix = 'socket.io';
        this.channel = `${prefix}${nsp.name}`;
        this.requestChannel = `${prefix}-reqeust${nsp.name}`;
        this.responseChannel = `${prefix}-response${nsp.name}`;
        this.RequestStoreModule = new requestStoreModule_1.default(this.requestsTimeout);
        this.pubsub = new pubSubModule_1.default(natsIoClient);
        this.init();
    }
    //-----------------------------------------------
    // methods for node cluster
    allRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('AllRooms method');
            const localRooms = new Set(this.rooms.keys());
            return this.sendRequestWithPromise({ type: 'ALL_ROOMS', requestId: new UniqueId_1.default().toString() }, { rooms: localRooms });
        });
    }
    remoteJoin(id, room) {
        debug('RemoteJoin method');
        const socket = this.nsp.sockets.get(id);
        if (socket) {
            socket.join(room);
            return Promise.resolve();
        }
        return this.sendRequestWithPromise({ type: 'REMOTE_JOIN', requestId: new UniqueId_1.default().toString(), socketId: id, room, }, {});
    }
    remoteLeave(id, room) {
        debug('RemoteLeave method');
        const socket = this.nsp.sockets.get(id);
        if (socket) {
            socket.leave(room);
            return Promise.resolve();
        }
        return this.sendRequestWithPromise({ type: 'REMOTE_LEAVE', requestId: new UniqueId_1.default().toString(), socketId: id, room, }, {});
    }
    remoteDisconnect(id, close) {
        const socket = this.nsp.sockets.get(id);
        if (socket) {
            socket.disconnect(close);
            return Promise.resolve();
        }
        return this.sendRequestWithPromise({ type: 'REMOTE_DISCONNECT', requestId: new UniqueId_1.default().toString(), socketId: id, close, }, {});
    }
    //-----------------------------------------------
    // Override methods to implement adapter
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('init');
            yield this.pubsub.init(this.requestChannel, this.onrequest);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('close');
            yield this.pubsub.close();
        });
    }
    addAll(id, rooms) {
        const _super = Object.create(null, {
            addAll: { get: () => super.addAll }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('Internal addAll');
            _super.addAll.call(this, id, rooms);
            for (const room of this.rooms.keys()) {
                const sub = (_a = this.pubsub.getBinder(room, this.channel)) === null || _a === void 0 ? void 0 : _a.subscribe(this.channel + room, { callback: (err, msg) => this.onmessage(room, err, msg) });
                if (sub) {
                    this.pubsub.register(this.channel + room, sub);
                }
            }
        });
    }
    del(id, room) {
        const _super = Object.create(null, {
            del: { get: () => super.del }
        });
        return __awaiter(this, void 0, void 0, function* () {
            debug('Internal del');
            this.unsub(id, room);
            _super.del.call(this, id, room);
        });
    }
    delAll(id) {
        const _super = Object.create(null, {
            delAll: { get: () => super.delAll }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('Internal delAll');
            if (!this.sids.has(id)) {
                return;
            }
            (_a = this.sids.get(id)) === null || _a === void 0 ? void 0 : _a.forEach(room => this.unsub(id, room));
            _super.delAll.call(this, id);
        });
    }
    unsub(id, room) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Internal unsub');
            const _room = this.rooms.get(room);
            if (_room != null && _room.size === 1 && _room.has(id)) {
                yield this.pubsub.unsubscribe(this.channel + room);
            }
        });
    }
    broadcast(packet, opts) {
        const _super = Object.create(null, {
            broadcast: { get: () => super.broadcast }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('Broadcast');
            packet.nsp = this.nsp.name;
            _super.broadcast.call(this, packet, opts);
            if ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) {
                return;
            }
            const proms = [];
            opts.rooms.forEach((room) => proms.push(this.sendMessage(packet, room, opts)));
            yield Promise.allSettled(proms);
        });
    }
    sockets(rooms) {
        const _super = Object.create(null, {
            sockets: { get: () => super.sockets }
        });
        return __awaiter(this, void 0, void 0, function* () {
            debug('Internal sockets');
            const localSockets = yield _super.sockets.call(this, rooms);
            return this.sendRequestWithPromise({ type: 'SOCKETS', requestId: new UniqueId_1.default().toString(), rooms: [...rooms], }, { sockets: localSockets });
        });
    }
    fetchSockets(opts) {
        const _super = Object.create(null, {
            fetchSockets: { get: () => super.fetchSockets }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('FetchSocket');
            const sockets = yield _super.fetchSockets.call(this, opts);
            if ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) {
                return sockets;
            }
            return yield this.sendRequestWithPromise(requestBuilder_1.default.remoteFetch(opts), { sockets: sockets });
        });
    }
    addSockets(opts, rooms) {
        const _super = Object.create(null, {
            addSockets: { get: () => super.addSockets }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('addSocket');
            _super.addSockets.call(this, opts, rooms);
            if ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) {
                return;
            }
            return yield this.sendRequest(requestBuilder_1.default.addSockets(opts, rooms));
        });
    }
    delSockets(opts, rooms) {
        const _super = Object.create(null, {
            delSockets: { get: () => super.delSockets }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('delSocket');
            _super.delSockets.call(this, opts, rooms);
            if ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) {
                return;
            }
            return yield this.sendRequest(requestBuilder_1.default.delSockets(opts, rooms));
        });
    }
    disconnectSockets(opts, close) {
        const _super = Object.create(null, {
            disconnectSockets: { get: () => super.disconnectSockets }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            debug('disConnectSocket');
            _super.disconnectSockets.call(this, opts, close);
            if ((_a = opts.flags) === null || _a === void 0 ? void 0 : _a.local) {
                return;
            }
            return yield this.sendRequest(requestBuilder_1.default.disconnSockets(opts, close));
        });
    }
    serverSideEmit(packet) {
        this.sendRequest(requestBuilder_1.default.serverSideEmit(this.uid, packet));
    }
    //-----------------------------------------------
    // Message logic
    onmessage(room, err, msg) {
        debug('onmessage on %s', room);
        if (err) {
            this.emit('error', err);
            return;
        }
        if (!room || !this.rooms.has(room)) {
            return;
        }
        const { uid, packet, opts: _opts } = msgPackModule_1.default.decodeMessage(msg.data);
        if (this.uid === uid || !msg.subject.includes(this.nsp.name)) {
            return;
        }
        super.broadcast(packet, {
            rooms: new Set(_opts.rooms),
            except: new Set(_opts.except),
        });
    }
    sendMessage(packet, room, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pubsub.publishRaw(this.channel + room, msgPackModule_1.default.encodeMessage(this.uid, room, packet, opts));
        });
    }
    //-----------------------------------------------
    // Request logic (Request from other node)
    onrequest(_room, err, msg) {
        if (err) {
            return this.emit('error', err);
        }
        if (msg.subject.includes(this.requestChannel)) {
            this._onrequest(msgPackModule_1.default.decodeRequestPayload(msg.data));
        }
    }
    _onrequest(request) {
        const _super = Object.create(null, {
            sockets: { get: () => super.sockets },
            fetchSockets: { get: () => super.fetchSockets },
            addSockets: { get: () => super.addSockets },
            delSockets: { get: () => super.delSockets },
            disconnectSockets: { get: () => super.disconnectSockets }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (request.type === 'ALL_ROOMS') {
                const rooms = this.rooms.keys();
                yield this.sendResponse(request.type, responseBuilder_1.default.allRooms(request, rooms));
            }
            else if (request.type === 'SOCKETS') {
                const sockets = yield _super.sockets.call(this, new Set(request.rooms));
                yield this.sendResponse(request.type, responseBuilder_1.default.sockets(request, sockets));
            }
            else if (request.type === 'REMOTE_JOIN') {
                const socket = this.nsp.sockets.get(request.socketId);
                if (!socket) {
                    return;
                }
                socket.join(request.room);
                yield this.sendResponse(request.type, responseBuilder_1.default.bare(request));
            }
            else if (request.type === 'REMOTE_LEAVE') {
                const socket = this.nsp.sockets.get(request.socketId);
                if (!socket) {
                    return;
                }
                socket.leave(request.room);
                yield this.sendResponse(request.type, responseBuilder_1.default.bare(request));
            }
            else if (request.type === 'REMOTE_DISCONNECT') {
                const socket = this.nsp.sockets.get(request.socketId);
                if (!socket) {
                    return;
                }
                socket.disconnect(request.close);
                yield this.sendResponse(request.type, responseBuilder_1.default.bare(request));
            }
            else if (request.type === 'REMOTE_FETCH') {
                const sockets = yield _super.fetchSockets.call(this, responseBuilder_1.default.broadcastOpt(request));
                yield this.sendResponse(request.type, responseBuilder_1.default.remoteFetch(request, sockets));
            }
            else if (request.type === 'ADD_SOCKETS') {
                _super.addSockets.call(this, responseBuilder_1.default.broadcastOpt(request), request.rooms);
            }
            else if (request.type === 'DEL_SOCKETS') {
                _super.delSockets.call(this, responseBuilder_1.default.broadcastOpt(request), request.rooms);
            }
            else if (request.type === 'DISCONNECT_SOCKETS') {
                _super.disconnectSockets.call(this, responseBuilder_1.default.broadcastOpt(request), request.close);
            }
        });
    }
    //-----------------------------------------------
    // Response logic (Response from other node)
    onresponse(requestId, err, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return this.emit('error', err);
            }
            const request = this.RequestStoreModule.get(requestId);
            if (!request) {
                return;
            }
            const response = msgPackModule_1.default.decodeResponsePayload(request.type, msg.data);
            yield this._onresponse(requestId, request, response);
        });
    }
    _onresponse(id, request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.type === 'ALL_ROOMS') {
                const { rooms } = response;
                rooms.forEach((s) => request.payload.rooms.add(s));
                this.updateRequest(request, id);
            }
            else if (request.type === 'SOCKETS') {
                const { sockets } = response;
                sockets.forEach((s) => request.payload.sockets.add(s));
                this.updateRequest(request, id);
            }
            else if (request.type === 'REMOTE_FETCH') {
                const { sockets } = response;
                sockets.forEach((s) => request.payload.sockets.push(s));
                this.updateRequest(request, id);
            }
            else if (['REMOTE_JOIN', 'REMOTE_LEAVE', 'REMOTE_DISCONNECT'].includes(request.type)) {
                this.updateRequest(request, id);
            }
        });
    }
    //-----------------------------------------------
    // Request/response type guard
    sendRequest(payload) {
        this.pubsub.publishRaw(this.requestChannel, msgPackModule_1.default.encodeRequestPayload(payload));
    }
    sendRequestWithPromise(payload, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!('requestId' in payload) || !payload.requestId) {
                return new Promise(() => { });
            }
            const type = payload.type;
            const requestId = payload.requestId;
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                yield this.RequestStoreModule.put(requestId, type, res, rej, opts);
                setTimeout(() => this.resolveReqWithTimeout(requestId), this.requestsTimeout);
                this.pubsub.publishRaw(this.requestChannel, msgPackModule_1.default.encodeRequestPayload(payload));
                const sub = (_a = this.pubsub.getBinder(requestId, this.responseChannel)) === null || _a === void 0 ? void 0 : _a.subscribe(this.responseChannel + requestId, { callback: (err, msg) => this.onresponse(requestId, err, msg) });
                if (sub) {
                    this.pubsub.register(this.responseChannel + requestId, sub);
                }
            }));
        });
    }
    sendResponse(requestType, payload) {
        this.pubsub.publishRaw(this.responseChannel + payload.requestId, msgPackModule_1.default.encodeResponsePayload(requestType, payload));
    }
    // ------------------------------------------
    // Promise clear process
    updateRequest(request, requestId) {
        if (!request.resolve) {
            return;
        }
        if (['REMOTE_JOIN', 'REMOTE_LEAVE', 'REMOTE_DISCONNECT'].includes(request.type)) {
            this.clearProcess(requestId);
            request.resolve();
        }
    }
    resolveReqWithTimeout(requestId) {
        const request = this.RequestStoreModule.get(requestId);
        if (!request) {
            return;
        }
        this.clearProcess(requestId);
        if (request.type === 'SOCKETS') {
            request.resolve(request.payload.sockets);
        }
        else if (request.type === 'ALL_ROOMS') {
            request.resolve(request.payload.rooms);
        }
        else if (request.type === 'REMOTE_FETCH') {
            request.resolve(request.payload.sockets);
        }
    }
    clearProcess(requestId) {
        this.RequestStoreModule.del(requestId);
        this.pubsub.unsubscribe(this.responseChannel + requestId);
    }
}
exports.default = NatsIoAdapter;
