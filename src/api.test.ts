import { Api } from "./api";
import { Endpoint } from "./enums";
import { expect } from "chai"
import { TestsContext } from "../test/setup";
import { And, CategoryCodes, Ciks, Or, Sources, Text, Tickers } from "./filters";

describe("Api historical search", () => {
    let context: TestsContext

    before(async function () {
        context = this as TestsContext
    })

    it("paginate", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)
        let res = await api.search({
            pagination: {
                limit: 2,
            }
        })
        let actualNews = res.data
        expect(actualNews.length).to.eq(2)

        res = await api.search({
            pagination: {
                limit: 4,
            }
        })
        actualNews = res.data
        expect(actualNews.length).to.eq(4)

        res = await api.search({
            pagination: {
                limit: 3,
            }
        })
        actualNews = res.data
        expect(actualNews.length).to.eq(3)

        res = await api.search({
            pagination: {
                limit: 3,
                cursor: res.pagination?.cursor
            }
        })
        actualNews = res.data
        expect(actualNews.length).to.eq(3)

        res = await api.search({
            pagination: {
                limit: 3,
                cursor: res.pagination?.cursor
            }
        })
        actualNews = res.data
        expect(actualNews.length).to.eq(0)
    })

    it("published after", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            publishedAfter: 3000
        })).data
        expect(actualNews.length).to.eq(3)

        actualNews = (await api.search({
            publishedAfter: 5000
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            publishedAfter: 6000
        })).data
        expect(actualNews.length).to.eq(0)
    })

    it("published before", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            publishedBefore: 1000
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            publishedBefore: 5000
        })).data
        expect(actualNews.length).to.eq(4)

        actualNews = (await api.search({
            publishedBefore: 6000
        })).data
        expect(actualNews.length).to.eq(5)
    })

    it("published between", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            publishedAfter: 1000,
            publishedBefore: 3000
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            publishedAfter: 4000,
            publishedBefore: 6000
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            publishedAfter: 1000,
            publishedBefore: 6000
        })).data
        expect(actualNews.length).to.eq(4)

        actualNews = (await api.search({
            publishedAfter: 6000,
            publishedBefore: 10000
        })).data
        expect(actualNews.length).to.eq(0)
    })

    it("by body", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: Text.any(["one"], { onlyBody: true })
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            filter: Text.any(["1"], { onlyBody: true })
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            filter: Text.any(["1 two"], { onlyBody: true })
        })).data
        expect(actualNews.length).to.eq(0)
    })

    it("by headline", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: Text.any(["one"], { onlyHeadline: true })
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            filter: Text.any(["one 2"], { onlyHeadline: true })
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            filter: Text.any(["1"], { onlyHeadline: true })
        })).data
        expect(actualNews.length).to.eq(1)
    })

    it("by category code", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: CategoryCodes.any(["categoryCode1", "categoryCode2"])
        })).data
        expect(actualNews.length).to.eq(2)

        actualNews = (await api.search({
            filter: CategoryCodes.all(["categoryCode1", "categoryCode2"])
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            filter: CategoryCodes.all(["categoryCode1", "categoryCode11"])
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            filter: CategoryCodes.exclude(["categoryCode1", "categoryCode2"])
        })).data
        expect(actualNews.length).to.eq(4)
    })

    it("by tickers", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: Tickers.any(["ticker1", "ticker2"])
        })).data
        expect(actualNews.length).to.eq(2)

        actualNews = (await api.search({
            filter: Tickers.all(["ticker1", "ticker2"])
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            filter: Tickers.all(["ticker1", "ticker11"])
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            filter: Tickers.exclude(["ticker1", "ticker2"])
        })).data
        expect(actualNews.length).to.eq(4)
    })

    it("by ciks", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: Ciks.any([1, 2])
        })).data
        expect(actualNews.length).to.eq(2)

        actualNews = (await api.search({
            filter: Ciks.all([1, 2])
        })).data
        expect(actualNews.length).to.eq(0)

        actualNews = (await api.search({
            filter: Ciks.all([1, 11])
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            filter: Ciks.exclude([1, 2])
        })).data
        expect(actualNews.length).to.eq(4)
    })

    it("by source", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: Sources.any(["source1", "source2"])
        })).data
        expect(actualNews.length).to.eq(2)

        actualNews = (await api.search({
            filter: Sources.exclude(["source1", "source2"])
        })).data
        expect(actualNews.length).to.eq(4)
    })

    it("by and condition", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: And(
                Text.any(["1"]),
                Ciks.any([1])
            )
        })).data
        expect(actualNews.length).to.eq(1)

        actualNews = (await api.search({
            filter: And(
                Text.any(["2"]),
                Ciks.any([1])
            )
        })).data
        expect(actualNews.length).to.eq(0)
    })

    it("by or condition", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.search({
            filter: Or(
                Text.any(["1"]),
                Ciks.any([2])
            )
        })).data
        expect(actualNews.length).to.eq(2)

        actualNews = (await api.search({
            filter: Or(
                Text.any(["2"]),
                Ciks.any([1]),
                Tickers.any(["ticker3"])
            )
        })).data
        expect(actualNews.length).to.eq(3)
    })

    it("get by id", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        let actualNews = (await api.getById("2")).data
        expect(actualNews.id).eq("2")
    })

    it("get by id (404)", async () => {
        const api = new Api(context.config.apikey, Endpoint.LOCALHOST)

        await api.getById("2000", function (response) {
            expect(response.error.code).eq(404)
            expect(response.error.message).eq("Resource not found")
        })
    })
})