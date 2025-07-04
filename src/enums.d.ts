import { EndpointDescription } from "./types";
export declare enum FilterType {
    AND = "and",
    AND_NOT = "andNot",
    OR = "or",
    TEXT = "text",
    TICKERS = "tickers",
    CODES = "codes",
    CIKS = "ciks",
    SOURCE = "source"
}
export declare enum FilterAction {
    ALL = "all",
    ANY = "any",
    EXCLUDE = "exclude"
}
export declare enum Source {
    DowJones = "DJ",
    AccessWire = "AR",
    GlobeNewswire = "PZ",
    PRNewswire = "PN",
    BusinessWire = "BW",
    SEC = "SEC",
    Hammerstone = "HS",
    FlyOnTheWall = "fly_on_the_wall",
    StreetInsider = "street_insider"
}
export declare enum WebsocketMethod {
    SUBSCRIBE = "subscribe",
    UNSUBSCRIBE = "unsubscribe",
    ERROR = "error",
    SOCKET_ERROR = "_socket error"
}
export declare enum WebsocketResponseType {
    OK = "ok",
    ERROR = "error",
    DATA = "data"
}
export declare enum Field {
    ID = "id",
    HEADLINE = "headline",
    BODY = "body",
    TICKERS = "tickers",
    SOURCE = "source",
    PUBLICATION_TIME = "publicationTime",
    RECEIVED_TIME = "receivedTime",
    CREATION_TIME = "creationTime",
    CATEGORY_CODES = "categoryCodes",
    INDUSTRY_CODES = "industryCodes",
    REGION_CODES = "regionCodes",
    CIKS = "ciks",
    LINK = "link"
}
export declare const Endpoint: {
    [key: string]: EndpointDescription;
};
