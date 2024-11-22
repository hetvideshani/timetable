import { fillAllocator, genAllocator } from "@/lib/resourceAllocator";
import { fillTimetable } from "@/lib/timetableHandler";
import { createTimetable } from "@/lib/timetableHandler";
import { supabase } from "@/lib/dbConnect";
import { create } from "domain";

export async function schedule(params: any) {
    console.log(params);

    const subject_faculty = params.subject_faculty;
    const selected_resource = params.resource;

    const { data: session, error: session_error } = await supabase
        .from("session")
        .select()
        .eq("dept_id", params.department.id);

    if ( session_error) {
        console.log( session_error);
        return;
    }

    // return selected_resource

    const number_of_session = session ? session.length : 0;

    const faculty = subject_faculty.map((sub_fac: any) => sub_fac.faculty_name);
    // console.log("faculty name " + faculty);

    const faculty_allocator = genAllocator(faculty, 5, number_of_session);
    // console.log("faculty allocator " + faculty_allocator);

    // return faculty_allocator

    // console.log(resource);
    const resource_type = selected_resource
        ? [...new Set(selected_resource.map((res: any) => res.resource_type))]
        : [];
    // console.log("resource type - " + resource_type);

    let res_all: any = [];

    resource_type.forEach((res_type: any) => {
        const resource_name = selected_resource
            ? selected_resource.filter((res: any) => res.resource_type === res_type)
            : [];
        // console.log(resource_name);

        const all_resource_name = resource_name.map(
            (res: any) => res.resource_name
        );
        // console.log(all_resource_name);

        const resource_allocator = genAllocator(
            all_resource_name,
            5,
            number_of_session
        );
        // console.log(resource_allocator);
        res_all.push({ resource_allocator, res_type });
    });
    // console.log("res all - " + res_all);

    // return res_all
    const timeTable = createTimetable(5, number_of_session, [2]);

    // allocator
    let day_index = 0;
    let session_index = 0;
    let faculty_allocator_index = 0;
    let resource_type_index = 0;
    let res_name = res_all[0].resource_allocator[0].name;
    // console.log(res_name);
    let i = 0;

    let faculty_index = 0;
    let resource_index = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < number_of_session; j++) {

            if (timeTable[i][j][0] == "null") {
                continue;
            }

            console.log("day", i, "session", j);

            // check for previous session
            // if (timeTable) {
            //     // all 

            // }

            if (resource_index == resource_type.length) {
                resource_index = 0;
            }

            faculty_index = select_faculty(subject_faculty, faculty_allocator, resource_type[resource_index], i, j);

            console.log(faculty_index);

            if (faculty_index != -1) {
                resource_index = res_all.findIndex((res: any) => res.res_type == resource_type[resource_index]);

                let second_resource_index = select_resource(res_all, resource_index, i, j);

                if (second_resource_index != -1) {

                    fillTimetable(timeTable, i, j, subject_faculty[faculty_index].faculty_name, subject_faculty[faculty_index].subject_name, 1, res_all[resource_index].resource_allocator[second_resource_index].name, resource_type[resource_index] as string);
                    
                    faculty_allocator[faculty_index].sessions[i][j] = 1;
                    fillAllocator(res_all[resource_index].resource_allocator, res_all[resource_index].resource_allocator[second_resource_index].name, i, j, 40, 20);
                    // res_all[resource_index].resource_allocator[second_resource_index].sessions[i][j] = 1;
                    subject_faculty[faculty_index].resource_required[resource_index].resource_count--;

                    resource_index++;
                    // console.log(second_resource_index);
                }

                // console.log(second_resource_index);
            }
        }
    }

    return timeTable;

    // sachhuuuuuuuuuuuuuuuu
    // while (true) {
    //     if (resource_count_check(subject_faculty)) {
    //         break;
    //     }

    //     // day repeat and session cycle
    //     if (session_index == number_of_session) {
    //         day_index++;
    //         session_index = 0;
    //     }

    //     const resource_count = resource_check(
    //         res_all,
    //         session_index,
    //         day_index,
    //         resource_type[resource_type_index],
    //         res_name
    //     );

    //     console.log("resource_count", resource_count);
    //     break;

    //     if (same_fac_check() && resource_count < 1) {
    //         // assign
    //         // session update
    //         // faculty update
    //         // resource update
    //     }
    //     // else if (faculty_check() && resource_count < 1) {
    //     //     // assign
    //     //     // session update
    //     //     // faculty update
    //     //     // resource update
    //     // }
    //     // else {
    //     //     // fac vandho
    //     //     if () {
    //     //     // index_fac_plus
    //     //     }
    //     //     // res vandho
    //     //     if () {
    //     //     // check all types if no empty then check another resources ok
    //     //     }
    //     // }
    // }
}
// faculty check

const select_faculty = (subject_faculty: any, faculty_allocator: any, res_type: any, day: any, session: any) => {
    let faculty = subject_faculty.filter((sub_fac: any) => sub_fac.resource_required.filter((res: any) => res.resource_type == res_type && res.resource_count > 0));

    let available_faculty = faculty_allocator.filter((fac: any) => faculty.filter((facc: any) => facc.faculty_name == fac.name) && fac.sessions[day][session] < 1)

    if (available_faculty.length == 0) {
        return -1
    }

    let random_index = Math.floor(Math.random() * available_faculty.length);

    let return_index = subject_faculty.findIndex((fac: any) => fac.faculty_name == available_faculty[random_index].name)

    return return_index;
};

const select_resource = (res_all: any, resource_index: any, day: any, session: any) => {
    let res = res_all[resource_index].resource_allocator.filter((res: any) => res.sessions[day][session] < 1);
    let random_index = Math.floor(Math.random() * res.length);
    let res_name = res[random_index].name;
    let index = res_all[resource_index].resource_allocator.findIndex((res: any) => res.name == res_name);

    return index;
}

const faculty_check = (faculty: any, row: any, col: any, faculty_index: any) => {

    if (faculty[faculty_index].sessions[row][col] == 0) {
        return true;
    }

    return false;
};

const resource_count_check = (subject_faculty: any): boolean => {
    console.log(subject_faculty);
    for (let i = 0; i < subject_faculty.length; i++) {
        let sub_fac = subject_faculty[i];
        for (let j = 0; j < sub_fac.resource_required.length; j++) {
            if (sub_fac.resource_required[j].resource_count > 0) {
                return false;
            }
        }
    }
    return true;
};

// resource check
function resource_check(
    res_all: any,
    session_index: number,
    day_index: number,
    res_type: string,
    res_name: string
): number {
    // console.log(res_type);
    let result = 0;

    let sameType = res_all.filter((res: any) => res.res_type == res_type);
    sameType = sameType.map((res: any) => res.resource_allocator);
    //   console.log(sameType);

    for (let i = 0; i < sameType.length; i++) {
        let res = sameType[i];
        for (let j = 0; j < res.length; j++) {
            if (res[j].name == res_name) {
                result = res[j].sessions[day_index][session_index];
                return result;
            }
        }
    }

    return result;
}

// same faculty check
function same_fac_check(
    facultyName: string,
    acc_row: number,
    acc_col: number,
    timeTable: any,
    res_name: string
): boolean {
    return true;
}

// assign

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
