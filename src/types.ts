import {CloseEvent} from "isomorphic-ws"
import {FilterAction, FilterType, WebsocketMethod, WebsocketResponseType} from "./enums"

export type RestResponse = {
    error: ApiResponseError
    data: News[]
    pagination?: {
        cursor: (string | number)[]
    }
}

export interface ApiResponseError {
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
}

export interface FilterText extends TextOptions {
    type: FilterType.TEXT
    value: string[]
}

export interface FilterCondition {
    type: FilterType.AND | FilterType.OR
    value: Filter[]
}

export interface TextOptions {
    action?: FilterAction
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
    automaticReconnect?: boolean
    callback: (response: WebsocketResponse) => void,
    errorCallback?: (error: WebsocketErrorResponse) => void,
    openCallback?: () => void,
    closeCallback?: (closeEvent: CloseEvent) => void,
}

export interface SubscribeOptions {
    subscriptionId: string,
    filter?: Filter,
}

export interface HistoricalFilter {
    pagination?: Pagination
    publishedAfter?: number
    publishedBefore?: number
    filter?: Filter
}

export interface Pagination {
    limit: number
    cursor?: (string | number)[]
}

export type WebsocketRequest = {
    method: WebsocketMethod.SUBSCRIBE
    id: string
    payload?: Filter
} | {
    method: WebsocketMethod.UNSUBSCRIBE
    id: string
    payload: {
        all: boolean
    } | {
        subscriptionId: string
    }
}

export type ErrorPayload = {
    message: string
}

export type WebsocketErrorResponse = {
    method: WebsocketMethod
    id?: string
    payload: ErrorPayload
    type: WebsocketResponseType.ERROR
}

export type WebsocketResponse = {
    method: WebsocketMethod.SUBSCRIBE
    id: string
    payload: News[]
    type: WebsocketResponseType.DATA
} | WebsocketErrorResponse | {
    method: WebsocketMethod
    id?: string
    payload: undefined
    type: WebsocketResponseType.OK
}