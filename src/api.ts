import {ConnectOptions, EndpointDescription, HistoricalFilter, News, RestResponse} from "./types"
import {Endpoint} from "./enums"
import WebSocket from "isomorphic-ws"
import {WsClient} from "./wsclient"

export class Api {
    websocketEndpoint: string
    restEndpoint: string

    constructor(
        private apikey: string,
        endpoint: EndpointDescription = Endpoint.Production
    ) {
        this.websocketEndpoint = endpoint.websocketProtocol + "://" + endpoint.host
        this.restEndpoint = endpoint.restProtocol + "://" + endpoint.host
    }

    getWsClient(options: ConnectOptions): WsClient {
        const urlParams = new URLSearchParams({
            apikey: this.apikey,
        })
        
        return new WsClient(new WebSocket(`${this.websocketEndpoint}/v2/ws?${urlParams.toString()}`), options)
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

            const apiResponse = await res.json() as RestResponse

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