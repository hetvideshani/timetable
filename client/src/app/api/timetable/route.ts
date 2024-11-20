import { NextResponse } from "next/server";
import { schedule } from "./schedule";

export async function POST(req: any, res: any) {
    const body = await req.json();
    console.log(body);
    const response = await schedule(body)
    return NextResponse.json({ status: 200, data: response, message: "Success" });

}
