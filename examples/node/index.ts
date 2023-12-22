import {WebsocketErrorResponse, WebsocketMethod, WebsocketResponse, WebsocketResponseType, WsApi} from "newsware"
import {CloseEvent} from "ws";

// Change this with your actual apikey
const apiKey = "568f5d4d-d6ad-4250-b187-2d6179f05786"

function main() {
    const wsApi = new WsApi(apiKey, {
        // (Optional) Subscribe once the connection is open
        openCallback: () => {
            wsApi.subscribe({
                subscriptionId: "trackableId",
                filter: undefined // Add filters here. Example: Text.any("text to search")
            })
            console.log("Connection established, waiting for news...")
        },
        // Log received news to console
        callback: (message: WebsocketResponse) => {
            if (message.method === WebsocketMethod.SUBSCRIBE && message.type === WebsocketResponseType.DATA) {
                message.value.map(news => console.log(news))
            }
        },
        // (Optional, default is true) If true, attempts to reconnect if connection is unexpectedly closed.
        automaticReconnect: true,
        // (Optional) Throw errors and log to console
        errorCallback: (message: WebsocketErrorResponse) => {
            console.log("Websocket error: " + message.value.message)
            throw Error(message.value.message)
        },
        // (Optional) Log when connection closes
        closeCallback: (_: CloseEvent) => {
            console.log("Connection closed")
        }
    })
}

main()