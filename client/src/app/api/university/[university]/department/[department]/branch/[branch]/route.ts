import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const PUT = async(req:any, res:any) => {
    const branch = await req.json()
    const { branch_id, branch_name, dept_id } = branch

    try {
        const { data, error } = await supabase
            .from('branch')
            .update({ branch_name, dept_id })
            .where('branch_id', '=', branch_id)
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'update_branch'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'update_branch' })
    }
}

export const DELETE = async(req:any, res:any) => {
    const branch_id = parseInt(req.query.branch_id)

    try {
        const { data, error } = await supabase
            .from('branch')
            .delete()
            .where('branch_id', '=', branch_id)
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'delete_branch'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'delete_branch' })
    }
}

export const GET = async(req:any, res:any) => {
    const id = req.url!.split("branch/")[1]

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