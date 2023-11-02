import {ConnectOptions, SubscribeOptions, WebsocketMessage, WebsocketResponse,} from "./types";
import WebSocket, {CloseEvent, ErrorEvent, MessageEvent} from "isomorphic-ws"
import {WebsocketMessageType} from "./enums";

export class WsClient {
    private reconnectMessages: WebsocketMessage[] = []

    constructor(
        private socket: WebSocket,
        options: ConnectOptions
    ) {
        this.socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data.toString()) as WebsocketResponse
            if (response.type === WebsocketMessageType.ERROR && options.errorCallback) {
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
                    type: WebsocketMessageType.SOCKET_ERROR,
                    payload: {
                        type: WebsocketMessageType.SOCKET_ERROR,
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
        const message: WebsocketMessage = {
            type: WebsocketMessageType.SUBSCRIBE,
            id: options.subscriptionId,
            payload: options.filter
        }
        this.reconnectMessages.push(message)
        this.sendSocketMessage(message)
    }

    // @ts-ignore
    unsubscribe(subscriptionId: string) {
        // TODO: Implement when ws unsubscribe endpoint is created
    }

    sendSocketMessage(message: WebsocketMessage) {
        this.socket.send(JSON.stringify(message))
    }
}