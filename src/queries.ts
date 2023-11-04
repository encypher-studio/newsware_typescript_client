import {Query, QueryType, TextOptions} from "./types";

export const and = (...queries: Query[]): Query => {
    return {
        type: QueryType.AND,
        queries: queries
    }
}

export const or = (...queries: Query[]): Query => {
    return {
        type: QueryType.OR,
        queries: queries
    }
}

export const text = (term: string, options?: TextOptions): Query => {
    return {
        type: QueryType.TEXT,
        term,
        ...textOptionsDefault,
        ...options
    }
}

const textOptionsDefault: TextOptions = {
    ignore: false,
    searchBody: true,
    searchHeadline: true,
    exactMatch: false
}