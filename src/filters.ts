import {Filter, FilterArray, TextOptions} from "./types";
import {FilterArrayAction, FilterType} from "./enums";

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
    action: FilterArrayAction,
    value: string[]
): FilterArray => {
    return {
        type: FilterType.TICKERS,
        action,
        value
    }
}

export const ciks = (
    action: FilterArrayAction,
    value: number[]
): FilterArray => {
    return {
        type: FilterType.CIKS,
        action,
        value
    }
}

export const categoryCodes = (
    action: FilterArrayAction,
    value: string[]
): FilterArray => {
    return {
        type: FilterType.CATEGORY_CODES,
        action,
        value
    }
}

export const source = (
    action: FilterArrayAction.ANY | FilterArrayAction.EXCLUDE,
    value: string[]
): FilterArray => {
    return {
        type: FilterType.SOURCE,
        action,
        value
    }
}