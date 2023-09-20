import {ApiHost, Response, SubscribeOptions} from "./types";
import WebSocket, {MessageEvent, ErrorEvent, CloseEvent} from "isomorphic-ws"

export class Api {
    private socket?: WebSocket
    private subscribed = false

    constructor(
        private apikey: string,
        private host: string = ApiHost.Production
    ) {
    }

    subscribe(options: SubscribeOptions) {
        if (options.automaticReconnect == undefined)
            options.automaticReconnect = true

        const urlParams = new URLSearchParams({
            apikey: this.apikey,
            filter: JSON.stringify(options.filter)
        })
        this.socket = new WebSocket(`${this.host}/v1/ws/news?${urlParams.toString()}`)

        this.socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data.toString()) as Response
            if (response.error && this.socket?.onerror) {
                this.socket.onerror({
                    error: new Error(response.error.message),
                    message: response.error.message,
                    target: this.socket,
                    type: "error"
                })
            } else
                options.callback(response.data)
        }

        this.socket.onerror = (event: ErrorEvent) => {
            if (event.message?.includes('403')) {
                event = {...event, message: "Not authorized, make sure your api key is correct and active"}
            }

            if (options.errorCallback)
                options.errorCallback(event)
        }

        this.socket.onopen = () => {
            this.subscribed = true
            if (options.openCallback)
                options.openCallback()
        }

        this.socket.onclose = (event: CloseEvent) => {
            if (options.closeCallback)
                options.closeCallback(event)
            if (this.subscribed && options.automaticReconnect)
                setTimeout(() => this.subscribe(options), 1000)
        }
    }

    unsubscribe() {
        this.subscribed = false
        this.socket!!.close()
    }
}