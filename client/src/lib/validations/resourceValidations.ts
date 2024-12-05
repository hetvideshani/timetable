import * as Yup from 'yup';

export const resourceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
    capacity: Yup.string().required('Capacity is required'),
    duration: Yup.string().required('duration is required'),
});