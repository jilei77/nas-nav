import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        // Read settings to get API key
        const dataPath = path.join(process.cwd(), "data", "sites.json");
        const fileContents = fs.readFileSync(dataPath, "utf8");
        const data = JSON.parse(fileContents);
        const { openaiUrl, openaiKey } = data.settings;

        if (!openaiUrl || !openaiKey) {
            return NextResponse.json({ error: "OpenAI settings not configured" }, { status: 400 });
        }

        // Call OpenAI API
        const prompt = `Generate a short, concise description (max 10 words) for the website: ${url}. Return ONLY the description, no quotes.`;

        const response = await fetch(openaiUrl + "/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 50
            })
        });

        if (!response.ok) {
            throw new Error("OpenAI API failed");
        }

        const json = await response.json();
        const description = json.choices[0].message.content.trim();

        return NextResponse.json({ description });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
    }
}
