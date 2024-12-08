export const Timetable = ({ timetable }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const session_length = timetable.timetable[0][0].length;
  return (
    <div className="w-full">
      {/* header */}
      <div className="flex flex-col text-xl gap-1">
        <div className="flex gap-2">
          <div>{timetable.department_name}</div>
          <div>{timetable.branch_name}</div>
        </div>
        <div>
          {timetable.class_no}-{timetable.class_no + 4}
        </div>
        <div>sem : {timetable.semester}</div>
      </div>

      {/* timetable */}
      <div className="flex justify-evenly ">
        {timetable.timetable.map((day, index) => (
          <div key={index}>
            <div className="text-xl">{days[index]}</div>
            {day.map((session, index) => (
              <div key={index} className="flex gap-3 flex-col ">
                {session.map((subject, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div>{subject.subject_name}</div>
                    <div>{subject.faculty_name}</div>
                    <div>{subject.resource_name}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
