import { MongoClient, Collection } from "mongodb";

export interface UrlDoc {
    alias: string;
    url: string;
}

const g = globalThis as unknown as {
    _mongoClient?: Promise<MongoClient>;
    _indexReady?: Promise<unknown>;
};

function getClient(): Promise<MongoClient> {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set");

    if (!g._mongoClient) {
        g._mongoClient = new MongoClient(uri).connect().catch((err) => {
            g._mongoClient = undefined; // don't cache failures
            g._indexReady = undefined;
            throw err;
        });
    }
    return g._mongoClient;
}

export async function getUrlCollection(): Promise<Collection<UrlDoc>> {
    const client = await getClient();
    const col = client.db("url-shortener").collection<UrlDoc>("urls");

    g._indexReady ??= col.createIndexes([{ key: { alias: 1 }, unique: true }]);
    await g._indexReady;

    return col;
}