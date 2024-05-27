import {
    CategoryCode,
    EndpointDescription,
    HistoricalFilter,
    News,
    RestResponse,
    RestResponseError,
    RestResponseSuccess,
    SourceDetails
} from "./types"
import { Endpoint } from "./enums"
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

    async search(filter: HistoricalFilter, errorHandler: (apiResponse: RestResponseError<News[]>) => void = this.handleError): Promise<RestResponseSuccess<News[]>> {
        return await this.post<HistoricalFilter, News[]>('/news', filter, errorHandler)
    }

    async getById(id: string, errorHandler: (apiResponse: RestResponseError<News>) => void = this.handleError): Promise<News> {
        return (await this.get<News>(`/news/${id}`, undefined, errorHandler)).data
    }

    async getCategoryCodes(source: string): Promise<CategoryCode[]> {
        return (await this.get<CategoryCode[]>('/category-codes', {
            source
        })).data;
    }

    async getSources(): Promise<SourceDetails[]> {
        return (await (this.get<SourceDetails[]>('/sources'))).data;
    }

    async get<T>(
        path: string,
        params?: any,
        errorHandler: (apiResponse: RestResponseError<T>) => void = this.handleError
    ): Promise<RestResponse<T>> {
        try {
            const endpoint = this.restEndpoint + path + (params ? "?" + new URLSearchParams(params) : '')
            const res = await fetch(endpoint, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': this.apikey
                },
            })

            return this.handle(res, errorHandler)
        } catch (e: any) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0])
            }
            throw e
        }
    }

    async post<T, Z>(
        path: string,
        body: T,
        errorHandler: (apiResponse: RestResponseError<Z>) => void = this.handleError
    ): Promise<RestResponseSuccess<Z>> {
        try {
            const res = await fetch(this.restEndpoint + path, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': this.apikey
                },
            })

            return this.handle(res, errorHandler)
        } catch (e: any) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0])
            }
            throw e
        }
    }

    async handle<T>(res: Response, handleError: (apiResponse: RestResponseError<T>) => void): Promise<RestResponse<T>> {
        const restResponse = await res.json() as RestResponseSuccess<T>

        if (res.status < 200 || res.status > 299) {
            await handleError(restResponse as RestResponseError<T>)
        }

        return restResponse
    }

    async handleError<T>(apiResponse: RestResponseError<T>) {
        throw Error(`Status ${apiResponse.error.code}${apiResponse.error
            ? ": " + apiResponse.error.message.charAt(0).toUpperCase() + apiResponse.error.message.slice(1)
            : ""
            }`)
    }
}