import {EndpointDescription, HistoricalFilter, News, RestResponse} from "./types"
import {Endpoint} from "./enums"
import fetch from "isomorphic-fetch"

export class Api {
    restEndpoint: string

    constructor(
        private apikey: string,
        endpoint: EndpointDescription = Endpoint.PRODUCTION
    ) {
        this.restEndpoint = endpoint.restProtocol + "://" + endpoint.host + "/api/v3"
    }
    
    changeApikey(apikey: string) {
        this.apikey = apikey
    }

    async search(filter: HistoricalFilter): Promise<News[]> {
        return await this.post<HistoricalFilter, News[]>('/news', filter)
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