import { Client } from "@elastic/elasticsearch";
import * as yaml from "js-yaml";
import * as fs from "fs";
export const mochaHooks = () => ({
    async beforeAll() {
        this.timeout(10000);
        const config = yaml.load(fs.readFileSync("./test/config.yml", "utf8"));
        if (!config.index.endsWith("_tests")) {
            throw Error("Index for tests must end in _test, otherwise production data loss is possible. Current value is: " + config.index);
        }
        await seed(config);
        const context = {
            config
        };
        Object.assign(this, context);
    }
});
async function seed(config) {
    const client = new Client({
        node: config.addresses,
        auth: {
            username: config.username,
            password: config.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    if (!await client.ping()) {
        throw Error("Failed to connect to ElasticSearch");
    }
    await client.indices.delete({
        index: config.index
    });
    await client.indices.create({
        index: config.index,
        mappings: {
            properties: {
                "id": {
                    type: "keyword"
                },
            }
        }
    });
    const seedData = JSON.parse(fs.readFileSync("./test/testdata.json")
        .toString("utf-8"));
    const operations = seedData.flatMap(doc => [{ index: { _index: config.index, _id: doc.id } }, doc]);
    const bulkResponse = await client.bulk({ refresh: true, operations });
    if (bulkResponse.errors) {
        const erroredDocuments = [];
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0];
            if (action[operation]?.error) {
                erroredDocuments.push({
                    status: action[operation]?.status,
                    error: action[operation]?.error,
                    operation: operations[i * 2],
                    document: operations[i * 2 + 1]
                });
            }
        });
        throw Error(erroredDocuments.toString());
    }
}
//# sourceMappingURL=setup.js.map