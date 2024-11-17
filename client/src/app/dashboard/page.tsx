// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import CustomDropdown from "./dropdown";
import { Modal, ModalTrigger } from "../components/ui/animated-modal";

const page = () => {
  const [data, setData] = useState({
    department: {
      id: 0,
      department_name: "",
    },
    branch: {
      id: 0,
      branch_name: "",
      dept_id: 0,
    },
    classes: {
      id: 0,
      class_no: 0,
      branch_id: 0,
      branch_name: "",
      dept_name: "",
    },
    semester: {
      id: 0,
      sem_no: "",
      class_id: 0,
    },
    subject: [
      {
        id: 0,
        subject_name: "",
        faculty_id: 0,
        faculty_name: "",
        resource_required: [
          {
            resource_type: "",
            resource_count: 0,
          },
        ],
        uni_id: 0,
      },
    ],
  });
  const [showModal, setShowModal] = useState(false);
  const [department, setDepartment] = useState([
    {
      id: 0,
      department_name: "",
      uni_id: 0,
    },
  ]);
  const [branch, setBranch] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);
  const [classs, setClass] = useState([
    {
      id: 0,
      class_no: 0,
      branch_id: 0,
      branch_name: "",
      dept_name: "",
    },
  ]);
  const [semester, setSemester] = useState([
    {
      id: 0,
      sem_no: "",
      class_id: 0,
    },
  ]);

  const [subject, setSubject] = useState([
    {
      id: 0,
      subject_name: "",
      uni_id: 0,
    },
  ]);
  const [uni_id, setUni_id] = useState("");
  const departmentOptions = department.map((dept) => dept.department_name);
  const branchOptions = [
    ...new Set(
      branch
        .filter((bran) => {
          return bran.dept_name === data.department.department_name;
        })
        .map((bran) => bran.branch_name) // Extract branch names
    ),
  ];
  const classOptions = [
    ...new Set(
      classs
        .filter((cl) => {
          console.log(cl.branch_id, data.branch.id);

          return cl.branch_id == data.branch.id;
        })
        .map((cl) => cl.class_no)
    ),
  ];
  const semesterOptions = [
    ...new Set(
      semester
        .filter((sem) => {
          return sem.class_id === data.classes.id;
        })
        .map((sem) => sem.sem_no)
    ),
  ];

  // Fetch university ID on load
  useEffect(() => {
    get_uni_id();
  }, []);

  // get university ID from the URL
  const get_uni_id = async () => {
    let customData;
    await fetch(window.location.href)
      .then((res) => {
        customData = res.headers.get("uni_id");
        if (customData) {
          setUni_id(customData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));

    await getAllDepartments(customData);
    await getAllBranch(customData);
    await getAllClasses(customData);
    await getAllSemester(customData);
    await getAllSubjects(customData);
  };

  // Fetch all departments
  const getAllDepartments = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setDepartment(data.data);
    } else {
      setDepartment([]);
    }
  };

  // Fetch all branches
  const getAllBranch = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/branch`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setBranch(data.data);
    } else {
      console.log("No data");
      setBranch([]);
    }
  };

  // fetch all classes
  const getAllClasses = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/class`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setClass(data.data);
    } else {
      console.log("No data");
      setClass([]);
    }
  };

  const getAllSemester = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/semester`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setSemester(data.data);
    } else {
      console.log("No data");
      setSemester([]);
    }
  };

  const getAllSubjects = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/subject`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setSubject(data.data);
    } else {
      console.log("No data");
      setSubject([]);
    }
  };
  return (
    <div className="text-black flex justify-center">
      <div className="pt-10 flex " onClick={() => setShowModal(true)}>
        <button className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-[#BBE1FA] font-medium text-[#1B262C] shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-[#0F4C75] before:duration-100 before:ease-linear hover:bg-[#1B262C] hover:text-[#BBE1FA] rounded-lg">
          <span className="relative z-10">Create Time Table</span>
        </button>
        {/* <Modal>
          <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
            <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
              Create Time Table
            </span>
            <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
              📅
            </div>
          </ModalTrigger>
        </Modal> */}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-[50vw] p-5 rounded-md">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold">Create TimeTable</h1>
              <p className="text-gray-400 text-sm">
                Add details required for generating the timetable!
              </p>
            </div>

            <div className="m-5">
              <div className="flex">
                <div className="m-2 flex-[0.9]">
                  <CustomDropdown
                    label="Department"
                    options={departmentOptions}
                    value={data.department.department_name}
                    disabled={false}
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        department: {
                          id:
                            value === ""
                              ? 0
                              : department.filter(
                                  (dept) => dept.department_name === value
                                )[0].id,
                          department_name: value,
                        },
                      })
                    }
                  />
                </div>
                <div className="m-2 flex-1">
                  <CustomDropdown
                    label="Branch"
                    options={branchOptions}
                    disabled={
                      data.department.department_name === "" ||
                      data.department.department_name === "Select department"
                    }
                    value={data.branch.branch_name}
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        branch: {
                          id:
                            value === ""
                              ? 0
                              : branch.filter(
                                  (bran) =>
                                    bran.branch_name === value &&
                                    bran.dept_name ===
                                      data.department.department_name
                                )[0].id,
                          branch_name: value,
                          dept_id:
                            value === ""
                              ? 0
                              : branch.filter(
                                  (bran) => bran.branch_name === value
                                )[0].dept_id,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex">
                <div className="m-2 flex-[0.9]">
                  <CustomDropdown
                    label="Class"
                    options={classOptions}
                    value={data.classes.class_no}
                    disabled={
                      data.branch.branch_name === "" ||
                      data.branch.branch_name === "Select branch"
                    }
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        classes: {
                          id:
                            value === ""
                              ? 0
                              : classs.filter((cl) => cl.class_no == value)[0]
                                  .id,
                          class_no: value,
                          branch_id:
                            value === ""
                              ? 0
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .branch_id,
                          branch_name:
                            value === ""
                              ? ""
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .branch_name,
                          dept_name:
                            value === ""
                              ? ""
                              : classs.filter((cl) => cl.class_no === value)[0]
                                  .dept_name,
                        },
                      })
                    }
                  />
                </div>
                <div className="m-2 flex-1">
                  <CustomDropdown
                    label="Semester"
                    options={semesterOptions}
                    disabled={data.classes.class_no === 0}
                    value={data.semester.sem_no}
                    onChange={(value: any) =>
                      setData({
                        ...data,
                        semester: {
                          id:
                            value === ""
                              ? 0
                              : semester.filter(
                                  (sem) => sem.sem_no === value
                                )[0].id,
                          sem_no: value,
                          class_id:
                            value === ""
                              ? 0
                              : semester.filter(
                                  (sem) => sem.sem_no === value
                                )[0].class_id,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between m-5">
              <button
                className="bg-red-600 p-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-green-600 p-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
