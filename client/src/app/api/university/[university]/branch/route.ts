import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const GET = async (req: any, res: any) => {
    const id = req.url!.split("university/")[1].split('/')[0]

    try {
        const { data:department_data, error:department_error } = await supabase
            .from('department')
            .select()
            .eq('uni_id', id);

        if (department_error) {
            throw department_error;
        }
        
        const branches = []

        for (const department of department_data) {
            const { data:branch_data, error:branch_error } = await supabase
                .from('branch')
                .select()
                .eq('dept_id', department.id);

            if (branch_error) {
                throw branch_error;
            }
            
            branches.push({branch_data, dept_name: department.department_name});
        }

        return NextResponse.json({ status: 201, data: branches, function_name: 'get_department' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_department' });
        
    }
}   