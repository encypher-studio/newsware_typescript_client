import { CloseEvent } from "isomorphic-ws"
import { Field, FilterAction, FilterType, WebsocketMethod, WebsocketResponseType } from "./enums"

export type RestResponse<T> = RestResponseSuccess<T> | RestResponseError<T>

export type RestResponseSuccess<T> = {
    data: T
    pagination?: {
        cursor: (string | number)[]
    }
}

export type RestResponseError<T> = {
    error: RestError
    data: T
    pagination?: {
        cursor: (string | number)[]
    }
}

export interface RestError {
    code: number
    message: string
}

export interface News {
    id: string
    source: string
    tickers: string[]
    headline: string
    body: string
    publicationTime: string
    receivedTime: string
    creationTime: string
    categoryCodes: string
    link?: string
}

export interface FilterText extends TextOptions {
    type: FilterType.TEXT
    action?: FilterAction
    value: string[]
}

export interface FilterCondition {
    type: FilterType.AND | FilterType.OR
    value: Filter[]
}

export interface TextOptions {
    onlyBody?: boolean
    onlyHeadline?: boolean
}

export type FilterArray = {
    type: FilterType.CATEGORY_CODES | FilterType.TICKERS
    action: FilterAction
    value: string[]
} | {
    type: FilterType.SOURCE
    action: FilterAction.ANY | FilterAction.EXCLUDE
    value: string[]
} | {
    type: FilterType.CIKS
    action: FilterAction
    value: number[]
}

export type Filter = FilterCondition | FilterText | FilterArray

export interface EndpointDescription {
    host: string
    websocketProtocol: string
    restProtocol: string
}

export interface ConnectOptions {
    apiKey: string,
    reconnect?: boolean // Defaults to true
    endpoint?: EndpointDescription // Defaults to production
    reconnectDelay?: number, // In milliseconds, default 1000
    callback: (response: WebsocketResponse) => void,
    errorCallback?: (error: WebsocketErrorResponse) => void,
    openCallback?: () => void,
    closeCallback?: (closeEvent: CloseEvent) => void,
}

export interface SubscribeOptions {
    subscriptionId: string,
    fields?: Field[],
    filter?: Filter,
}

export interface HistoricalFilter {
    pagination?: Pagination
    publishedAfter?: number
    publishedBefore?: number
    filter?: Filter
    fields?: Field[]
}

export interface Pagination {
    limit: number
    cursor?: (string | number)[]
}

export type WebsocketRequest = {
    method: WebsocketMethod.SUBSCRIBE
    id: string
    value: { filter?: Filter, fields?: Field[] }
} | {
    method: WebsocketMethod.UNSUBSCRIBE
    id: string
    value: {
        all: boolean
    } | {
        subscriptionId: string
    }
}

export type ErrorValue = {
    message: string
}

export type WebsocketErrorResponse = {
    method: WebsocketMethod
    id?: string
    value: ErrorValue
    type: WebsocketResponseType.ERROR
}

export type WebsocketResponse = {
    method: WebsocketMethod.SUBSCRIBE
    id: string
    value: News
    type: WebsocketResponseType.DATA
} | WebsocketErrorResponse | {
    method: WebsocketMethod
    id?: string
    value: undefined
    type: WebsocketResponseType.OK
}

export type FiltersMetadata = FilterType.TICKERS | FilterType.CATEGORY_CODES | FilterType.SOURCE | FilterType.CIKS

export type ApiConfig = {
    endpoint: EndpointDescription
    reconnectDelay?: number // In milliseconds
}