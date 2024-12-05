import * as Yup from 'yup';

export const semesterSchema = Yup.object().shape({
    semester_no: Yup.number().required('Semester number is required'),
    subject_faculty: Yup.object().shape({
        faculty_id: Yup.number().required('Faculty id is required'),
        subject_id: Yup.number().required('Subject id is required'),
    }),
});