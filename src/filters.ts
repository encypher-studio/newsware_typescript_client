import {Filter, FilterArray, TextOptions} from "./types";
import {FilterAction, FilterType} from "./enums";

export const and = (...queries: Filter[]): Filter => {
    return {
        type: FilterType.AND,
        value: queries
    }
}

export const or = (...queries: Filter[]): Filter => {
    return {
        type: FilterType.OR,
        value: queries
    }
}

export const text = (value: string[], options?: TextOptions): Filter => {
    return {
        type: FilterType.TEXT,
        value,
        ...options
    }
}

export const tickers = (
    action: FilterAction,
    value: string[]
): FilterArray => {
    return {
        type: FilterType.TICKERS,
        action,
        value
    }
}

export const ciks = (
    action: FilterAction,
    value: number[]
): FilterArray => {
    return {
        type: FilterType.CIKS,
        action,
        value
    }
}

export const categoryCodes = (
    action: FilterAction,
    value: string[]
): FilterArray => {
    return {
        type: FilterType.CATEGORY_CODES,
        action,
        value
    }
}

export const source = (
    action: FilterAction.ANY | FilterAction.EXCLUDE,
    value: string[]
): FilterArray => {
    return {
        type: FilterType.SOURCE,
        action,
        value
    }
}