import {Query, QueryDto, QueryType, TextQuery} from "./types";

export class And implements Query {
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

export class Or implements Query {
    constructor(private value: Query[]) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.Or,
            query: this.value.map(v => v.toJSON())
        }
    }
}

export class Text implements Query {
    constructor(
        private readonly value: TextQuery
    ) {
        this.value = {... textQueryDefaults, ... this.value}
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