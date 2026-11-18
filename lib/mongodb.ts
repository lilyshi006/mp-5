import { MongoClient, Collection } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI is not set");

// Reuse one client across hot reloads / serverless invocations
const globalForMongo = globalThis as unknown as {
    _mongoClient?: Promise<MongoClient>;
};
const clientPromise =
    globalForMongo._mongoClient ?? new MongoClient(uri).connect();
globalForMongo._mongoClient = clientPromise;

export interface UrlDoc {
    alias: string;
    url: string;
}

export async function getUrlCollection(): Promise<Collection<UrlDoc>> {
    const client = await clientPromise;
    const col = client.db("url-shortener").collection<UrlDoc>("urls");
    await col.createIndex({ alias: 1 }, { unique: true }); // enforces no duplicates
    return col;
}