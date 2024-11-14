import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export const GET = async (req: any, res: any) => {
    const uniId = req.url!.split("university/")[1].split('/')[0];

    try {
        const { data: departmentData, error: departmentError } = await supabase
            .from('department')
            .select()
            .eq('uni_id', uniId);

        if (departmentError) {
            throw departmentError;
        }

        const semesters: any = [];

        for (const department of departmentData) {
            const { data: branchData, error: branchError } = await supabase
                .from('branch')
                .select()
                .eq('dept_id', department.id);

            if (branchError) {
                throw branchError;
            }

            for(const branch of branchData){
                const { data: classData, error: classError } = await supabase
                    .from('class')
                    .select()
                    .eq('branch_id', branch.id);

                if (classError) {
                    throw classError;
                }

                for (const classs of classData) {
                    const { data: semesterData, error: semesterError } = await supabase
                        .from('semester')
                        .select()
                        .eq('class_id', classs.id);
    
                    if (semesterError) {
                        throw semesterError;
                    }
    
                    semesterData.map((semester: any) => {
                        semester.branch_name = branch.branch_name;
                        semester.dept_name = department.department_name;
                    });
    
                    semesters.push(...semesterData);
                }
            }

        }

        return NextResponse.json({ status: 201, data: semesters, function_name: 'get_semesters' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_semesters' });
    }
};
