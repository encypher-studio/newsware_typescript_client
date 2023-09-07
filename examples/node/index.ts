import {Api, News} from "newsware"
import {ErrorEvent, CloseEvent} from "ws";
import {ApiHost} from "../../src";

// Change this with your actual apikey
const apiKey = "568f5d4d-d6ad-4250-b187-2d6179f05786"

function main() {
    const api = new Api(apiKey, ApiHost.Localhost)
    api.subscribe(
        {
            // Add filters here
        },
        // On news received
        (news: News) => {
            console.log(news)
        },
        // On error
        (error: ErrorEvent) => {
            console.log("Websocket error: " + error.message)
        },
        // On connection opened
        () => {
            console.log("Connection established, waiting for news...")
        },
        // On connection closed
        (_: CloseEvent) => {
            console.log("Connection closed")
        }
    )
}

main()