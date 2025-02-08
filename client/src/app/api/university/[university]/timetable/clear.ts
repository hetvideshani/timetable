import { fillAllocator, getAllAllocator, updateAllAllocators, updateAllocator } from "@/lib/resourceAllocator";

export async function clear(uni_id: any, timetable: any) {
    console.log(timetable.timeTable[0]);
    
    const day_length = timetable.timeTable.length;
    console.log(day_length);
    
        let all_allocators = await getAllAllocator(uni_id);
    console.log(all_allocators[1]);
    let used_resources = [];
    let used_faculty = [];
    let used_types = [];
    console.log("HEllo");
    for(let day=0;day<day_length;day++){
        for (let session = 0; session < timetable.timeTable[day].length; session++){
            for (let subject = 0; subject < timetable.timeTable[day][session].length; subject++){
                if(!timetable.timeTable[day][session][subject].resource_name ){
                    continue;
                }
                let allocatorKey=uni_id+":"+timetable.timeTable[day][session][subject].resource_type;
                let allocator = all_allocators.filter((allocator: any) => allocator.key == allocatorKey)[0];
                console.log(allocator.value);

                fillAllocator(allocator, timetable.timeTable[day][session][subject].resource_name,day,session,0,0);
                
                
                
            }
        }
    } 
    

    return { status: 200, message: "Success" };
}