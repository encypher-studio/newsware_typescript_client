import {CloseEvent} from "isomorphic-ws";
import {Source, WebsocketMessageType} from "./enums";

export interface Filter {
    query?: Query
    tickers?: string[]
    sources?: Source[]
    ciks?: number[]
}

export interface RestResponse {
    error: ApiResponseError
    data: News[]
}

export interface ApiResponseError {
    code: number;
    message: string;
}

export interface News {
    id: string;
    source: string;
    tickers: string[];
    headline: string;
    body: string;
    publicationTime: string;
    receivedTime: string;
    creationTime: string;
}

export interface TextQuery extends TextOptions {
    text: string
}

export interface TextOptions {
    searchBody?: boolean // defaults to true
    searchHeadline?: boolean // defaults to true
    ignore?: boolean // defaults to false
    exactMatch?: boolean // defaults to false
}

export type Query = {
    and: Query[]
} | {
    or: Query[]
} | {
    text: TextQuery
}

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
    subscriptionId?: string,
    filter: Filter,
}

export interface HistoricalFilter extends Filter {
    pagination?: Pagination
    publishedAfter?: number
    publishedBefore?: number
}

export interface Pagination {
    limit?: number
    page?: number
}

export type WebsocketMessage = {
    type: WebsocketMessageType.SUBSCRIBE
    id?: string
    payload: Filter
}

export type WebsocketErrorResponse = {
    type: WebsocketMessageType.ERROR | WebsocketMessageType.SOCKET_ERROR
    id?: string
    payload: {
        type: WebsocketMessageType,
        message: string
    }
}

export type WebsocketResponse = {
    type: WebsocketMessageType.SUBSCRIBE
    id?: string
    payload: News[]
} | WebsocketErrorResponse