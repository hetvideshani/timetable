export function genAllocator(
  resource: string[],
  numOfdays: number,
  numOfSessions: number
): any[] {
  let allocator: any[] = [];
  resource.forEach((res) => {
    let sessions = [];
    for (let i = 0; i < numOfdays; i++) {
      sessions.push(Array(numOfSessions).fill(0));
    }
    allocator.push({ name: res, sessions: sessions });
  });
  return allocator;
}


export function fillAllocator(
  allocator: any[],
  name: string,
  day: number,
  session: number,
  capacity: number,
  addStudents: number
) {
  for (let i = 0; i < allocator.length; i++) {
    if (allocator[i].name == name) {
      allocator[i].sessions[day][session] += addStudents / capacity;

      if (allocator[i].sessions[day][session] > 1) {
        console.error("Capacity full! cannot add students");
        allocator[i].sessions[day][session] = 1;
        throw new Error("Capacity full! cannot add students");
      }
      break;
    }
  }
}
