import {ApiHost, Filter, News} from "./types";
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
            callback(JSON.parse(event.data.toString()) as News)
        }

        socket.onerror = (event: ErrorEvent) => {
            console.log("Websocket error: ", event)
            if (!errorCallback) return
            else errorCallback(event)
        }

        socket.onclose = (event: CloseEvent) => {
            console.log("Connection closed")
            if (closeCallback) closeCallback(event)
        }
    }
}