import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(req:any, res:any){
    const class_data = await req.json()
    const { class_no, total_batches, students_per_batch, branch_id } = class_data
    try 
    {
        const { data, error } = await supabase
           .from('class')
           .insert([{ class_no, total_batches, students_per_batch, branch_id }]);

        if (error) {
            throw error
        }
        
        return NextResponse.json({ status : 201, data: data, function_name: 'create_class' })
        }
    catch (error:any)
    {
        console.error(error);
        return NextResponse.json({status : 500, error_message: error.message, function_name: 'create_class' });
    }
}