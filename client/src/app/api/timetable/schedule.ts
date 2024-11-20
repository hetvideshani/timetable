import { genAllocator } from "@/lib/resourceAllocator";
import { fillTimetable } from "@/lib/timetableHandler";
import { createTimetable } from "@/lib/timetableHandler";
import { supabase } from "@/lib/dbConnect";
import { create } from "domain";

export async function schedule(params: any) {
    console.log(params);

    const subject_faculty = params.subject_faculty
    const { data: resource, error: resource_error } = await supabase.from('resource').select().eq('uni_id', params.uni_id)
    const { data: session, error: session_error } = await supabase.from('session').select().eq('dept_id', params.department.id)

    if (resource_error || session_error) {
        console.log(resource_error, session_error);
        return
    }

    const number_of_session = session ? session.length : 0;

    const faculty = subject_faculty.map((sub_fac: any) =>
        sub_fac.faculty_name
    )
    // console.log(faculty);

    const faculty_allocator = genAllocator(faculty, 5, number_of_session)
    console.log(faculty_allocator);

    // console.log(resource);  
    const resource_type = resource ? [...new Set(resource.map((res: any) => res.resource_type))] : []
    // console.log(resource_type);

    let res_all: any = []

    resource_type.forEach((res_type: any) => {
        const resource_name = resource ? resource.filter((res: any) => res.resource_type === res_type) : []
        console.log(resource_name);

        const all_resource_name = resource_name.map((res: any) => res.resource_name)
        console.log(all_resource_name);

        const resource_allocator = genAllocator(all_resource_name, 5, number_of_session)
        // console.log(resource_allocator);
        res_all.push({ resource_allocator, res_type });
    })
    console.log(res_all);

    const timeTable = createTimetable(5, number_of_session, [2])

    let day_index = 0
    let session_index = 0
    let faculty_index = 0
    let resource_index = 0
    let i = 0

    // while (true) {
    //     if (day_index === 6) {
    //         break
    //     }
    //     if (session_index >= number_of_session) {
    //         session_index = 0
    //         day_index++
    //     }
    //     if (faculty_index >= faculty_allocator.length) {
    //         faculty_index = 0
    //     }
    //     if (resource_index >= res_all.length) {
    //         resource_index = 0
    //         faculty_index++
    //     }

    //     const faculty_name = faculty_allocator[faculty_index].name
    //     console.log(faculty_name);
    //     const resource_name = res_all[resource_index].name
    //     console.log(resource_name);
    //     const resource_type = res_all[resource_index].res_type
    //     console.log(resource_type);



    //     session_index++;
    //     console.log(i);
    //     i++;
    // }

    while() {
        
    }




    console.log(timeTable);

    // subject_faculty.forEach((sub_fac: any) => {
    //     const faculty_name = sub_fac.faculty_name
    //     const subject_name = sub_fac.subject_name
    //     const batch_no = sub_fac.batch_no
    //     const resource_name = sub_fac.resource_name
    //     const resource_type = sub_fac.resource_type

    //     faculty_allocator.forEach((fac_alloc: any) => {

    //         if (fac_alloc.name === faculty_name) {
    //             fac_alloc.sessions.forEach((session: any, fac_alloc_index : number) => {
    //                 if (session[session_index] == 0) {
    //                     fac_alloc[fac_alloc_index][session_index] = 1
    //                     fillTimetable(timeTable, day_index, session_index, faculty_name, subject_name, batch_no, resource_name, resource_type)
    //                 }
    //             })
    //         }
    //     })
    // })

    return res_all
}





// faculty check

const faculty_check = (faculty:any,row:any,col:any) => {
    
}



// resource check
// 
// 




// const [data, setData] = useState({
//     department: {
//         id: 0,
//         department_name: "",
//     },
//     branch: {
//         id: 0,
//         branch_name: "",
//         dept_id: 0,
//     },
//     classes: {
//         id: 0,
//         class_no: 0,
//         branch_id: 0,
//         branch_name: "",
//         dept_name: "",
//     },
//     semester: {
//         id: 0,
//         sem_no: "",
//         class_id: 0,
//     },
//     subject: [
//         {
//             id: 0,
//             subject_name: "",
//             faculty_id: 0,
//             faculty_name: "",
//             resource_required: [
//                 {
//                     resource_type: "",
//                     resource_count: 0,
//                 },
//             ],
//             uni_id: 0,
//         },
//     ],
// });





