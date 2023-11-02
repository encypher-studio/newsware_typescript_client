import {ConnectOptions, SubscribeOptions, WebsocketRequest, WebsocketResponse,} from "./types";
import WebSocket, {CloseEvent, ErrorEvent, MessageEvent} from "isomorphic-ws"
import {WebsocketMethod, WebsocketResponseType} from "./enums";

export class WsClient {
    private reconnectMessages: WebsocketRequest[] = []

    constructor(
        private socket: WebSocket,
        options: ConnectOptions
    ) {
        this.socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data.toString()) as WebsocketResponse
            if (response.type === WebsocketResponseType.ERROR && options.errorCallback) {
                options.errorCallback(response)
            } else
                options.callback(response)
        }

        this.socket.onerror = (event: ErrorEvent) => {
            let message = ""
            if (event.message)
                message = event.message
            else if (event.error?.message) {
                message = event.error.message
            } else if (event.error) {
                message = event.error
            }

            if (message.includes('403')) {
                message = "Not authorized, make sure your api key is correct and active"
            }

            if (options.errorCallback)
                options.errorCallback({
                    method: WebsocketMethod.SOCKET_ERROR,
                    type: WebsocketResponseType.ERROR,
                    payload: {
                        message
                    }
                })
        }

        this.socket.onopen = () => {
            if (options.openCallback)
                options.openCallback()
        }

        this.socket.onclose = (event: CloseEvent) => {
            if (options.closeCallback)
                options.closeCallback(event)
            if (options.automaticReconnect)
                setTimeout(() => {
                    for (const reconnectMessage of this.reconnectMessages) {
                        this.sendSocketMessage(reconnectMessage)
                    }
                }, 1000)
        }
    }

    subscribe(options: SubscribeOptions) {
        const message: WebsocketRequest = {
            method: WebsocketMethod.SUBSCRIBE,
            id: options.subscriptionId,
            payload: options.filter
        }
        this.reconnectMessages.push(message)
        this.sendSocketMessage(message)
    }

    unsubscribe(subscriptionId: string) {
        const message: WebsocketRequest = {
            method: WebsocketMethod.UNSUBSCRIBE,
            id: subscriptionId,
            payload: {
                subscriptionId,
            }
        }
        this.sendSocketMessage(message)
    }

    sendSocketMessage(message: WebsocketRequest) {
        this.socket.send(JSON.stringify(message))
    }
}