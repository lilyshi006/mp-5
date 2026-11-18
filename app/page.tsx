import ShortenForm from "@/components/ShortenForm";

export default function Home() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#FFE8C4] to-[#FFCED8] px-4 py-12">
            <h1 className="text-3xl font-bold text-[#5C3D3D]">URL Shortener</h1>
            <p className="mb-6 mt-2 text-center text-sm text-[#5C3D3D]/70">
                Shorten your long URLs into compact, shareable links
            </p>
            <ShortenForm />
        </main>
    );
}