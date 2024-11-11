import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';


export const PUT = async(req:any, res:any) => {
    const session = await req.json();
    const id = req.url!.split("session/")[1]
    const { session_sequence, do_nothing, duration } = session

    try {
        const { data, error } = await supabase
            .from('session')
            .update({ session_sequence, do_nothing, duration })
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

export const DELETE = async(req:any, res:any) => {
    const id = req.url!.split("session/")[1]

    try {
        const { data, error } = await supabase
            .from('session')
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

export const GET = async(req:any, res:any) => {
    const id = req.url!.split("session/")[1]

    try {
        const { data, error } = await supabase
            .from('session')
            .select()
            .eq('id', id)
        if (error) {
            throw error
        }
        return NextResponse.json({status: 201, data: data, function_name: 'get_session'})
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'get_session'})
    }
}