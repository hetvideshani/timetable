import { supabase } from '@/lib/dbConnect';
import { facultySchema } from '@/lib/validations/facultyValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const PUT = async(req:Request,res:Response)=>{

    const validateError = await validationMiddleware(req, facultySchema);
    if (validateError) return validateError;

    const faculty = await req.json();
    const id = req.url!.split("faculty/")[1]
    const { faculty_name } = faculty

    try {
        const { data, error } = await supabase
            .from('faculty')
            .update({ faculty_name })
            .eq('id', id)
            .select();
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'update_faculty' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'update_faculty' });
    }
}

export const DELETE = async(req:Request,res:Response)=>{
    const id = req.url!.split("faculty/")[1]

    try {
        const { data, error } = await supabase
            .from('faculty')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'delete_faculty' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'delete_faculty' });
    }
}

export const GET = async(req:Request,res:Response)=>{
    const id = req.url!.split("faculty/")[1]

    try {
        const { data, error } = await supabase
            .from('faculty')
            .select()
            .eq('id', id)
        if (error) {
            throw error
        }
        return NextResponse.json({status: 201, data: data, function_name: 'get_faculty'})
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'get_faculty'})
    }
}