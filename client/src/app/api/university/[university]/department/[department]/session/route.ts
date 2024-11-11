import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const POST =  async (req:any, res:any)=>{
    const session = await req.json()
    const { session_sequence, do_nothing, duration, dept_id } = session

    try {
        const { data, error } = await supabase
            .from('session')
            .insert([{ session_sequence, do_nothing, duration, dept_id }]);
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 201, data:data, function_name: 'create_session'});
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status : 500, error_message: error.message, function_name: 'create_session' });
    }
}

export const GET = async (req:any, res:any)=>{
    const 
    try {
        const { data, error } = await supabase
            .from('session');
        if (error) {
            throw error;
        }
        return NextResponse.json({status : 200, data:data, function_name: 'get_sessions'});
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status : 500, error_message: error.message, function_name: 'get_sessions' });
    }
}