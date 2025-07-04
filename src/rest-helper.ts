import { Endpoint } from "./enums"
import { EndpointDescription, RestResponse, RestResponseError, RestResponseSuccess } from "./types"

export class RestHelper {
    restEndpoint: string
    onError: (message: string) => void

    constructor(
        endpoint: EndpointDescription = Endpoint.PRODUCTION,
        public headers: Record<string, string> = {},
        _onError: (message: string) => void = () => {},
    ) {
        this.onError = _onError
        this.restEndpoint = endpoint.restProtocol + "://" + endpoint.host + "/api/v3"
        this.headers["content-type"] = "application/json"
    }

    async get<T>(
        path: string,
        params?: any,
        errorHandler?: (apiResponse: RestResponseError<T>) => void
    ): Promise<RestResponse<T>> {
        return await this.request({method: "GET", path, params, errorHandler})
    }

    async delete<T>(
        path: string,
        params?: any,
        errorHandler?: (apiResponse: RestResponseError<T>) => void
    ): Promise<RestResponse<T>> {
        return await this.request({method: "DELETE", path, params, errorHandler})
    }

    async post<T>(
        path: string,
        body?: object,
        options?: {
            params?: object,
            errorHandler?: (apiResponse: RestResponseError<T>) => void
        }
    ): Promise<RestResponseSuccess<T>> {
        return await this.request({method: "POST", path, body, ...options})
    }

    async put<T>(
        path: string,
        body?: object,
        options?: {
            params?: object,
            errorHandler?: (apiResponse: RestResponseError<T>) => void
        }
    ): Promise<RestResponseSuccess<T>> {
        return await this.request({method: "PUT", path,  body, ...options})
    }

    async request<T>(
        {method, path, params, body, errorHandler}: RequestOptions<T>
    ): Promise<RestResponse<T>> {
        try {
            var paramsString: Record<string, string> = {}
            if (params) {
                Object.keys(params).forEach(key => {
                    if (params[key as keyof object] === undefined) return

                    paramsString[key] = typeof params[key as keyof object] === "object"
                        ? JSON.stringify(params[key as keyof object])
                        : params[key as keyof object]
                })
            }

            const endpoint = this.restEndpoint + path + (paramsString ? "?" + new URLSearchParams(paramsString) : '')
            const res = await fetch(endpoint, {
                method: method,
                body: body ? JSON.stringify(body) : undefined,
                headers: this.headers,
            })

            return this.handle(res, errorHandler)
        } catch (e: any) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0])
            }
            throw e
        }
    }

    async handle<T>(res: Response, handleError?: (apiResponse: RestResponseError<T>) => void): Promise<RestResponse<T>> {
        const restResponse = await res.json() as RestResponseSuccess<T>

        if (res.status < 200 || res.status > 299) {
            handleError ? handleError(restResponse as RestResponseError<T>) : this.errorHandler(restResponse as RestResponseError<T>)
        }

        return restResponse
    }

    errorHandler(apiResponse: RestResponseError<any>) {
        const message = RestHelper.messageFromApiError(apiResponse)
        this.onError(message)
        throw Error(message)
    }

    static handleError(apiResponse: RestResponseError<any>) {
        throw Error(RestHelper.messageFromApiError(apiResponse))
    }

    private static messageFromApiError(apiResponse: RestResponseError<any>) {
        return `Status ${apiResponse.error.code}${apiResponse.error
            ? ": " + apiResponse.error.message.charAt(0).toUpperCase() + apiResponse.error.message.slice(1)
            : ""
        }`
    }
}

export type RequestOptions<T> = {
    method: string
    path: string
    params?: object
    body?: object,
    errorHandler?: (apiResponse: RestResponseError<T>) => void
}