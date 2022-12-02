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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const nats_1 = require("nats");
class NatsIoClient {
    constructor(servers) {
        this.servers = servers;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.conn = yield (0, nats_1.connect)({
                servers: this.servers,
                noEcho: true,
            });
            console.log(`connected to ${this.conn.getServer()}`);
            this.eventListener(this.conn);
        });
    }
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.conn) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
    publish(topic, data) {
        if (!this.conn) {
            return;
        }
        const payload = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            payload.set([data.charCodeAt(i)], i);
        }
        this.conn.publish(topic, payload);
    }
    publishRaw(topic, data) {
        if (!this.conn) {
            return;
        }
        this.conn.publish(topic, data);
    }
    subBind() {
        return this.conn;
    }
    subscribe(topic, callback) {
        if (!this.conn) {
            return null;
        }
        if (callback) {
            return this.conn.subscribe(topic, { callback: callback });
        }
        return this.conn.subscribe(topic);
    }
    unsubscribe(topic) {
        var _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.subscribe(topic);
    }
    //
    eventListener(conn) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!conn) {
                return;
            }
            try {
                for (var _b = __asyncValues(conn.status()), _c; _c = yield _b.next(), !_c.done;) {
                    const status = _c.value;
                    console.log(`Event ${status.type} received: ${status.data}`);
                    if (status.type === nats_1.Events.LDM || status.type === nats_1.Events.Disconnect) {
                        yield this.replaceConn();
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    replaceConn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conn) {
                return;
            }
            const newbie = yield (0, nats_1.connect)({
                servers: this.servers,
                noEcho: true,
            });
            this.conn.drain()
                .then(() => {
                this.conn = newbie;
                this.eventListener(newbie);
            });
        });
    }
}
exports.default = NatsIoClient;
