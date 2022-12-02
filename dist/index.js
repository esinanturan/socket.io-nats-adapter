"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NatsIoClient_1 = __importDefault(require("./service/NatsIoClient"));
const adapter_1 = __importDefault(require("./adapter"));
exports.createAdapter = createAdapter;
exports.NatsIoAdapter = adapter_1.default;
exports.NatsIoClient = NatsIoClient_1.default;
/**
 * Returns a function that will create a NatsIoAdapter instance
 *
 * @param natsIoClient - a nats.io client that will be used to pub/sub messages
 *
 * @public
 */
function createAdapter(natsIoClient) {
    return function (nsp) {
        return new adapter_1.default(nsp, natsIoClient);
    };
}
