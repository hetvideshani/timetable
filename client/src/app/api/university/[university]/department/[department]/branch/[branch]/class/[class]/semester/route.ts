import { supabase } from '@/lib/dbConnect';
import { semesterSchema } from '@/lib/validations/semesterValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const POST = async (req: any, res: any) => {

    const validateError = await validationMiddleware(req, semesterSchema)
    if (validateError) return validateError;

    const semester = await req.json()
    const id = req.url.split('class/')[1].split('/')[0]
    const { sem_no, subject_faculty } = semester
    console.log(sem_no);
    console.log(subject_faculty);


    const semno = Number(sem_no)
    console.log(subject_faculty);
    try {
        const { data, error } = await supabase
            .from('semester')
            .insert([{ sem_no: semno, class_id: id, faculty_id: subject_faculty.faculty_id, subject_id: subject_faculty.subject_id }])
            .select()
        if (error) {
            throw error;
        }
        console.log(data);

        return NextResponse.json({ status: 201, data: data, function_name: 'create_semester' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'create_semester' });
    }
}

export const GET = async (req: any, res: any) => {

    const id = req.url!.split("class/")[1].split("/")[0]

    try {
        const { data, error } = await supabase
            .from('semester').select()
            .eq('class_id', id)
        if (error) {
            throw error;
        }
        return NextResponse.json({ status: 201, data: data, function_name: 'get_one_semester' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_one_semester' });
    }
}
