import {Filter, FilterArray, FiltersMetadata, FilterText, TextOptions} from "./types";
import {FilterAction, FilterType} from "./enums";

export class Text {
    constructor() {
    }

    static any(value: string[] | string, options?: TextOptions): FilterText {
        if (typeof value == "string")
            value = [value]
        return {
            type: FilterType.TEXT,
            action: FilterAction.ANY,
            value,
            ...options
        }
    }

    static all(value: string[] | string, options?: TextOptions) {
        if (typeof value == "string")
            value = [value]
        return {
            type: FilterType.TEXT,
            action: FilterAction.ALL,
            value,
            ...options
        }
    }

    static exclude(value: string[] | string, options?: TextOptions) {
        if (typeof value == "string")
            value = [value]
        return {
            type: FilterType.TEXT,
            action: FilterAction.EXCLUDE,
            value,
            ...options
        }
    }
}

class FilterArrayBuilderBasic<T> {
    constructor(protected type: FiltersMetadata) {
    }

    any(value: T[] | T): FilterArray {
        if (!Array.isArray(value))
            value = [value]
        return {
            type: this.type as any,
            action: FilterAction.ANY,
            value: value as any
        }
    }

    exclude(value: T[] | T): FilterArray {
        if (!Array.isArray(value))
            value = [value]
        return {
            type: this.type as any,
            action: FilterAction.EXCLUDE,
            value: value as any
        }
    }
}

class FilterArrayBuilder<T> extends FilterArrayBuilderBasic<T> {
    constructor(type: FiltersMetadata) {
        super(type);
    }

    all(value: T[] | T): FilterArray {
        if (!Array.isArray(value))
            value = [value]
        return {
            type: this.type as any,
            action: FilterAction.ALL,
            value: value as any
        }
    }
}

export class Tickers {
    static any(value: string | string[]) {
        return tickers().any(value)
    }

    static all(value: string | string[]) {
        return tickers().all(value)
    }

    static exclude(value: string | string[]) {
        return tickers().exclude(value)
    }
}

export class Ciks {
    static any(value: number | number[]) {
        return ciks().any(value)
    }

    static all(value: number | number[]) {
        return ciks().all(value)
    }

    static exclude(value: number | number[]) {
        return ciks().exclude(value)
    }
}

export class CategoryCodes {
    static any(value: string | string[]) {
        return categoryCodes().any(value)
    }

    static all(value: string | string[]) {
        return categoryCodes().all(value)
    }

    static exclude(value: string | string[]) {
        return categoryCodes().exclude(value)
    }
}

export class Sources {
    static any(value: string | string[]) {
        return sources().any(value)
    }

    static exclude(value: string | string[]) {
        return sources().exclude(value)
    }
}

export const And = (...queries: Filter[]): Filter => {
    return {
        type: FilterType.AND,
        value: queries
    }
}

export const Or = (...queries: Filter[]): Filter => {
    return {
        type: FilterType.OR,
        value: queries
    }
}

const tickers = (): FilterArrayBuilder<string> => {
    return new FilterArrayBuilder<string>(FilterType.TICKERS)
}

const ciks = (): FilterArrayBuilder<number> => {
    return new FilterArrayBuilder<number>(FilterType.CIKS)
}

const categoryCodes = (): FilterArrayBuilder<string> => {
    return new FilterArrayBuilder<string>(FilterType.CATEGORY_CODES)
}

const sources = (): FilterArrayBuilderBasic<string> => {
    return new FilterArrayBuilderBasic<string>(FilterType.SOURCE)
}