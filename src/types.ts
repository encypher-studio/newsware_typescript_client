import {CloseEvent} from "isomorphic-ws";
import {Source, WebsocketMethod, WebsocketResponseType} from "./enums";

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
    type: QueryType.TEXT
    term: string
}

export interface ConditionQuery {
    type: QueryType.AND | QueryType.OR
    queries: Query[]
}

export interface TextOptions {
    onlyBody?: boolean
    onlyHeadline?: boolean
    ignore?: boolean
}

export enum QueryType {
    AND = "and",
    OR = "or",
    TEXT = "text"
}

export type Query = ConditionQuery | TextQuery

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

export type WebsocketRequest = {
    method: WebsocketMethod.SUBSCRIBE
    id: string
    payload: Filter
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