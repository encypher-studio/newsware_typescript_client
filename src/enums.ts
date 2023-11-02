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
    SEC = "SEC"
}

export enum WebsocketMessageType {
    SUBSCRIBE = "subscribe",
    ERROR = "error",
    
    // Internal message type, API does not return this error
    SOCKET_ERROR = "_socket error"
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