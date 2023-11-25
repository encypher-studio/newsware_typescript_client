import {ConnectOptions, EndpointDescription, SubscribeOptions, WebsocketRequest, WebsocketResponse,} from "./types";
import WebSocket, {CloseEvent, ErrorEvent, MessageEvent} from "isomorphic-ws"
import {Endpoint, WebsocketMethod, WebsocketResponseType} from "./enums";

export class WsApi {
    private readonly websocketEndpoint: string
    socket!: WebSocket
    reconnectMessages: WebsocketRequest[] = []
    connectOptions?: ConnectOptions

    constructor(
        private apikey: string,
        options: ConnectOptions,
        endpoint: EndpointDescription = Endpoint.PRODUCTION
    ) {
        this.websocketEndpoint = endpoint.websocketProtocol + "://" + endpoint.host + "/ws/v3"
        this.connect(options)
    }

    changeApikey(apikey: string) {
        this.apikey = apikey
        this.closeConnection()
        if (this.connectOptions)
            this.connect(this.connectOptions)
    }

    connect(options: ConnectOptions) {
        options.automaticReconnect = options.automaticReconnect === undefined ? true : options.automaticReconnect
        this.connectOptions = options

        const urlParams = new URLSearchParams({
            apikey: this.apikey,
        })

        this.socket = new WebSocket(`${this.websocketEndpoint}?${urlParams.toString()}`)
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
            if (options.automaticReconnect)
                this.reconnectMessages.map(message => this.sendSocketMessage(message))
        }

        this.socket.onclose = (event: CloseEvent) => {
            if (options.closeCallback)
                options.closeCallback(event)
            if (options.automaticReconnect)
                setTimeout(() => {
                    this.connect(options)
                }, 200)
        }
    }

    subscribe(options: SubscribeOptions, resubscribeOnReconnect: boolean = true) {
        const message: WebsocketRequest = {
            method: WebsocketMethod.SUBSCRIBE,
            id: options.subscriptionId,
            payload: options.filter
        }
        this.sendSocketMessage(message, resubscribeOnReconnect)
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