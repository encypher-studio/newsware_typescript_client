import {Query, QueryDto, QueryType, TextOptions, TextQuery} from "./types";

export const and = (...queries: Query[]): Query => {
    return new And(queries)
}

export const or = (...queries: Query[]): Query => {
    return new Or(queries)
}

export const text = (text: string, options?: TextOptions): Query => {
    return new Text({text, ...options})
}

class And implements Query {
    constructor(
        private value: Query[]
    ) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.And,
            query: this.value.map(v => v.toJSON())
        }
    }
}

class Or implements Query {
    constructor(private value: Query[]) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.Or,
            query: this.value.map(v => v.toJSON())
        }
    }
}

class Text implements Query {
    constructor(
        private readonly value: TextQuery
    ) {
        this.value = {...textQueryDefaults, ...this.value}
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.Text,
            query: this.value
        }
    }
}

const textQueryDefaults: TextQuery = {
    ignore: false,
    isRegex: false,
    searchBody: true,
    searchHeadline: true,
    text: ""
}