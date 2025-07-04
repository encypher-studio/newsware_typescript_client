type LocalContext = Readonly<{
    config: TestConfig;
}>;
interface TestConfig {
    addresses: string[];
    username: string;
    password: string;
    logRequests: string;
    index: string;
    apikey: string;
}
export type TestsContext = Mocha.Context & LocalContext;
export declare const mochaHooks: () => Mocha.RootHookObject;
export {};
