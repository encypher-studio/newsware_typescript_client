import { WebsocketErrorResponse, WebsocketMethod, WebsocketResponse, WebsocketResponseType, WsApi, Field } from "newsware"
import { CloseEvent } from "ws";

// Change this with your actual apikey
const apiKey = "568f5d4d-d6ad-4250-b187-2d6179f05786"

function main() {
    const wsApi = new WsApi(apiKey, {
        // (Optional) Subscribe once the connection is open
        openCallback: () => {
            wsApi.subscribe({
                subscriptionId: "trackableId",
                filter: undefined, // Add filters here. Example: Text.any("text to search")
                fields: [Field.HEADLINE, Field.BODY, Field.PUBLICATION_TIME, Field.SOURCE] // Add additional fields to retrieve here
            })
            console.log("Connection established, waiting for news...")
        },
        // Log received news to console
        callback: (message: WebsocketResponse) => {
            if (message.method === WebsocketMethod.SUBSCRIBE && message.type === WebsocketResponseType.DATA) {
                console.log(message.value)
            }
        },
        // (Optional, default is true) If true, attempts to reconnect if connection is unexpectedly closed.
        reconnect: true,
        // (Optional, default is 1000) Delay in milliseconds before attempting to reconnect.
        reconnectDelay: 1000,
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