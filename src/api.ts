import { Endpoint } from "./enums"
import { RestHelper } from "./rest-helper"
import {
    Code,
    CodeType,
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
        return await this.restHelper.post<News[]>('/news', filter, {errorHandler})
    }

    async getById(id: string, errorHandler: (apiResponse: RestResponseError<News>) => void = RestHelper.handleError): Promise<News> {
        return (await this.restHelper.get<News>(`/news/${id}`, {errorHandler})).data
    }

    static async getCodes(source: string, typ: CodeType, endpoint: EndpointDescription = Endpoint.PRODUCTION): Promise<Code[]> {
        return (
            await new RestHelper(endpoint)
                .get<Code[]>('/codes', {
                    source,
                    type: typ
                })
        ).data;
    }

    static async getSources(endpoint: EndpointDescription = Endpoint.PRODUCTION): Promise<SourceDetails[]> {
        return (
            await (new RestHelper(endpoint).get<SourceDetails[]>('/sources'))
        ).data;
    }
}