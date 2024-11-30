import { NextResponse } from "next/server";
import { schedule } from "./schedule";

export async function POST(req: any, res: any) {
    try {
        const body = await req.json();
        console.log(body);  
        const response = await schedule(body)
        return NextResponse.json({ status: 200, data: response, message: "Success" });
    } catch (error:any) {
        console.log(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
