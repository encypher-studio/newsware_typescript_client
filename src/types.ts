export interface Filter {
    query?: Query
    tickers?: string[]
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

export interface TextQuery {
    text: string,
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