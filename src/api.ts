import {ApiHost, Filter, News, Response} from "./types";
import WebSocket, {MessageEvent, ErrorEvent, CloseEvent} from "isomorphic-ws"

export class Api {
    private socket?: WebSocket

    constructor(
        private apikey: string,
        private host: string = ApiHost.Production
    ) {
    }

    subscribe (
        filter: Filter,
        callback: (news: News) => void,
        errorCallback?: (errorEvent: ErrorEvent) => void,
        openCallback?: () => void,
        closeCallback?: (closeEvent: CloseEvent) => void
    ) {
        const urlParams = new URLSearchParams({
            apikey: this.apikey,
            filter: JSON.stringify(filter)
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
                callback(response.data)
        }

        this.socket.onerror = (event: ErrorEvent) => {
            if (event.message?.includes('403')) {
                event = {... event, message:  "Not authorized, make sure your api key is correct and active"}
            }

            if (errorCallback) errorCallback(event)
        }

        this.socket.onopen = () => {
            if (openCallback) openCallback()
        }

        this.socket.onclose = (event: CloseEvent) => {
            if (closeCallback) closeCallback(event)
        }
    }

    unsubscribe() {
        this.socket!!.close()
    }
}