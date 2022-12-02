import { Msg, NatsConnection, NatsError, Subscription } from 'nats';
declare type SubHandler = (err: NatsError | null, msg: Msg) => void;
export interface SubscribeBinder {
    subscribe: (topic: string, opt: {
        callback: SubHandler;
    }) => void;
}
export default class NatsIoClient {
    servers: string[];
    conn?: NatsConnection;
    constructor(servers: string[]);
    initialize(): Promise<void>;
    close(): Promise<void>;
    publish(topic: string, data: string): void;
    publishRaw(topic: string, data: Uint8Array): void;
    subBind(): SubscribeBinder | undefined;
    subscribe(topic: string, callback?: SubHandler): Subscription | null;
    unsubscribe(topic: string): void;
    private eventListener;
    private replaceConn;
}
export {};
