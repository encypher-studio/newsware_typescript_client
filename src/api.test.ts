import {Api} from "./api";
import {Endpoint} from "./enums";
import {expect} from "chai"
import {TestsContext} from "../test/setup";

describe("Api historical search", () => {
    let context: TestsContext
    
    before(async function () {
        context = this as TestsContext
    })
    
    it("paginate", async () => {
        const api = new Api(context.config.apikey, Endpoint.Localhost)
        let actualNews = await api.search({
            pagination: {
                limit: 2,
                page: 1
            }
        })
        expect(actualNews.length).to.eq(2)

        actualNews = await api.search({
            pagination: {
                limit: 4,
                page: 1
            }
        })
        expect(actualNews.length).to.eq(4)

        actualNews = await api.search({
            pagination: {
                limit: 10,
                page: 2
            }
        })
        expect(actualNews.length).to.eq(0)
    })

    it("published after", async () => {
        const api = new Api(context.config.apikey, Endpoint.Localhost)
        
        let actualNews = await api.search({
            publishedAfter: 3000
        })
        expect(actualNews.length).to.eq(3)

        actualNews = await api.search({
            publishedAfter: 5000
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            publishedAfter: 6000
        })
        expect(actualNews.length).to.eq(0)
    })

    it("published before", async () => {
        const api = new Api(context.config.apikey, Endpoint.Localhost)

        let actualNews = await api.search({
            publishedBefore: 1000
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            publishedBefore: 5000
        })
        expect(actualNews.length).to.eq(4)

        actualNews = await api.search({
            publishedBefore: 6000
        })
        expect(actualNews.length).to.eq(5)
    })

    it("published between", async () => {
        const api = new Api(context.config.apikey, Endpoint.Localhost)

        let actualNews = await api.search({
            publishedAfter: 1000,
            publishedBefore: 3000
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            publishedAfter: 4000,
            publishedBefore: 6000
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            publishedAfter: 1000,
            publishedBefore: 6000
        })
        expect(actualNews.length).to.eq(4)

        actualNews = await api.search({
            publishedAfter: 6000,
            publishedBefore: 10000
        })
        expect(actualNews.length).to.eq(0)
    })

    it("by body", async () => {
        const api = new Api(context.config.apikey, Endpoint.Localhost)

        let actualNews = await api.search({
            query: {
                text: {
                    text: "one",
                    searchBody: true
                }
            }
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            query: {
                text: {
                    text: "1",
                    searchBody: true
                }
            }
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            query: {
                text: {
                    text: "1 two",
                    searchBody: true
                }
            }
        })
        expect(actualNews.length).to.eq(1)
    })

    it("by headline", async () => {
        const api = new Api(context.config.apikey, Endpoint.Localhost)

        let actualNews = await api.search({
            query: {
                text: {
                    text: "one",
                    searchHeadline: true
                }
            }
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            query: {
                text: {
                    text: "one 2",
                    searchHeadline: true
                }
            }
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            query: {
                text: {
                    text: "1",
                    searchHeadline: true
                }
            }
        })
        expect(actualNews.length).to.eq(1)
    })
})