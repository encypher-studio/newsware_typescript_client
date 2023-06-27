export interface TextQuery {
    searchBody: boolean
    searchHeadline: boolean
    isRegex: boolean,
    text: string,
    ignore: boolean
}

type QueryDto =
    { type: QueryType.And | QueryType.Or, value: QueryDto[] } |
    { type: QueryType.Text, value: TextQuery };

interface Query {
    toJSON(): QueryDto
}

export class And implements Query {
    constructor(private value: Query[]) {
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
    constructor(private value: TextQuery) {
    }

    toJSON(): QueryDto {
        return {
            type: QueryType.Text,
            value: this.value
        }
    }
}