import { NextResponse } from "next/server";
import { createShortUrl } from "@/lib/urls";

export async function POST(req: Request) {
    let body: { url?: string; alias?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const url = (body.url ?? "").trim();
    const alias = (body.alias ?? "").trim();
    if (!url || !alias)
        return NextResponse.json({ error: "URL and alias are required." }, { status: 400 });

    const result = await createShortUrl(url, alias);
    if (!result.ok)
        return NextResponse.json({ error: result.error }, { status: result.status });

    return NextResponse.json({ alias: result.alias }, { status: 201 });
}