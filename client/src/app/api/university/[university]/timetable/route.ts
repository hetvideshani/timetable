import { NextResponse } from "next/server";
import { schedule } from "./schedule";
import { deleteAllAllocators, generateAllocators } from "@/lib/resourceAllocator";

export async function POST(req: any, res: any) {
    try {
        const body = await req.json();
        const uni_id=req.url!.split('university/')[1].split('/')[0]; 
        // console.log(body);  
        const response = await schedule(body,uni_id)
        // await deleteAllAllocators(29, 'Faculty');
        // await deleteAllAllocators(29, 'Auditorium');
        // await deleteAllAllocators(29, 'Lab');
        // await deleteAllAllocators(29, 'Lecture');
        // await generateAllocators(29, 5, 4, true)

        return NextResponse.json({ status: 200, data: response, message: "Success" });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
