import { Endpoint } from "./enums"
import { RestHelper } from "./rest-helper"
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

    static async getCategoryCodes(source: string, endpoint: EndpointDescription = Endpoint.PRODUCTION): Promise<CategoryCode[]> {
        return (
            await new RestHelper(endpoint)
                .get<CategoryCode[]>('/category-codes', {
                    source
                })
        ).data;
    }

    static async getSources(endpoint: EndpointDescription = Endpoint.PRODUCTION): Promise<SourceDetails[]> {
        return (
            await (new RestHelper(endpoint).get<SourceDetails[]>('/sources'))
        ).data;
    }
}