import type { BroadcastOptions } from "socket.io-adapter";
import { RequestPayload } from "../adapter.types";
declare function addSockets(opts: BroadcastOptions, rooms: string[]): RequestPayload;
declare function delSockets(opts: BroadcastOptions, rooms: string[]): RequestPayload;
declare function disconnSockets(opts: BroadcastOptions, close: boolean): RequestPayload;
declare function remoteFetch(opts: BroadcastOptions): RequestPayload;
declare function serverSideEmit(uid: string, packet: any[], requestId?: string): RequestPayload;
declare const _default: {
    addSockets: typeof addSockets;
    delSockets: typeof delSockets;
    disconnSockets: typeof disconnSockets;
    remoteFetch: typeof remoteFetch;
    serverSideEmit: typeof serverSideEmit;
};
export default _default;
