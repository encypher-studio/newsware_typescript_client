import {ApiHost, Filter, News, Response} from "./types";
import {CloseEvent, ErrorEvent, MessageEvent, WebSocket as IsoWebsocket} from "isomorphic-ws"

export class Api {
    constructor(
        private apikey: string,
        private host: string = ApiHost.Production
    ) {
    }

    subscribe = (
        filter: Filter,
        callback: (news: News) => void,
        errorCallback?: (errorEvent: ErrorEvent) => void,
        closeCallback?: (closeEvent: CloseEvent) => void
    ) => {
        const urlParams = new URLSearchParams({
            apikey: this.apikey,
            filter: JSON.stringify(filter)
        })
        console.log(urlParams)
        const socket = new IsoWebsocket(`${this.host}/v1/ws/news?${urlParams.toString()}`)

        socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data.toString()) as Response
            if (response.error && socket.onerror) {
                socket.onerror({
                    error: new Error(response.error),
                    message: response.error,
                    target: socket,
                    type: "error"
                })
            } else
                callback(response.data)
        }

        socket.onerror = (event: ErrorEvent) => {
            if (event.message.includes('403')) console.log("Error: Not authorized, make sure your api key is correct and active")
            else console.log("Websocket error: " + event.message)

            if (errorCallback) errorCallback(event)
        }

        socket.onopen = () => {
            console.log("Connection established, waiting for news")
        }

        socket.onclose = (event: CloseEvent) => {
            console.log("Connection closed")
            if (closeCallback) closeCallback(event)
        }
    }
}