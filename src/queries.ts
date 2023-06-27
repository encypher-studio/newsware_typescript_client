import {Query, QueryDto, QueryType, TextQuery} from "./types";

export class And implements Query {
    constructor(
        private value: Query[]
    ) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.And,
            value: this.value.map(v => v.toJSON())
        }
    }
}

export class Or implements Query {
    constructor(private value: Query[]) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.Or,
            value: this.value.map(v => v.toJSON())
        }
    }
}

export class Text implements Query {
    constructor(
        private value: TextQuery
    ) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.Text,
            value: this.value
        }
    }
}