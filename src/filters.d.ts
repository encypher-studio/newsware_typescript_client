import { FilterAction, FilterType } from "./enums";
import { Filter, FilterArray, FilterText, TextOptions } from "./types";
export declare class Text {
    constructor();
    static any(value: string[] | string, options?: TextOptions): FilterText;
    static all(value: string[] | string, options?: TextOptions): {
        onlyBody?: boolean;
        onlyHeadline?: boolean;
        type: FilterType;
        action: FilterAction;
        value: string[];
    };
    static exclude(value: string[] | string, options?: TextOptions): {
        onlyBody?: boolean;
        onlyHeadline?: boolean;
        type: FilterType;
        action: FilterAction;
        value: string[];
    };
}
export declare class Tickers {
    static any(value: string | string[]): FilterArray;
    static all(value: string | string[]): FilterArray;
    static exclude(value: string | string[]): FilterArray;
}
export declare class Ciks {
    static any(value: number | number[]): FilterArray;
    static all(value: number | number[]): FilterArray;
    static exclude(value: number | number[]): FilterArray;
}
export declare class Codes {
    static any(value: string | string[]): FilterArray;
    static all(value: string | string[]): FilterArray;
    static exclude(value: string | string[]): FilterArray;
}
export declare class Sources {
    static any(value: string | string[]): FilterArray;
    static exclude(value: string | string[]): FilterArray;
}
export declare const And: (...queries: Filter[]) => Filter;
export declare const AndNot: (...queries: Filter[]) => Filter;
export declare const Or: (...queries: Filter[]) => Filter;
