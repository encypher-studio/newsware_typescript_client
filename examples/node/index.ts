import {Api, WebsocketErrorResponse, WebsocketResponse, WebsocketMethod, WebsocketResponseType} from "newsware"
import {CloseEvent} from "ws";

// Change this with your actual apikey
const apiKey = "568f5d4d-d6ad-4250-b187-2d6179f05786"

function main() {
    const api = new Api(apiKey)
    const wsClient = api.getWsClient({
        // (Optional) Subscribe once the connection is open
        openCallback: () => {
            wsClient.subscribe({
                subscriptionId: "trackableId",
                filter: {
                    // Add filters here
                },
            })
            console.log("Connection established, waiting for news...")
        },
        // Log received news to console
        callback: (message: WebsocketResponse) => {
            if (message.method === WebsocketMethod.SUBSCRIBE && message.type === WebsocketResponseType.DATA) {
                message.payload.map(news => console.log(news))
            }
        },
        // (Optional, default is true) If true, attempts to reconnect if connection is unexpectedly closed.
        automaticReconnect: true,
        // (Optional) Throw errors and log to console
        errorCallback: (message: WebsocketErrorResponse) => {
            console.log("Websocket error: " + message.payload.message)
            throw Error(message.payload.message)
        },
        // (Optional) Log when connection closes
        closeCallback: (_: CloseEvent) => {
            console.log("Connection closed")
        }
    })
}

main()