import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const POST = async(req:any, res:any)=>{
    const faculty = await req.json()
    const id = req.url!.split("api/")[1].split('/')[0]
    const { faculty_name } = faculty

    try {
        const { data, error } = await supabase
            .from('faculty')
            .insert([{ faculty_name, uni_id : id }]);
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data: data , function_name: 'create_faculty' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status : 500, error_message: error.message , function_name: 'create_faculty' });
    }
}

export const GET = async(req:Request, res:Response)=>{
    const id = req.url!.split("api/")[1].split('/')[0]
    try {
        const { data, error } = await supabase
            .from('faculty')
            .select()
            .eq('uni_id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data: data , function_name: 'get_faculty' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status : 500, error_message: error.message , function_name: 'get_faculty' });
    }
}