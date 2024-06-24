import { Endpoint } from "enums"
import { EndpointDescription, RestResponse, RestResponseError, RestResponseSuccess } from "types"

export class RestHelper {
    restEndpoint: string

    constructor(
        endpoint: EndpointDescription = Endpoint.PRODUCTION,
        public headers: Record<string, string> = {}
    ) {
        this.restEndpoint = endpoint.restProtocol + "://" + endpoint.host + "/api/v3"
        this.headers["content-type"] = "application/json"
    }

    async get<T>(
        path: string,
        params?: any,
        errorHandler: (apiResponse: RestResponseError<T>) => void = RestHelper.handleError
    ): Promise<RestResponse<T>> {
        return await this.request("GET", path, params, errorHandler)
    }

    async delete<T>(
        path: string,
        params?: any,
        errorHandler: (apiResponse: RestResponseError<T>) => void = RestHelper.handleError
    ): Promise<RestResponse<T>> {
        return await this.request("DELETE", path, params, errorHandler)
    }

    async post<T, Z>(
        path: string,
        body: T,
        errorHandler: (apiResponse: RestResponseError<Z>) => void = RestHelper.handleError
    ): Promise<RestResponseSuccess<Z>> {
        return await this.requestWithBody("POST", path, body, errorHandler)
    }

    async put<T, Z>(
        path: string,
        body: T,
        errorHandler: (apiResponse: RestResponseError<Z>) => void = RestHelper.handleError
    ): Promise<RestResponseSuccess<Z>> {
        return await this.requestWithBody("PUT", path, body, errorHandler)
    }

    async request<T>(
        method: string,
        path: string,
        params?: object,
        errorHandler: (apiResponse: RestResponseError<T>) => void = RestHelper.handleError
    ): Promise<RestResponse<T>> {
        try {
            var paramsString: Record<string, string> = {}
            if (params) {
                Object.keys(params).forEach(key => {
                    paramsString[key] = typeof params[key as keyof object] === "object"
                        ? JSON.stringify(params[key as keyof object])
                        : params[key as keyof object]
                })
            }

            const endpoint = this.restEndpoint + path + (paramsString ? "?" + new URLSearchParams(paramsString) : '')
            const res = await fetch(endpoint, {
                method: method,
                headers: this.headers,
            })

            return RestHelper.handle(res, errorHandler)
        } catch (e: any) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0])
            }
            throw e
        }
    }

    async requestWithBody<T, Z>(
        method: string,
        path: string,
        body: T,
        errorHandler: (apiResponse: RestResponseError<Z>) => void = RestHelper.handleError
    ): Promise<RestResponseSuccess<Z>> {
        try {
            const res = await fetch(this.restEndpoint + path, {
                method: method,
                body: JSON.stringify(body),
                headers: this.headers,
            })

            return RestHelper.handle(res, errorHandler)
        } catch (e: any) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0])
            }
            throw e
        }
    }

    static async handle<T>(res: Response, handleError: (apiResponse: RestResponseError<T>) => void): Promise<RestResponse<T>> {
        const restResponse = await res.json() as RestResponseSuccess<T>

        if (res.status < 200 || res.status > 299) {
            await handleError(restResponse as RestResponseError<T>)
        }

        return restResponse
    }

    static handleError<T>(apiResponse: RestResponseError<T>) {
        throw Error(`Status ${apiResponse.error.code}${apiResponse.error
            ? ": " + apiResponse.error.message.charAt(0).toUpperCase() + apiResponse.error.message.slice(1)
            : ""
            }`)
    }
}