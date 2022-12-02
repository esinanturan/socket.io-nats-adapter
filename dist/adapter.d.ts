import { Adapter, BroadcastOptions, Room, SocketId } from 'socket.io-adapter';
import NatsIoClient from './service/NatsIoClient';
/**
 * Returns a function that will create a NatsIoAdapter instance
 *
 * @param natsIoClient - a nats.io client that will be used to pub/sub messages
 *
 * @public
 */
export default class NatsIoAdapter extends Adapter {
    readonly requestsTimeout: number;
    readonly uid: string;
    private readonly channel;
    private readonly requestChannel;
    private readonly responseChannel;
    private RequestStoreModule;
    private pubsub;
    /**
     * Adapter constructor
     *
     * @param nsp - the namespace
     * @param natsIoClient - a nats.io client that will be used to pub/sub messages
     */
    constructor(nsp: any, natsIoClient?: NatsIoClient);
    allRooms(): Promise<Set<string>>;
    remoteJoin(id: SocketId, room: Room): Promise<void>;
    remoteLeave(id: SocketId, room: Room): Promise<void>;
    remoteDisconnect(id: SocketId, close?: boolean): Promise<void>;
    init(): Promise<void>;
    close(): Promise<void>;
    addAll(id: SocketId, rooms: Set<Room>): Promise<void>;
    del(id: SocketId, room: Room): Promise<void>;
    delAll(id: SocketId): Promise<void>;
    private unsub;
    broadcast(packet: any, opts: BroadcastOptions): Promise<void>;
    sockets(rooms: Set<Room>): Promise<Set<string>>;
    fetchSockets(opts: BroadcastOptions): Promise<any[]>;
    addSockets(opts: BroadcastOptions, rooms: Room[]): Promise<void>;
    delSockets(opts: BroadcastOptions, rooms: Room[]): Promise<void>;
    disconnectSockets(opts: BroadcastOptions, close: boolean): Promise<void>;
    serverSideEmit(packet: any[]): void;
    private onmessage;
    private sendMessage;
    private onrequest;
    private _onrequest;
    private onresponse;
    private _onresponse;
    private sendRequest;
    private sendRequestWithPromise;
    private sendResponse;
    private updateRequest;
    private resolveReqWithTimeout;
    private clearProcess;
}
