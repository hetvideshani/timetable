import { NextResponse } from "next/server";
import { schedule } from "./schedule";
import { resetAllAllocators } from "@/lib/resourceAllocator";

export async function POST(req: any, res: any) {
    try {
        const body = await req.json();
        const uni_id=req.url!.split('university/')[1].split('/')[0]; 
        console.log(body);  
        const response = await schedule(body,uni_id)
        // await resetAllAllocators(uni_id, 5, 4);

        return NextResponse.json({ status: 200, data: response, message: "Success" });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
