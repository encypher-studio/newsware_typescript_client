import { FilterAction, FilterType } from "./enums";
export class Text {
    constructor() {
    }
    static any(value, options) {
        if (typeof value == "string")
            value = [value];
        return {
            type: FilterType.TEXT,
            action: FilterAction.ANY,
            value,
            ...options
        };
    }
    static all(value, options) {
        if (typeof value == "string")
            value = [value];
        return {
            type: FilterType.TEXT,
            action: FilterAction.ALL,
            value,
            ...options
        };
    }
    static exclude(value, options) {
        if (typeof value == "string")
            value = [value];
        return {
            type: FilterType.TEXT,
            action: FilterAction.EXCLUDE,
            value,
            ...options
        };
    }
}
class FilterArrayBuilderBasic {
    type;
    constructor(type) {
        this.type = type;
    }
    any(value) {
        if (!Array.isArray(value))
            value = [value];
        return {
            type: this.type,
            action: FilterAction.ANY,
            value: value
        };
    }
    exclude(value) {
        if (!Array.isArray(value))
            value = [value];
        return {
            type: this.type,
            action: FilterAction.EXCLUDE,
            value: value
        };
    }
}
class FilterArrayBuilder extends FilterArrayBuilderBasic {
    constructor(type) {
        super(type);
    }
    all(value) {
        if (!Array.isArray(value))
            value = [value];
        return {
            type: this.type,
            action: FilterAction.ALL,
            value: value
        };
    }
}
export class Tickers {
    static any(value) {
        return tickers().any(value);
    }
    static all(value) {
        return tickers().all(value);
    }
    static exclude(value) {
        return tickers().exclude(value);
    }
}
export class Ciks {
    static any(value) {
        return ciks().any(value);
    }
    static all(value) {
        return ciks().all(value);
    }
    static exclude(value) {
        return ciks().exclude(value);
    }
}
export class Codes {
    static any(value) {
        return codes().any(value);
    }
    static all(value) {
        return codes().all(value);
    }
    static exclude(value) {
        return codes().exclude(value);
    }
}
export class Sources {
    static any(value) {
        return sources().any(value);
    }
    static exclude(value) {
        return sources().exclude(value);
    }
}
export const And = (...queries) => {
    return {
        type: FilterType.AND,
        value: queries
    };
};
export const AndNot = (...queries) => {
    return {
        type: FilterType.AND_NOT,
        value: queries
    };
};
export const Or = (...queries) => {
    return {
        type: FilterType.OR,
        value: queries
    };
};
const tickers = () => {
    return new FilterArrayBuilder(FilterType.TICKERS);
};
const ciks = () => {
    return new FilterArrayBuilder(FilterType.CIKS);
};
const codes = () => {
    return new FilterArrayBuilder(FilterType.CODES);
};
const sources = () => {
    return new FilterArrayBuilderBasic(FilterType.SOURCE);
};
//# sourceMappingURL=filters.js.map