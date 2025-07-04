import { EndpointDescription, RestResponse, RestResponseError, RestResponseSuccess } from "./types";
export declare class RestHelper {
    headers: Record<string, string>;
    restEndpoint: string;
    onError: (message: string) => void;
    constructor(endpoint?: EndpointDescription, headers?: Record<string, string>, _onError?: (message: string) => void);
    get<T>(path: string, params?: any, errorHandler?: (apiResponse: RestResponseError<T>) => void): Promise<RestResponse<T>>;
    delete<T>(path: string, params?: any, errorHandler?: (apiResponse: RestResponseError<T>) => void): Promise<RestResponse<T>>;
    post<T>(path: string, body?: object, options?: {
        params?: object;
        errorHandler?: (apiResponse: RestResponseError<T>) => void;
    }): Promise<RestResponseSuccess<T>>;
    put<T>(path: string, body?: object, options?: {
        params?: object;
        errorHandler?: (apiResponse: RestResponseError<T>) => void;
    }): Promise<RestResponseSuccess<T>>;
    request<T>({ method, path, params, body, errorHandler }: RequestOptions<T>): Promise<RestResponse<T>>;
    handle<T>(res: Response, handleError?: (apiResponse: RestResponseError<T>) => void): Promise<RestResponse<T>>;
    errorHandler(apiResponse: RestResponseError<any>): void;
    static handleError(apiResponse: RestResponseError<any>): void;
    private static messageFromApiError;
}
export type RequestOptions<T> = {
    method: string;
    path: string;
    params?: object;
    body?: object;
    errorHandler?: (apiResponse: RestResponseError<T>) => void;
};
