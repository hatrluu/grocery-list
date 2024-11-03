import { NextResponse } from "next/server";

export async function GET() {
    try {
        return new NextResponse('Hello World');
    }
    catch (err) {
        console.error(err);
    }
}