import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const PUT = async (req, res: any) => {
    const resource = await req.json();
    const { resource_name, resource_type, capacity, duration } = resource
    const id = req.url!.split("resource/")[1]
    
    try {
        const { data, error } = await supabase
           .from('resource')
           .update({ resource_name, resource_type, capacity, duration })
           .eq('id', id);
            
        if (error) {
            throw error
        }
            
        return NextResponse.json({status:201, data: data, function_name: 'update_resource' });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'update_resource' });
    }
}

export const DELETE = async (req, res: any) => {
    const id = req.url!.split("resource/")[1]
    
    try {
        const { data, error } = await supabase
           .from('resource')
           .delete()
           .eq('id', id);
            
        if (error) {
            throw error
        }
            
        return NextResponse.json({status:201, data: data, function_name: 'delete_resource' });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'delete_resource' });
    }
}