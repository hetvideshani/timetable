import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const PUT = async(req:any, res:any)=>{
    const department = await req.json();
    const id = req.url!.split("department/")[1]
    const { department_name } = department

    try {
        const { data, error } = await supabase
            .from('department')
            .update({ department_name })
            .eq('id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'update_department' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'update_department' });
    }
}

export const DELETE = async(req:any, res:any)=>{
    const id = req.url!.split("department/")[1]

    try {
        const { data, error } = await supabase
            .from('department')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'delete_department' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'delete_department' });
    }
}
