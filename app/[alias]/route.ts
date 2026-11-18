import { redirect } from "next/navigation";
import { getUrlByAlias } from "@/lib/urls";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ alias: string }> }
) {
    const { alias } = await params;
    const url = await getUrlByAlias(alias);
    if (!url) return new Response("Alias not found", { status: 404 });
    redirect(url);
}