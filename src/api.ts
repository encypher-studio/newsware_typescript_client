import {Endpoint, HistoricalFilter, News, ApiResponse, SubscribeOptions, EndpointDescription} from "./types";
import WebSocket, {MessageEvent, ErrorEvent, CloseEvent} from "isomorphic-ws"

export class Api {
    private socket?: WebSocket
    private subscribed = false
    websocketEndpoint: string
    restEndpoint: string

    constructor(
        private apikey: string,
        endpoint: EndpointDescription = Endpoint.Production
    ) {
        this.websocketEndpoint = endpoint.websocketProtocol + "://" + endpoint.host
        this.restEndpoint = endpoint.restProtocol + "://" + endpoint.host
    }

    subscribe(options: SubscribeOptions) {
        if (options.automaticReconnect == undefined)
            options.automaticReconnect = true

        const urlParams = new URLSearchParams({
            apikey: this.apikey,
            filter: JSON.stringify(options.filter)
        })
        this.socket = new WebSocket(`${this.websocketEndpoint}/v1/ws/news?${urlParams.toString()}`)

        this.socket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data.toString()) as ApiResponse
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

    async search(filter: HistoricalFilter): Promise<News[]> {
        return await this.post<HistoricalFilter, News[]>('/v1/api/news', filter)
    }

    async post<T, Z>(path: string, body: T): Promise<Z> {
        try {
            const res = await fetch(this.restEndpoint + path, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': this.apikey
                },
            })

            const apiResponse = await res.json() as ApiResponse

            if (res.status < 200 || res.status > 299 || apiResponse.error) {
                throw Error(`Status ${res.status}${apiResponse.error ? ": " + apiResponse.error.message : ""}`)
            }

            return apiResponse.data as Z
        } catch (e: any) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0])
            }
            throw e
        }
    }
}