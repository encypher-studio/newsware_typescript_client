import React, {useEffect, useState} from "react";
import "./App.css";
import {Api, News} from "newsware";
import {toast, ToastContainer} from "react-toastify";

function App() {
    const columns = ["Source", "Time", "Headline", "Body"]

    const [news, setNews] = useState<News[]>([])
    const [inputApikey, setInputApikey] = useState<string>("")
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
    const [api, setApi] = useState<Api>()

    // Subscribe after api creation
    useEffect(() => {
        if (api && !isSubscribed)
            api!!.subscribe(
                {
                    filter: {
                        // Add filters here
                    },
                    // Handle received news
                    callback: (receivedNews: News[]) => setNews(prevState => [...receivedNews, ...prevState]),
                    // (Optional, default is true) If true, attempts to reconnect if connection is unexpectedly closed.
                    automaticReconnect: true,
                    // (Optional) Show error toasts
                    errorCallback: () => {
                        setIsSubscribed(false)
                        toast.error("Error, check your apikey")
                    },
                    // (Optional) Show a toast when connection is opened
                    openCallback: () => {
                        setIsSubscribed(true)
                        toast.success("Connected")
                    },
                    // (Optional) Show a toast when connection is closed
                    closeCallback: () => {
                        setIsSubscribed(false)
                        setApi(undefined)
                        toast.error("Connection closed")
                    }
                },
            )
    }, [api])

    const fieldStyle = {
        padding: "10px",
        border: "1px solid black",
        fontSize: "13px",
    }

    const renderNews = () => {
        return news.map(({id, source, publicationTime, headline, body}) => {
            return <tr key={id} style={{maxWidth: "100%"}}>
                <td style={{...fieldStyle, width: "10%"}}>{source}</td>
                <td style={{...fieldStyle, width: "20%"}}>{publicationTime}</td>
                <td style={{...fieldStyle, width: "30%"}}>{headline}</td>
                <td style={{...fieldStyle, width: "40%"}}>{body}</td>
            </tr>
        })
    }

    const renderHeader = () => {
        return <tr>
            {columns.map(column => <th style={{fontSize: "15px"}}>{column}</th>)}
        </tr>
    }

    const subscribe = () => {
        setApi(new Api(inputApikey))
    }

    const unsubscribe = () => {
        api!!.unsubscribe()
    }

    return (
        <div className="App">
            <header className="App-header">
                <label htmlFor="apikey" style={{paddingBottom: "10px"}}>Api key</label>
                <input id="apikey" placeholder="Api key" value={inputApikey}
                       onChange={e => setInputApikey(e.target.value)}/>
                <div style={{paddingBottom: "10px"}}>
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
    );
}

export default App;
