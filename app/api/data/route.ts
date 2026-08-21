import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "sites.json");

export async function GET() {
    try {
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ categories: [], settings: { password: "admin" } });
        }
        const fileContents = fs.readFileSync(dataPath, "utf8");
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation could go here
        fs.writeFileSync(dataPath, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }
}
