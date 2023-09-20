import {Api, News} from "newsware"
import {ErrorEvent, CloseEvent} from "ws";

// Change this with your actual apikey
const apiKey = "568f5d4d-d6ad-4250-b187-2d6179f05786"

function main() {
    const api = new Api(apiKey)
    api.subscribe(
        {
            filter: {
                // Add filters here
            },
            // Log received news to console
            callback: (news: News[]) => news.map(console.log),
            // (Optional, default is true) If true, attempts to reconnect if connection is unexpectedly closed.
            automaticReconnect: true,
            // (Optional) Log errors to console
            errorCallback: (error: ErrorEvent) => {
                console.log("Websocket error: " + error.message)
            },
            // (Optional) Log when connection is successfully opened
            openCallback: () => {
                console.log("Connection established, waiting for news...")
            },
            // (Optional) Log when connection closes
            closeCallback: (_: CloseEvent) => {
                console.log("Connection closed")
            }
        }
    )
}

main()