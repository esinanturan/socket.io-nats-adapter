"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsIoClient = exports.NatsIoAdapter = exports.createAdapter = void 0;
const NatsIoClient_1 = __importDefault(require("./service/NatsIoClient"));
exports.NatsIoClient = NatsIoClient_1.default;
const adapter_1 = __importDefault(require("./adapter"));
exports.NatsIoAdapter = adapter_1.default;
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
exports.createAdapter = createAdapter;
