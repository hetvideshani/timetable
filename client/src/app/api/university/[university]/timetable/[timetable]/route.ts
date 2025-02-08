import { NextResponse } from "next/server";
import { clear } from "../clear";
import { supabase } from "@/lib/dbConnect";

export async function DELETE(req: any, res: any) {
    try {
        console.log("Delete request");
        
        const uni_id = req.url!.split('university/')[1].split('/')[0];
        
        const timetable_id = req.url!.split('timetable/')[1].split('/')[0];
        console.log(timetable_id);
        const { data, error } = await supabase
            .from('timetable')
            .select('timetable')
            .eq('id', timetable_id)
        if (error) {
            throw error;
        }

        
        console.log(data);

        const response = await clear(uni_id, data[0].timetable);
        console.log(response);
        
        // const { error } = await supabase
        //     .from('timetable')
        //     .delete()
        //     .eq('id', timetable_id)
        // if (error) {
        //     throw error;
        // }
        return NextResponse.json({ status: 200, message: "Success" });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}