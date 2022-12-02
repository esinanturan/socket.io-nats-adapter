import { Msg, NatsError, Subscription } from 'nats';
import NatsIoClient, { SubscribeBinder } from '../service/NatsIoClient';
declare type Handler = (room: string, err: NatsError | null, msg: Msg) => void;
export default class PubSubModule {
    private subs;
    private natsIoClient;
    constructor(natsIoClient?: NatsIoClient);
    init(requestChannel: string, onrequest: Handler): Promise<void>;
    close(): Promise<void>;
    publishRaw(room: string, payload: Uint8Array): Promise<void>;
    publish(room: string, payload: string): Promise<void>;
    getBinder(room: string, channel: string): SubscribeBinder | undefined;
    private subBind;
    register(subject: string, sub: Subscription): void;
    unsubscribe(subject: string): Promise<void>;
}
export {};
