import NatsIoClient from "./service/NatsIoClient";
import NatsIoAdapter from "./adapter";
/**
 * Returns a function that will create a NatsIoAdapter instance
 *
 * @param natsIoClient - a nats.io client that will be used to pub/sub messages
 *
 * @public
 */
declare function createAdapter(natsIoClient?: NatsIoClient): (nsp: any) => NatsIoAdapter;
export { createAdapter, NatsIoAdapter, NatsIoClient };
