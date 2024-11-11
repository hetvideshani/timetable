import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const POST = async(req:any, res:any) => {
    const branch = await req.json()
    const { branch_name, dept_id } = branch

    try {
        const { data, error } = await supabase
            .from('branch')
            .insert([{ branch_name, dept_id }])
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'create_branch'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'create_branch' })
    }
}

export const GET = async(req:any, res:any) => {
    const id = req.url!.split("department/")[1]

    try {
        const { data, error } = await supabase
            .from('branch')
            .select()
            .eq('dept_id', id)
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 200, data: data, function_name: 'get_branches'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'get_branches' })
    }
}


