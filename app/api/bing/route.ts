import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN");
        const data = await res.json();
        const imageUrl = `https://www.bing.com${data.images[0].url}`;
        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Bing image" }, { status: 500 });
    }
}
