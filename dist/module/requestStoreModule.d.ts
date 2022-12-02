import type { Request, RequestType, RequestOptsMapping } from '../adapter.types';
export default class RequestStoreModule {
    private map;
    private requests;
    constructor(requestsTimeout: number);
    del(requestId: string): void;
    get(requestId: string): Request | undefined;
    put<T extends RequestType>(requestId: string, requestType: T, resolve: Function, reject: Function, opts: RequestOptsMapping<T>): void;
}
