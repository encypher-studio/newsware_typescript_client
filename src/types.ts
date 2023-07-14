export interface Filter {
    query?: Query
    tickers?: string[]
    sources?: Source[]
}

export interface Response {
    error: ResponseError;
    data: News;
}

export interface ResponseError {
    code: number;
    message: string;
}

export interface News {
    id: string;
    source: string;
    tickers: string[];
    headline: string;
    text: string;
    publishedAt: string;
    timeServerReceivedAt: string;
    timeServerRecordCreation: string;
}

export interface TextQuery extends TextOptions{
    text: string
}

export interface TextOptions {
    searchBody?: boolean // defaults to true
    searchHeadline?: boolean // defaults to true
    isRegex?: boolean, // defaults to false
    ignore?: boolean // defaults to false
}

export type QueryDto =
    {
        type: QueryType.And | QueryType.Or,
        query: QueryDto[]
    } | {
        type: QueryType.Text,
        query: TextQuery
    };

export interface Query {
    toJSON(): QueryDto
}

export enum QueryType {
    And = "and",
    Or = "or",
    Text = "text"
}

export enum ApiHost {
    Localhost = "ws://localhost:8080",
    Production = "wss://newswareapi.encypherstudio.com"
}

export enum Source {
    DowJones = "DJ",
    AccessWire = "AR",
    GlobeNewswire = "PZ",
    PRNewswire = "PN",
    BusinessWire = "BW"
}