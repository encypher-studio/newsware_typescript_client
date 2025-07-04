import { RestHelper } from "./rest-helper";
import { Code, CodeType, EndpointDescription, HistoricalFilter, News, RestResponseError, RestResponseSuccess, SourceDetails } from "./types";
export declare class Api {
    restHelper: RestHelper;
    constructor(apikey: string, endpoint?: EndpointDescription);
    changeApikey(apikey: string): void;
    search(filter: HistoricalFilter, errorHandler?: (apiResponse: RestResponseError<News[]>) => void): Promise<RestResponseSuccess<News[]>>;
    getById(id: string, errorHandler?: (apiResponse: RestResponseError<News>) => void): Promise<News>;
    static getCodes(source: string, typ: CodeType, endpoint?: EndpointDescription): Promise<Code[]>;
    static getSources(endpoint?: EndpointDescription): Promise<SourceDetails[]>;
}
