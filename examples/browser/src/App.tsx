import React, { useState } from "react";
import "./App.css";
import { WsApi, News, WebsocketResponse, WebsocketResponseType, WebsocketMethod, Field } from "newsware";
import { toast, ToastContainer } from "react-toastify";

function App() {
    const columns = ["Source", "Time", "Headline", "Body"]

    const [news, setNews] = useState<News[]>([])
    const [inputApikey, setInputApikey] = useState<string>("")
    const [wsApi, setWsApi] = useState<WsApi>()
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

    const fieldStyle = {
        padding: "10px",
        border: "1px solid black",
        fontSize: "13px",
    }

    const renderNews = () => {
        return news.map(({ id, source, publicationTime, headline, body }) => {
            return <tr key={id} style={{ maxWidth: "100%" }}>
                <td style={{ ...fieldStyle, width: "10%" }}>{source}</td>
                <td style={{ ...fieldStyle, width: "20%" }}>{publicationTime}</td>
                <td style={{ ...fieldStyle, width: "30%" }}>{headline}</td>
                <td style={{ ...fieldStyle, width: "40%" }}>{body}</td>
            </tr>
        })
    }

    const renderHeader = () => {
        return <tr>
            {columns.map(column => <th style={{ fontSize: "15px" }}>{column}</th>)}
        </tr>
    }

    const subscribe = () => {
        const wsApi = new WsApi(inputApikey, {
            // Handle received news
            callback: (message: WebsocketResponse) => {
                if (message.method === WebsocketMethod.SUBSCRIBE && message.type === WebsocketResponseType.DATA)
                    setNews(prevState => [message.value, ...prevState])
            },
            // (Optional, default is 1000) Delay in milliseconds before attempting to reconnect.
            reconnectDelay: 1000,
            // (Optional, default is true) If true, attempts to reconnect if connection is unexpectedly closed.
            automaticReconnect: false,
            // (Optional) Show error toasts
            errorCallback: () => {
                setIsSubscribed(false)
                toast.error("Error, check your apikey")
            },
            // (Optional) Show a toast when connection is opened
            openCallback: () => {
                toast.success("Connected")
                wsApi.subscribe({
                    subscriptionId: "trackableId",
                    filter: undefined, // Add filters here. Example: Text.any("text to search")
                    fields: [Field.HEADLINE, Field.BODY, Field.PUBLICATION_TIME, Field.SOURCE] // Add additional fields to retrieve here
                })
                setIsSubscribed(true)
                setWsApi(wsApi)
            },
            // (Optional) Show a toast when connection is closed
            closeCallback: () => {
                setIsSubscribed(false)
                toast.error("Connection closed")
            }
        })
    }

    const unsubscribe = () => {
        wsApi!!.unsubscribe("trackableId")
        setIsSubscribed(false)
    }

    return (
        <div className="App">
            <header className="App-header">
                <label htmlFor="apikey" style={{ paddingBottom: "10px" }}>Api key</label>
                <input id="apikey" placeholder="Api key" value={inputApikey}
                    onChange={e => setInputApikey(e.target.value)} />
                <div style={{ paddingBottom: "10px" }}>
                    {
                        isSubscribed ?
                            <button onClick={unsubscribe}> Unsubscribe </button>
                            :
                            <button onClick={subscribe}> Subscribe </button>
                    }
                </div>
                {
                    news.length > 0 ?
                        <table>
                            <thead>
                                {renderHeader()}
                            </thead>
                            <tbody>
                                {renderNews()}
                            </tbody>
                        </table>
                        : isSubscribed ?
                            <div>Wating for news...</div>
                            :
                            <div></div>
                }

            </header>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}

export default App;
