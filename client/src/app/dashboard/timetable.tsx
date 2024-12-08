export const Timetable = ({ timetable }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const session_length = timetable.timetable[0].length;
  return (
    <div className="w-full ">
      {/* header */}
      <div className="flex flex-col justify-center w-full font-bold text-xl px-2">
        <div >{timetable.department_name} - {timetable.branch_name}
        </div>
        <div>
          {timetable.class_no} / {timetable.class_no + 4}
        </div>
        <div>Sem. {timetable.semester}</div>
      </div>

      {/* timetable */}
      {/* <div className="flex justify-evenly mt-3 p-3 border-t border-[#181C14]">
        <div className="flex flex-col items-center font-bold text-xl">
          <div>Session</div>
        {
          Array.from({ length: session_length }, (_, index) => index + 1)
           .map((session, index) => (
              <div key={index} className="gap-1">
                {session}
              </div>
            ))
        }
        </div>
        {timetable.timetable.map((day, index) => (
          <div key={index}>
            <div className="text-xl text-center font-bold mb-3">{days[index]}</div>
            {day.map((session, index) => (
              <div key={index} className="flex gap-3 flex-col border">
                {session.map((subject, index) => (
                  <div key={index} className="flex flex-col gap-1 items-center">
                    <div className="font-bold">batch - {subject.batch_no}</div>
                    <div>{subject.subject_name}</div>
                    <div>({subject.fac_name})</div>
                    <div>{subject.resource_name}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div> */}

      <div className="flex justify-evenly mt-3 p-3 border-t border-[#181C14] ">

        {/* Timetable Columns */}
        {timetable.timetable.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-2 items-center">
            {/* Day Header */}
            <div className="text-xl text-center w-full font-bold mb-3 text-gray-800 underline">{days[dayIndex]}</div>
            {day.map((session, sessionIndex) => {
              // Filter unique subjects per session
              const uniqueSubjects = session.reduce((acc, curr) => {
                const existing = acc.find(
                  (item) =>
                    item.subject_name === curr.subject_name &&
                    item.fac_name === curr.fac_name &&
                    item.resource_name === curr.resource_name
                );
                if (existing) {
                  existing.batches.push(curr.batch_no);
                } else {
                  acc.push({
                    ...curr,
                    batches: [curr.batch_no],
                  });
                }
                return acc;
              }, []);

              return (
                <div key={sessionIndex} className="flex gap-2 w-full flex-col rounded-lg p-3 shadow-md">
                  {/* <div>{session}</div> */}
                  { session != "null" ? uniqueSubjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="flex flex-col items-center p-2">
                      <div className="font-bold text-sm text-gray-800">Batch - {subject.batches.join(", ")}</div>
                      <div className="text-sm italic text-gray-600">{subject.subject_name}</div>
                      <div className="text-xs text-gray-500">({subject.fac_name})</div>
                      <div className="text-xs text-gray-400">{subject.resource_name}</div>
                    </div>
                  )) : (<div className="text-center font-bold">Break</div>)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      
    </div>
  );
};
