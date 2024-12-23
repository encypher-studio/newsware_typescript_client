import { EndpointDescription } from "./types"

export enum FilterType {
    AND = "and",
    AND_NOT = "andNot",
    OR = "or",
    TEXT = "text",
    TICKERS = "tickers",
    CODES = "codes",
    CIKS = "ciks",
    SOURCE = "source"
}

export enum FilterAction {
    ALL = "all",
    ANY = "any",
    EXCLUDE = "exclude"
}

export enum Source {
    DowJones = "DJ",
    AccessWire = "AR",
    GlobeNewswire = "PZ",
    PRNewswire = "PN",
    BusinessWire = "BW",
    SEC = "SEC",
    Hammerstone = "HS",
    FlyOnTheWall = "fly_on_the_wall",
    StreetInsider = "street_insider",
}

export enum WebsocketMethod {
    SUBSCRIBE = "subscribe",
    UNSUBSCRIBE = "unsubscribe",
    ERROR = "error",

    // Internal message type, API does not return this error
    SOCKET_ERROR = "_socket error"
}

export enum WebsocketResponseType {
    OK = "ok",
    ERROR = "error",
    DATA = "data"
}

export enum Field {
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

export const Endpoint: { [key: string]: EndpointDescription } = {
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
}