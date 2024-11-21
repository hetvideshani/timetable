import redis from "./redis";

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

export async function generateAllocators(
  uniId: number,
  numOfDays: number,
  numOfSessions: number,
  facuilty?: boolean
) {
  try {
    await redis.connect();
    const response = await fetch(
      `http://localhost:3000/api/university/${uniId}/resource`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch resources: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const resources = data.data;

    // console.log(resources);

    for (const resource of resources) {
      try {
        const key = await addResourceTypeToRedis(uniId, resource.resource_type);

        const exists = await redis.lLen(key);
        if (exists > 0) {
          console.log(
            `Resource ${resource.resource_name} already exists. Skipping...`
          );
          continue;
        }
        let allocator = genAllocator(
          [resource.resource_name],
          numOfDays,
          numOfSessions
        );
        const res = { [resource.resource_name]: allocator };

        await redis.rPush(key, JSON.stringify(res));

        if (facuilty) {
          const fac_res = await fetch("http://localhost:3000/api/faculty", {
            method: "GET",
          });
          if (!fac_res.ok) {
            throw new Error(
              `Failed to fetch faculty: ${fac_res.status} ${fac_res.statusText}`
            );
          }
          const fac_data = await fac_res.json();
          const faculties = fac_data.data;
          const fac_key = await addResourceTypeToRedis(
            uniId,
            "Faculty"
          );
          for (const faculty of faculties) {
            const fac_exists = await redis.lLen(fac_key);
            if (fac_exists > 0) {
              console.log(
                `Resource ${faculty.fac_name} already exists. Skipping...`
              );
              continue;
            }
            let fac_allocator = genAllocator(
              [faculty.fac_name],
              numOfDays,
              numOfSessions
            );
            const fac_res = { [faculty.fac_name]: fac_allocator };
            await redis.rPush(fac_key, JSON.stringify(fac_res));
          }               
        }
        // console.log(allocator);
      } catch (innerError) {
        console.error(
          `Error processing resource ${resource.resource_name}:`,
          innerError
        );
      }
    }
  } catch (error) {
    console.error("Error fetching resources:", error);
  } finally {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  }
}

export async function getAllocator(
  uniId: number,
  resourceType: string,
  resourceName?: string
): Promise<any> {
  console.log("reached");
  try {
    await redis.connect();
    const key = `${uniId}:${resourceType}`;
    const exists = await redis.exists(key);
    if (!exists) {
      throw new Error(`Resource type ${resourceType} not found`);
    }
    const allocators = await redis.lRange(key, 0, -1);
    if (resourceName) {
      for (const allocator of allocators) {
        const data = JSON.parse(allocator);
        if (data[resourceName]) {
          return data[resourceName];
        }
      }
      throw new Error(`Resource ${resourceName} not found`);
    } else {
      let res = [];
      for (const allocator of allocators) {
        res.push(JSON.parse(allocator));
      }
      return res;
    }
  } catch (error) {
    console.error("Error fetching allocator:", error);
  } finally {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  }
}

export async function updateAllocator(
  uniId: number,
  resourceType: string,
  resourceName: string,
  session?: number,
  day?: number,
  capacity?: number,
  addStudents?: number
) {
  try {
    await redis.connect();
    const key = `${uniId}:${resourceType}`;
    const exists = await redis.exists(key);
    if (!exists) {
      throw new Error(`Resource type ${resourceType} not found`);
    }
    const allocators = await redis.lRange(key, 0, -1);
    for (let i = 0; i < allocators.length; i++) {
      const data = JSON.parse(allocators[i]);
      if (data[resourceName]) {
        if (day==undefined || session==undefined || capacity==undefined || addStudents == undefined) {
          throw new Error("Missing required fields");
        }
        if (resourceName == "Faculty") {
          allocators[i] = JSON.stringify({ [resourceName]: 1 });
        } else {
          fillAllocator(data[resourceName], resourceName, day!, session!, capacity!, addStudents!);
          allocators[i] = JSON.stringify(data);
          console.log(data[resourceName][0]);
        }
        await redis.lSet(key, i, allocators[i]);
        break;
      }
    }
  } catch (error) {
    console.error("Error updating allocator:", error);
  } finally {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  }
  
}

async function addResourceTypeToRedis(
  uniID: number,
  resourceType: string
): Promise<string> {
  const key = `${uniID}:${resourceType}`;
  const exists = await redis.exists(key);
  if (!exists) {
    await redis.rPush(key, JSON.stringify([]));
  }
  return key;
}
