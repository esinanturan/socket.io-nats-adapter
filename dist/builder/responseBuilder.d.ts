import type { RequestPayload } from '../adapter.types';
declare function allRooms(request: RequestPayload, rooms: IterableIterator<string>): {
    requestId: string;
    rooms: string[];
};
declare function broadcastOpt(request: RequestPayload): {
    rooms: Set<string>;
    except: Set<string>;
};
declare function bare(request: RequestPayload): {
    requestId: string;
};
declare function sockets(request: RequestPayload, sockets: Set<string>): {
    requestId: string;
    sockets: string[];
};
declare function remoteFetch(request: RequestPayload, sockets: any[]): {
    requestId: string;
    sockets: {
        id: any;
        handshake: any;
        rooms: any[];
        data: any;
    }[];
};
declare const _default: {
    allRooms: typeof allRooms;
    bare: typeof bare;
    broadcastOpt: typeof broadcastOpt;
    sockets: typeof sockets;
    remoteFetch: typeof remoteFetch;
};
export default _default;
