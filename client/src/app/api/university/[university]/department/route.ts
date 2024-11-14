import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const POST = async(req:any, res:any)=>{
    const department = await req.json();
    const id = req.url!.split("university/")[1].split('/')[0]
    const { department_name } = department

    try {
        const { data: deptData, error: deptError } = await supabase
            .from('department')
            .insert([{ uni_id: parseInt(id), department_name }])    
            .select();
        console.log("Inserted Data:", deptData);
        console.log("Insert Error:", deptError);

        if (deptError) {
            throw deptError;
        }
        
        return NextResponse.json({status: 201 ,data: deptData, function_name: 'create_department' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'create_department' });
    }
}

export const GET = async(req:any, res:any)=>{
    const id = req.url!.split("university/")[1].split('/')[0]
    
    try {
        const { data, error } = await supabase
            .from('department')
            .select()
            .eq('uni_id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201, data: data, function_name: 'get_department' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'get_department' });
    }
}

