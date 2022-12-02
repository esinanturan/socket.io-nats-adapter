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
const NatsIoClient_1 = __importDefault(require("../service/NatsIoClient"));
const debug = require('debug')('socket.io-adapter:pubsub');
class PubSubModule {
    constructor(natsIoClient) {
        this.subs = new Map();
        this.natsIoClient = natsIoClient || new NatsIoClient_1.default(['localhost:4222']);
    }
    init(requestChannel, onrequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.natsIoClient.initialize();
            (_a = this.subBind()) === null || _a === void 0 ? void 0 : _a.subscribe(requestChannel + '*', { callback: (err, msg) => onrequest('*', err, msg) });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.natsIoClient.close();
        });
    }
    publishRaw(room, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.natsIoClient.publishRaw(room, payload);
        });
    }
    publish(room, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.natsIoClient.publish(room, payload);
        });
    }
    getBinder(room, channel) {
        debug('subscribe %s %s', room, channel);
        return this.subs.get(channel + room) === undefined ? this.subBind() : undefined;
    }
    subBind() {
        return this.natsIoClient.subBind();
    }
    register(subject, sub) {
        this.subs.set(subject, sub);
    }
    unsubscribe(subject) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.subs.get(subject)) === null || _a === void 0 ? void 0 : _a.unsubscribe());
            this.subs.delete(subject);
        });
    }
}
exports.default = PubSubModule;
