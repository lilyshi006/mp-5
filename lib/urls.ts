import { getUrlCollection } from "./mongodb";

// Aliases that would collide with real routes
const RESERVED_ALIASES = ["api"];

export function isValidUrl(value: string): boolean {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

export function isValidAlias(alias: string): boolean {
    return /^[A-Za-z0-9_-]+$/.test(alias) && !RESERVED_ALIASES.includes(alias.toLowerCase());
}

export type CreateResult =
    | { ok: true; alias: string }
    | { ok: false; status: number; error: string };

export async function createShortUrl(url: string, alias: string): Promise<CreateResult> {
    if (!isValidUrl(url))
        return { ok: false, status: 400, error: "Please enter a valid URL (http:// or https://)." };
    if (!isValidAlias(alias))
        return { ok: false, status: 400, error: "Alias may only contain letters, numbers, - and _ (and cannot be 'api')." };

    const col = await getUrlCollection();
    try {
        await col.insertOne({ alias, url });
        return { ok: true, alias };
    } catch (err: any) {
        if (err?.code === 11000) // duplicate key
            return { ok: false, status: 409, error: "That alias is already taken." };
        throw err;
    }
}

export async function getUrlByAlias(alias: string): Promise<string | null> {
    const col = await getUrlCollection();
    const doc = await col.findOne({ alias });
    return doc?.url ?? null;
}