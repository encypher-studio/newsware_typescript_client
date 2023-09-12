export interface Filter {
    query?: Query
    tickers?: string[]
    sources?: Source[]
}

export interface Response {
    error: ResponseError;
    data: News[];
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

export enum ApiHost {
    Localhost = "ws://localhost:8080",
    Production = "wss://newswareapi.encypherstudio.com"
}

export enum Source {
    DowJones = "DJ",
    AccessWire = "AR",
    GlobeNewswire = "PZ",
    PRNewswire = "PN",
    BusinessWire = "BW",
    SEC = "SEC"
}