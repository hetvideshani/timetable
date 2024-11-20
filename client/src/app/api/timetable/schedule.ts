import { genAllocator } from "@/lib/resourceAllocator";
import { fillTimetable } from "@/lib/timetableHandler";
import { createTimetable } from "@/lib/timetableHandler";
import { supabase } from "@/lib/dbConnect";
import { create } from "domain";

export async function schedule(params: any) {
  //   console.log(params);

  const subject_faculty = params.subject_faculty;
  const { data: resource, error: resource_error } = await supabase
    .from("resource")
    .select()
    .eq("uni_id", params.uni_id);
  const { data: session, error: session_error } = await supabase
    .from("session")
    .select()
    .eq("dept_id", params.department.id);

  if (resource_error || session_error) {
    console.log(resource_error, session_error);
    return;
  }

  const number_of_session = session ? session.length : 0;

  const faculty = subject_faculty.map((sub_fac: any) => sub_fac.faculty_name);
  // console.log(faculty);

  const faculty_allocator = genAllocator(faculty, 5, number_of_session);
  //   console.log(faculty_allocator);

  // console.log(resource);
  const resource_type = resource
    ? [...new Set(resource.map((res: any) => res.resource_type))]
    : [];
  // console.log(resource_type);

  let res_all: any = [];

  resource_type.forEach((res_type: any) => {
    const resource_name = resource
      ? resource.filter((res: any) => res.resource_type === res_type)
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
  //   console.log(res_all);

  //   const timeTable = createTimetable(5, number_of_session, [2]);

  // allocator
  let day_index = 0;
  let session_index = 0;
  let faculty_allocator_index = 0;
  let resource_type_index = 0;
  let res_name = res_all[0].resource_allocator[0].name;
  console.log(res_name);
  let i = 0;

  let faculty_index = 0;
  let resource_index = 0;

  // sachhuuuuuuuuuuuuuuuu
  while (true) {
    if (resource_count_check(subject_faculty)) {
      break;
    }

    // day repeat and session cycle
    if (session_index == number_of_session) {
      day_index++;
      session_index = 0;
    }

    const resource_count = resource_check(
      res_all,
      session_index,
      day_index,
      resource_type[resource_type_index],
      res_name
    );
    
    console.log("resource_count", resource_count);
    break;

    if (same_fac_check() && resource_count < 1){
        // assign
        // session update
        // faculty update
        // resource update
    }
    // else if (faculty_check() && resource_count < 1) {
    //     // assign
    //     // session update
    //     // faculty update
    //     // resource update
    // }
    // else {
    //     // fac vandho
    //     if () {
    //     // index_fac_plus
    //     }
    //     // res vandho
    //     if () {
    //     // check all types if no empty then check another resources ok
    //     }
    // }
  }
}
// faculty check

const faculty_check = (faculty: any, row: any, col: any) => {};

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
  console.log(res_type);
  let result = 2;

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
