import { Endpoint } from "./enums";
import { RestHelper } from "./rest-helper";
export class Api {
    restHelper;
    constructor(apikey, endpoint = Endpoint.PRODUCTION) {
        this.restHelper = new RestHelper(endpoint, {
            "x-api-key": apikey
        });
    }
    changeApikey(apikey) {
        this.restHelper.headers["x-api-key"] = apikey;
    }
    async search(filter, errorHandler = RestHelper.handleError) {
        return await this.restHelper.post('/news', filter, { errorHandler });
    }
    async getById(id, errorHandler = RestHelper.handleError) {
        return (await this.restHelper.get(`/news/${id}`, { errorHandler })).data;
    }
    static async getCodes(source, typ, endpoint = Endpoint.PRODUCTION) {
        return (await new RestHelper(endpoint)
            .get('/codes', {
            source,
            type: typ
        })).data;
    }
    static async getSources(endpoint = Endpoint.PRODUCTION) {
        return (await (new RestHelper(endpoint).get('/sources'))).data;
    }
}
//# sourceMappingURL=api.js.map