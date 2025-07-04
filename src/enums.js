export var FilterType;
(function (FilterType) {
    FilterType["AND"] = "and";
    FilterType["AND_NOT"] = "andNot";
    FilterType["OR"] = "or";
    FilterType["TEXT"] = "text";
    FilterType["TICKERS"] = "tickers";
    FilterType["CODES"] = "codes";
    FilterType["CIKS"] = "ciks";
    FilterType["SOURCE"] = "source";
})(FilterType || (FilterType = {}));
export var FilterAction;
(function (FilterAction) {
    FilterAction["ALL"] = "all";
    FilterAction["ANY"] = "any";
    FilterAction["EXCLUDE"] = "exclude";
})(FilterAction || (FilterAction = {}));
export var Source;
(function (Source) {
    Source["DowJones"] = "DJ";
    Source["AccessWire"] = "AR";
    Source["GlobeNewswire"] = "PZ";
    Source["PRNewswire"] = "PN";
    Source["BusinessWire"] = "BW";
    Source["SEC"] = "SEC";
    Source["Hammerstone"] = "HS";
    Source["FlyOnTheWall"] = "fly_on_the_wall";
    Source["StreetInsider"] = "street_insider";
})(Source || (Source = {}));
export var WebsocketMethod;
(function (WebsocketMethod) {
    WebsocketMethod["SUBSCRIBE"] = "subscribe";
    WebsocketMethod["UNSUBSCRIBE"] = "unsubscribe";
    WebsocketMethod["ERROR"] = "error";
    // Internal message type, API does not return this error
    WebsocketMethod["SOCKET_ERROR"] = "_socket error";
})(WebsocketMethod || (WebsocketMethod = {}));
export var WebsocketResponseType;
(function (WebsocketResponseType) {
    WebsocketResponseType["OK"] = "ok";
    WebsocketResponseType["ERROR"] = "error";
    WebsocketResponseType["DATA"] = "data";
})(WebsocketResponseType || (WebsocketResponseType = {}));
export var Field;
(function (Field) {
    Field["ID"] = "id";
    Field["HEADLINE"] = "headline";
    Field["BODY"] = "body";
    Field["TICKERS"] = "tickers";
    Field["SOURCE"] = "source";
    Field["PUBLICATION_TIME"] = "publicationTime";
    Field["RECEIVED_TIME"] = "receivedTime";
    Field["CREATION_TIME"] = "creationTime";
    Field["CATEGORY_CODES"] = "categoryCodes";
    Field["INDUSTRY_CODES"] = "industryCodes";
    Field["REGION_CODES"] = "regionCodes";
    Field["CIKS"] = "ciks";
    Field["LINK"] = "link";
})(Field || (Field = {}));
export const Endpoint = {
    LOCALHOST: {
        host: "localhost:8080",
        websocketProtocol: "ws",
        restProtocol: "http"
    },
    PRODUCTION: {
        host: "newswareapi.encypherstudio.com",
        websocketProtocol: "wss",
        restProtocol: "https"
    },
};
//# sourceMappingURL=enums.js.map