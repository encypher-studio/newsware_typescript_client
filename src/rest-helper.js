import { Endpoint } from "./enums";
export class RestHelper {
    headers;
    restEndpoint;
    onError;
    constructor(endpoint = Endpoint.PRODUCTION, headers = {}, _onError = () => { }) {
        this.headers = headers;
        this.onError = _onError;
        this.restEndpoint = endpoint.restProtocol + "://" + endpoint.host + "/api/v3";
        this.headers["content-type"] = "application/json";
    }
    async get(path, params, errorHandler) {
        return await this.request({ method: "GET", path, params, errorHandler });
    }
    async delete(path, params, errorHandler) {
        return await this.request({ method: "DELETE", path, params, errorHandler });
    }
    async post(path, body, options) {
        return await this.request({ method: "POST", path, body, ...options });
    }
    async put(path, body, options) {
        return await this.request({ method: "PUT", path, body, ...options });
    }
    async request({ method, path, params, body, errorHandler }) {
        try {
            var paramsString = {};
            if (params) {
                Object.keys(params).forEach(key => {
                    if (params[key] === undefined)
                        return;
                    paramsString[key] = typeof params[key] === "object"
                        ? JSON.stringify(params[key])
                        : params[key];
                });
            }
            const endpoint = this.restEndpoint + path + (paramsString ? "?" + new URLSearchParams(paramsString) : '');
            const res = await fetch(endpoint, {
                method: method,
                body: body ? JSON.stringify(body) : undefined,
                headers: this.headers,
            });
            return this.handle(res, errorHandler);
        }
        catch (e) {
            if (e.cause?.errors?.length > 0) {
                throw Error(e.cause.errors[0]);
            }
            throw e;
        }
    }
    async handle(res, handleError) {
        const restResponse = await res.json();
        if (res.status < 200 || res.status > 299) {
            handleError ? handleError(restResponse) : this.errorHandler(restResponse);
        }
        return restResponse;
    }
    errorHandler(apiResponse) {
        const message = RestHelper.messageFromApiError(apiResponse);
        this.onError(message);
        throw Error(message);
    }
    static handleError(apiResponse) {
        throw Error(RestHelper.messageFromApiError(apiResponse));
    }
    static messageFromApiError(apiResponse) {
        return `Status ${apiResponse.error.code}${apiResponse.error
            ? ": " + apiResponse.error.message.charAt(0).toUpperCase() + apiResponse.error.message.slice(1)
            : ""}`;
    }
}
//# sourceMappingURL=rest-helper.js.map