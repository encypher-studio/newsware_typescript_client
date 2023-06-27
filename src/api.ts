import {ApiHost, Filter, News} from "./types";

export class Api {
    constructor(
        private apiKey: string,
        private host: string = ApiHost.Production
    ) {
    }

    subscribe = (
        filter: Filter,
        callback: (news: News) => void,
        errorCallback?: (event: Event) => void,
        closeCallback?: (event: Event) => void
    ) => {
        const urlParams = new URLSearchParams({
            apiKey: this.apiKey,
            filter: JSON.stringify(filter)
        })
        const socket = new WebSocket(`ws://${this.host}/v1/ws/news&${urlParams.toString()}`)

        socket.onmessage = (event) => {
            console.log("Message received: ", event)
            callback(JSON.parse(event.data) as News)
        }

        socket.onerror = (event) => {
            console.log("Websocket error: ", event)
            if (!errorCallback) this.subscribe(filter, callback, errorCallback)
            else errorCallback(event)
        }

        socket.onclose = (event) => {
            console.log("Connection closed")
            if (closeCallback) closeCallback(event)
        }
    }
}