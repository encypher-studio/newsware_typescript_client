import WebSocket from "isomorphic-ws";
import { Endpoint, WebsocketMethod, WebsocketResponseType } from "./enums";
const defaultOptions = {
    apiKey: "",
    reconnect: true,
    endpoint: Endpoint.PRODUCTION,
    reconnectDelay: 1000,
    errorCallback: () => { },
    openCallback: () => { },
    closeCallback: () => { },
    callback: () => { }
};
export class WsApi {
    websocketEndpoint;
    socket;
    reconnectMessages = [];
    options;
    closed = false;
    apiKey;
    constructor(options) {
        this.options = { ...defaultOptions, ...options };
        this.apiKey = options.apiKey;
        this.websocketEndpoint = this.options.endpoint.websocketProtocol + "://" + this.options.endpoint.host + "/ws/v3";
    }
    changeApikey(apiKey) {
        this.apiKey = apiKey;
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.closeConnection();
        }
        this.connect();
    }
    connect() {
        const urlParams = new URLSearchParams({
            apikey: this.apiKey,
        });
        this.socket = new WebSocket(`${this.websocketEndpoint}?${urlParams.toString()}`);
        this.socket.onmessage = (event) => {
            const response = JSON.parse(event.data.toString());
            if (response.type === WebsocketResponseType.ERROR && this.options.errorCallback) {
                this.options.errorCallback(response);
            }
            else
                this.options.callback(response);
        };
        this.socket.onerror = (event) => {
            let message = "";
            if (event.message)
                message = event.message;
            else if (event.error?.message) {
                message = event.error.message;
            }
            else if (event.error) {
                message = event.error;
            }
            if (message.includes('403')) {
                message = "Not authorized, make sure your api key is correct and active";
            }
            this.options.errorCallback({
                method: WebsocketMethod.SOCKET_ERROR,
                type: WebsocketResponseType.ERROR,
                value: {
                    message
                }
            });
        };
        this.socket.onopen = () => {
            this.options.openCallback();
            if (this.options.reconnect)
                this.reconnectMessages.map(message => this.sendSocketMessage(message));
        };
        this.socket.onclose = (event) => {
            this.options.closeCallback(event);
            if (this.options.reconnect && !this.closed)
                setTimeout(() => {
                    this.connect();
                }, this.options.reconnectDelay);
        };
    }
    subscribe(options, resubscribeOnReconnect = true) {
        const message = {
            method: WebsocketMethod.SUBSCRIBE,
            id: options.subscriptionId,
            value: {
                filter: options.filter,
                fields: options.fields
            }
        };
        this.sendSocketMessage(message, resubscribeOnReconnect);
    }
    unsubscribe(subscriptionId) {
        const message = {
            method: WebsocketMethod.UNSUBSCRIBE,
            id: subscriptionId,
            value: {
                subscriptionId,
            }
        };
        this.sendSocketMessage(message);
        this.reconnectMessages = this.reconnectMessages.filter((message) => message.id !== subscriptionId);
    }
    sendSocketMessage(message, resendOnReconnect = false) {
        this.socket?.send(JSON.stringify(message));
        if (resendOnReconnect)
            this.reconnectMessages.push(message);
    }
    closeConnection() {
        this.socket?.close();
        this.closed = true;
    }
}
//# sourceMappingURL=wsApi.js.map