import {CloseEvent, ErrorEvent} from "isomorphic-ws";

export interface Filter {
    query?: Query
    tickers?: string[]
    sources?: Source[]
    ciks?: number[]
}

export interface ApiResponse {
    error: ApiResponseError;
    data: News[];
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

export interface TextQuery extends TextOptions{
    text: string
}

export interface TextOptions {
    searchBody?: boolean // defaults to true
    searchHeadline?: boolean // defaults to true
    ignore?: boolean // defaults to false
}

export interface Query {
    and?: Query[]
    or?: Query[]
    text?: TextQuery
}

export enum QueryType {
    And = "and",
    Or = "or",
    Text = "text"
}

export interface EndpointDescription {
    host: string
    websocketProtocol: string
    restProtocol: string
}

export const Endpoint: {[key: string]: EndpointDescription} = {
    Localhost: {
        host: "localhost:8080",
        websocketProtocol: "ws",
        restProtocol: "http"
    },
    Production: {
        host: "newswareapi.encypherstudio.com",
        websocketProtocol: "wss",
        restProtocol: "https"
    },
}

export enum Source {
    DowJones = "DJ",
    AccessWire = "AR",
    GlobeNewswire = "PZ",
    PRNewswire = "PN",
    BusinessWire = "BW",
    SEC = "SEC"
}

export interface SubscribeOptions {
    filter: Filter,
    callback: (news: News[]) => void,
    errorCallback?: (errorEvent: ErrorEvent) => void,
    openCallback?: () => void,
    closeCallback?: (closeEvent: CloseEvent) => void,
    automaticReconnect?: boolean
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