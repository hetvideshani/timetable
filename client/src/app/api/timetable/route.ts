import { NextResponse } from "next/server";

export async function POST(req: any, res: any) {
    const body = await req.json();
    console.log(body);
    return NextResponse.json({ status: 200, data:body,message: "Success" });
    
}
