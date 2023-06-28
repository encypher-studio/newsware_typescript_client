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
    searchBody?: boolean
    searchHeadline?: boolean
    isRegex?: boolean,
    text: string,
    ignore?: boolean
}

export type QueryDto =
    {
        type: QueryType.And | QueryType.Or,
        value: QueryDto[]
    } | {
        type: QueryType.Text,
        value: TextQuery
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
    Production = "wss://198.6.19.69:9949"
}