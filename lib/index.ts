import NatsIoClient from "./service/NatsIoClient";
import NatsIoAdapter from "./adapter";

/**
 * Returns a function that will create a NatsIoAdapter instance
 *
 * @param natsIoClient - a nats.io client that will be used to pub/sub messages
 *
 * @public
 */
function createAdapter(natsIoClient?: NatsIoClient) {
  return function (nsp: any) {
    return new NatsIoAdapter(nsp, natsIoClient);
  };
}

export { createAdapter, NatsIoAdapter, NatsIoClient };
