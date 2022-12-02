"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestStoreModule {
    constructor(requestsTimeout) {
        this.map = new Map();
        this.requests = new Map();
    }
    del(requestId) {
        this.requests.delete(requestId);
    }
    get(requestId) {
        return this.requests.get(requestId);
    }
    put(requestId, requestType, resolve, reject, opts) {
        const request = { resolve, };
        if (requestType === 'SOCKETS') {
            this.map.set(requestId, Object.assign(Object.assign({ type: requestType }, request), { payload: opts }));
        }
        else if (requestType === 'ALL_ROOMS') {
            this.map.set(requestId, Object.assign(Object.assign({ type: requestType }, request), { payload: opts }));
        }
        else if (requestType === 'REMOTE_FETCH') {
            this.map.set(requestId, Object.assign(Object.assign({ type: requestType }, request), { payload: opts }));
        }
        else if (['REMOTE_JOIN', 'REMOTE_LEAVE', 'REMOTE_DISCONNECT'].includes(requestType)) {
            this.map.set(requestId, Object.assign({ type: requestType }, request));
        }
    }
}
exports.default = RequestStoreModule;
