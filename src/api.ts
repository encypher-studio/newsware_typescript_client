import { RestHelper } from "rest-helper"
import { Endpoint } from "./enums"
import {
    CategoryCode,
    EndpointDescription,
    HistoricalFilter,
    News,
    RestResponseError,
    RestResponseSuccess,
    SourceDetails
} from "./types"

export class Api {
    restHelper: RestHelper

    constructor(
        apikey: string,
        endpoint: EndpointDescription = Endpoint.PRODUCTION
    ) {
        this.restHelper = new RestHelper(endpoint, {
            "x-api-key": apikey
        })
    }

    changeApikey(apikey: string) {
        this.restHelper.headers["x-api-key"] = apikey
    }

    async search(filter: HistoricalFilter, errorHandler: (apiResponse: RestResponseError<News[]>) => void = RestHelper.handleError): Promise<RestResponseSuccess<News[]>> {
        return await this.restHelper.post<HistoricalFilter, News[]>('/news', filter, errorHandler)
    }

    async getById(id: string, errorHandler: (apiResponse: RestResponseError<News>) => void = RestHelper.handleError): Promise<News> {
        return (await this.restHelper.get<News>(`/news/${id}`, undefined, errorHandler)).data
    }

    async getCategoryCodes(source: string): Promise<CategoryCode[]> {
        return (await this.restHelper.get<CategoryCode[]>('/category-codes', {
            source
        })).data;
    }

    async getSources(): Promise<SourceDetails[]> {
        return (await (this.restHelper.get<SourceDetails[]>('/sources'))).data;
    }
}