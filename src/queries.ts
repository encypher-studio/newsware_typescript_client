import {Query, TextOptions} from "./types";

export const and = (...queries: Query[]): Query => {
    return {
        and: queries
    }
}

export const or = (...queries: Query[]): Query => {
    return {
        or: queries
    }
}

export const text = (text: string, options?: TextOptions): Query => {
    return {
        text: {
            text: text,
            ...textOptionsDefault,
            ...options
        }
    }
}

const textOptionsDefault: TextOptions = {
    ignore: false,
    searchBody: true,
    searchHeadline: true,
    exactMatch: false
}