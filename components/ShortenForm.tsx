"use client";

import { useEffect, useState } from "react";

export default function ShortenForm() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [error, setError] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setShortUrl("");
        setCopied(false);
        setLoading(true);

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url, alias}),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Something went wrong.");
            } else {
                setShortUrl(`${origin}/${data.alias}`);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCopy() {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
    }

    return (
        <div className="w-full max-w-md rounded-3xl border-2 border-[#FFDDDD] bg-[#FFF4DE] p-6 shadow-md">
            <h2 className="text-lg font-bold">Shorten a URL</h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <label className="block">
                    <span className="text-sm">URL</span>
                    <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        className="mt-1 w-full rounded-xl border border-[#FFCED8] bg-white p-2.5 text-sm outline-none focus:border-[#5C3D3D]"
                    />
                </label>

                <label className="block">
                    <span className="text-sm">Custom Alias</span>
                    <div
                        className="mt-1 flex overflow-hidden rounded-xl border border-[#FFCED8] bg-white focus-within:border-[#5C3D3D]">
                        <span className="max-w-[50%] truncate bg-[#FFE8C4] px-3 py-2.5 text-sm">
                            {origin}/
                        </span>
                        <input
                            required
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="your-alias"
                            className="min-w-0 flex-1 p-2.5 text-sm outline-none"
                        />
                    </div>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#FFCED8] py-2.5 font-semibold transition hover:bg-[#FFDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Shortening..." : "Shorten"}
                </button>
            </form>

            {error && (
                <p className="mt-4 rounded-xl bg-[#FFDDDD] p-3 text-sm text-red-800">
                    {error}
                </p>
            )}

            {shortUrl && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#FFE8C4] p-3">
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-sm underline"
                    >
                        {shortUrl}
                    </a>
                    <button
                        onClick={handleCopy}
                        className="shrink-0 rounded-lg bg-white px-3 py-1 text-sm hover:bg-[#FFF4DE]"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            )}
        </div>
    );
}