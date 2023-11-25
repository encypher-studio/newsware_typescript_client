import {Api} from "./api";
import {Endpoint, FilterArrayAction} from "./enums";
import {expect} from "chai"
import {TestsContext} from "../test/setup";
import {and, categoryCodes, ciks, or, source, text, tickers} from "./filters";

describe("Api historical search", () => {
    let context: TestsContext

    before(async function () {
        context = this as TestsContext
    })

    it("paginate", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)
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
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

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
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

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
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

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
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: text("one", {onlyBody: true})
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            filter: text("1", {onlyBody: true})
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            filter: text("1 two", {onlyBody: true})
        })
        expect(actualNews.length).to.eq(0)
    })

    it("by headline", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: text("one", {onlyHeadline: true})
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            filter: text("one 2", {onlyHeadline: true})
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            filter: text("1", {onlyHeadline: true})
        })
        expect(actualNews.length).to.eq(1)
    })

    it("by category code", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: categoryCodes(FilterArrayAction.ANY, ["categoryCode1", "categoryCode2"])
        })
        expect(actualNews.length).to.eq(2)

        actualNews = await api.search({
            filter: categoryCodes(FilterArrayAction.ALL, ["categoryCode1", "categoryCode2"])
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            filter: categoryCodes(FilterArrayAction.ALL, ["categoryCode1", "categoryCode11"])
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            filter: categoryCodes(FilterArrayAction.EXCLUDE, ["categoryCode1", "categoryCode2"])
        })
        expect(actualNews.length).to.eq(4)
    })

    it("by tickers", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: tickers(FilterArrayAction.ANY, ["ticker1", "ticker2"])
        })
        expect(actualNews.length).to.eq(2)

        actualNews = await api.search({
            filter: tickers(FilterArrayAction.ALL, ["ticker1", "ticker2"])
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            filter: tickers(FilterArrayAction.ALL, ["ticker1", "ticker11"])
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            filter: tickers(FilterArrayAction.EXCLUDE, ["ticker1", "ticker2"])
        })
        expect(actualNews.length).to.eq(4)
    })

    it("by ciks", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: ciks(FilterArrayAction.ANY, [1, 2])
        })
        expect(actualNews.length).to.eq(2)

        actualNews = await api.search({
            filter: ciks(FilterArrayAction.ALL, [1, 2])
        })
        expect(actualNews.length).to.eq(0)

        actualNews = await api.search({
            filter: ciks(FilterArrayAction.ALL, [1, 11])
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            filter: ciks(FilterArrayAction.EXCLUDE, [1, 2])
        })
        expect(actualNews.length).to.eq(4)
    })

    it("by source", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: source(FilterArrayAction.ANY, ["source1", "source2"])
        })
        expect(actualNews.length).to.eq(2)

        actualNews = await api.search({
            filter: source(FilterArrayAction.EXCLUDE, ["source1", "source2"])
        })
        expect(actualNews.length).to.eq(4)
    })

    it("by and condition", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: and(
                text("1"),
                ciks(FilterArrayAction.ANY, [1])
            )
        })
        expect(actualNews.length).to.eq(1)

        actualNews = await api.search({
            filter: and(
                text("2"),
                ciks(FilterArrayAction.ANY, [1])
            )
        })
        expect(actualNews.length).to.eq(0)
    })

    it("by or condition", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = await api.search({
            filter: or(
                text("1"),
                ciks(FilterArrayAction.ANY, [2])
            )
        })
        expect(actualNews.length).to.eq(2)

        actualNews = await api.search({
            filter: or(
                text("2"),
                ciks(FilterArrayAction.ANY, [1]),
                tickers(FilterArrayAction.ANY, ["ticker3"])
            )
        })
        expect(actualNews.length).to.eq(3)
    })
})