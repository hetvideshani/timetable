import { NextResponse } from "next/server";
import { schedule } from "./schedule";
import { generateAllocators, getAllocator, updateAllocator } from "@/lib/resourceAllocator";

export async function POST(req: any, res: any) {
    // const body = await req.json();
    // console.log(body);
    // const response = await schedule(body)
    // await generateAllocators(29,5,8)
    await updateAllocator(29, "Lab", 'H-404', 0,0, 30, 10)
    const responsee = await getAllocator(29, "Lab", 'H-404')
    console.log(responsee[0].sessions)
    return NextResponse.json({ status: 200, data: [], message: "Success" });

}
