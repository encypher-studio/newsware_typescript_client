import {ApiHost, Filter, News} from "./types";
import {CloseEvent, ErrorEvent, MessageEvent, WebSocket as IsoWebsocket} from "isomorphic-ws"

export class Api {
    constructor(
        private apiKey: string,
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
            apiKey: this.apiKey,
            filter: JSON.stringify(filter)
        })
        const socket = new IsoWebsocket(`ws://${this.host}/v1/ws/news&${urlParams.toString()}`)

        socket.onmessage = (event: MessageEvent) => {
            console.log("Message received: ", event.data)
            callback(JSON.parse(event.data.toString()) as News)
        }

        socket.onerror = (event: ErrorEvent) => {
            console.log("Websocket error: ", event)
            if (!errorCallback) this.subscribe(filter, callback, errorCallback)
            else errorCallback(event)
        }

        socket.onclose = (event: CloseEvent) => {
            console.log("Connection closed")
            if (closeCallback) closeCallback(event)
        }
    }
}