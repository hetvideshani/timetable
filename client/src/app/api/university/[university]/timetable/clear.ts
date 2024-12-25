import { getAllAllocator, updateAllAllocators, updateAllocator } from "@/lib/resourceAllocator";

export async function clear(uni_id: any, timetable: any) {
    const day_length = timetable.timetable.length;
        let all_allocators = await getAllAllocator(uni_id);
    
    for(let day=0;day<day_length;day++){
        for (let session = 0; session < timetable.timetable[day].length; session++){
            for (let subject = 0; subject < timetable.timetable[day][session].length; subject++){
                updateAllocator
            }
        }
    }
}