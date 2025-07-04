import WebSocket from "isomorphic-ws";
import { ConnectOptions, SubscribeOptions, WebsocketRequest } from "./types";
export declare class WsApi {
    private readonly websocketEndpoint;
    socket?: WebSocket;
    reconnectMessages: WebsocketRequest[];
    private options;
    private closed;
    private apiKey;
    constructor(options: ConnectOptions);
    changeApikey(apiKey: string): void;
    connect(): void;
    subscribe(options: SubscribeOptions, resubscribeOnReconnect?: boolean): void;
    unsubscribe(subscriptionId: string): void;
    sendSocketMessage(message: WebsocketRequest, resendOnReconnect?: boolean): void;
    closeConnection(): void;
}
