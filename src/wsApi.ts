import { ConnectOptions, SubscribeOptions, WebsocketRequest, WebsocketResponse, } from "./types";
import WebSocket, { CloseEvent, ErrorEvent, MessageEvent } from "isomorphic-ws"
import { Endpoint, WebsocketMethod, WebsocketResponseType } from "./enums";

const defaultOptions: Required<ConnectOptions> = {
    reconnect: true,
    endpoint: Endpoint.PRODUCTION,
    reconnectDelay: 1000,
    errorCallback: () => { },
    openCallback: () => { },
    closeCallback: () => { },
    callback: () => { }
}

export class WsApi {
    private readonly websocketEndpoint: string
    socket!: WebSocket
    reconnectMessages: WebsocketRequest[] = []
    private options: Required<ConnectOptions>

    constructor(
        private apikey: string,
        options: ConnectOptions
    ) {
        this.options = { ...defaultOptions, ...options }
        this.websocketEndpoint = this.options.endpoint.websocketProtocol + "://" + this.options.endpoint.host + "/ws/v3"
        this.connect()
    }

    changeApikey(apikey: string) {
        this.apikey = apikey
        this.closeConnection()
        this.connect()
    }

    connect() {
        const urlParams = new URLSearchParams({
            apikey: this.apikey,
        })

        this.socket = new WebSocket(`${this.websocketEndpoint}?${urlParams.toString()}`)
        this.socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data.toString()) as WebsocketResponse
            if (response.type === WebsocketResponseType.ERROR && this.options.errorCallback) {
                this.options.errorCallback(response)
            } else
                this.options.callback(response)
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

            this.options.errorCallback({
                method: WebsocketMethod.SOCKET_ERROR,
                type: WebsocketResponseType.ERROR,
                value: {
                    message
                }
            })
        }

        this.socket.onopen = () => {
            this.options.openCallback()
            if (this.options.reconnect)
                this.reconnectMessages.map(message => this.sendSocketMessage(message))
        }

        this.socket.onclose = (event: CloseEvent) => {
            this.options.closeCallback(event)
            if (this.options.reconnect)
                setTimeout(() => {
                    this.connect()
                }, this.options.reconnectDelay)
        }
    }

    subscribe(options: SubscribeOptions, resubscribeOnReconnect: boolean = true) {
        const message: WebsocketRequest = {
            method: WebsocketMethod.SUBSCRIBE,
            id: options.subscriptionId,
            value: {
                filter: options.filter,
                fields: options.fields
            }
        }
        this.sendSocketMessage(message, resubscribeOnReconnect)
    }

    unsubscribe(subscriptionId: string) {
        const message: WebsocketRequest = {
            method: WebsocketMethod.UNSUBSCRIBE,
            id: subscriptionId,
            value: {
                subscriptionId,
            }
        }
        this.sendSocketMessage(message)
        this.reconnectMessages = this.reconnectMessages.filter((message) => message.id !== subscriptionId)
    }

    sendSocketMessage(message: WebsocketRequest, resendOnReconnect: boolean = false) {
        this.socket.send(JSON.stringify(message))
        if (resendOnReconnect)
            this.reconnectMessages.push(message)
    }

    closeConnection() {
        this.socket.close()
    }
}