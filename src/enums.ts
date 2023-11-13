import {EndpointDescription} from "./types";

export enum QueryType {
    And = "and",
    Or = "or",
    Text = "text"
}

export enum Source {
    DowJones = "DJ",
    AccessWire = "AR",
    GlobeNewswire = "PZ",
    PRNewswire = "PN",
    BusinessWire = "BW",
    SEC = "SEC",
    Hammerstone = "HS"
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