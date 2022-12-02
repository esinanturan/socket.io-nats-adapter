"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messagepack_1 = require("messagepack");
class MsgPackModule {
    // RequestPayload: have RequestType in payload -> polymorphic interface
    // ResponsePayload: don't have RequestType in payload -> generic-specified interface
    static encodeMessage(uid, room, packet, opts) {
        const res = (0, messagepack_1.encode)({
            uid: uid,
            packet: packet,
            opts: {
                rooms: [room],
                except: [...new Set(opts.except)],
                flags: opts.flags,
            },
        });
        return res;
    }
    static decodeMessage(msg) {
        const { uid, packet, opts } = (0, messagepack_1.decode)(msg);
        return { uid, packet, opts };
    }
    static encodeRequestPayload(request) {
        return (0, messagepack_1.encode)(request);
    }
    static decodeRequestPayload(payload) {
        return (0, messagepack_1.decode)(payload);
    }
    static encodeResponsePayload(requestType, response) {
        return (0, messagepack_1.encode)(response);
    }
    static decodeResponsePayload(requestType, payload) {
        return (0, messagepack_1.decode)(payload);
    }
}
exports.default = MsgPackModule;
