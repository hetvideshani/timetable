import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(req:any, res:any){
    const semester = await req.json()
    const { sem_no, class_id, subject_id, faculty_id } = semester

    try {
        const { data, error } = await supabase
            .from('semester')
            .insert([{ sem_no, class_id, subject_id, faculty_id }]);
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data : data , function_name: 'create_semester' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status :500, error_message: error.message , function_name: 'create_semester' });
    }
}