import type { RequestPayload, RequestType, ResponsePayloadMapping } from '../adapter.types';
export default class MsgPackModule {
    static encodeMessage(uid: string, room: string, packet: any, opts: any): Uint8Array;
    static decodeMessage(msg: Uint8Array): {
        uid: string;
        packet: any;
        opts: any;
    };
    static encodeRequestPayload(request: RequestPayload): Uint8Array;
    static decodeRequestPayload(payload: Uint8Array): RequestPayload;
    static encodeResponsePayload<T extends RequestType>(requestType: T, response: ResponsePayloadMapping<T>): Uint8Array;
    static decodeResponsePayload<T extends RequestType>(requestType: T, payload: Uint8Array): ResponsePayloadMapping<T>;
}
