// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import CustomDropdown from "./dropdown";
import { Modal, ModalTrigger } from "../components/ui/animated-modal";
import { log } from "console";
import { IoClose } from "react-icons/io5";

const Page = () => {
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
    resource: [
      {
        capacity: 0,
        resource_type: "",
        resource_name: ""
      }
    ],
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
  const [showModal, setShowModal] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
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
      subject_faculty: [
        {
          subject_id: 0,
          subject_name: "",
          faculty_id: 0,
          faculty_name: "",
        },
      ],
    },
  ]);
  const [subject_faculty, setSubject_Faculty] = useState([
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
  ]);
  const [uni_id, setUni_id] = useState("");
  const [allResource, setAllResource] = useState([
    {
      id: 0,
      capacity : 0,
      resource_name: "",
      resource_type: "",
    },
  ]);

  const handleResourceChange = (
    field: string,
    value: string
  ) => {
    const cap = allResource.find((res) => res.resource_name === value)
    setData((prev) => {
      if (
        cap &&
        !prev.resource.some(
          (res) => res.resource_name === value && res.resource_type === field
        )
      ) {
        return {
          ...prev,
          resource: [
            ...prev.resource,
            { resource_name: value, resource_type: field, capacity: cap.capacity || 0 },
          ],
        };
      }
      return prev; 
    });
  };
  
  const removeResource = (resourceName: string) => {
    setData((prev) => ({
      ...prev,
      resource: prev.resource.filter((res) => res.resource_name !== resourceName),
    }));
  };
  
  const resourceOptions = [
    ...new Set(allResource.map((res) => res.resource_type)),
  ];
  
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
    setData((prev) => ({
      ...prev,
      resource: prev.resource.filter(
        (res) => res.resource_name && res.resource_type
      ),
    }));
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
    await getAllResources(customData);
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
      setSemester(data.data);
    } else {
      console.log("No data");
      setSemester([]);
    }
  };

  const getAllResources = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/resource`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setAllResource(data.data);
    } else {
      setAllResource([]);
    }
    
  };

  const sendData = async () => {
    const response = await fetch("http://localhost:3000/api/timetable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
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
                className="bg-blue-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal(false);
                  setShowModal2(true);

                  semester
                    .filter((sem) => {
                      return sem.id === data.semester.id;
                    })[0]
                    .subject_faculty.map((sub_fac, index) => {
                      if (index == 0) {
                        setSubject_Faculty((prev) => [
                          {
                            id: sub_fac.subject_id,
                            subject_name: sub_fac.subject_name,
                            faculty_id: sub_fac.faculty_id,
                            faculty_name: sub_fac.faculty_name,
                            resource_required: [
                              {
                                resource_type: "",
                                resource_count: 0,
                              },
                            ],
                            uni_id: Number(uni_id),
                          },
                        ]);
                      } else {
                        setSubject_Faculty((prev) => [
                          ...prev,
                          {
                            id: sub_fac.subject_id,
                            subject_name: sub_fac.subject_name,
                            faculty_id: sub_fac.faculty_id,
                            faculty_name: sub_fac.faculty_name,
                            resource_required: [
                              {
                                resource_type: "",
                                resource_count: 0,
                              },
                            ],
                            uni_id: Number(uni_id),
                          },
                        ]);
                      }
                    });
                }}
              >
                next
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

      {showModal2 && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-[50vw] p-5 rounded-md">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold">Create TimeTable</h1>
              <p className="text-gray-400 text-sm">
                Add details required for generating the timetable!
              </p>
            </div>

            {/* subject and faculty wise resource */}
            <div className="">
              {subject_faculty.map((sub_fac, subindex) => {
                return (
                  <div key={subindex}>
                    <div className="flex tex-xl gap-4 font-bold">
                      <div className="  ">{sub_fac.subject_name}</div>
                      <div className="  ">{sub_fac.faculty_name}</div>
                    </div>
                    <div className="flex gap-2 justify-between ">
                      {resourceOptions.map((res, index) => {
                        return (
                          <div className=" w-[30%]" key={index}>
                            <label htmlFor="">{res}</label>
                            <input
                              type="text"
                              className="border-2 border-gray-300 p-2 rounded-md"
                              placeholder="Enter count"
                              onChange={(e) => {
                                const newSubject = [...subject_faculty];
                                newSubject[subindex].resource_required[index] =
                                  {
                                    resource_type: res,
                                    resource_count: parseInt(e.target.value),
                                  };
                                setSubject_Faculty(newSubject);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between m-5">
              <button
                className="bg-red-600 p-2 rounded-md"
                onClick={() => setShowModal2(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal2(false);
                  setShowModal(true);
                }}
              >
                prev
              </button>
              <button
                className="bg-blue-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal2(false);
                  setShowModal3(true);
                }}
              >
                next
              </button>
              <button
                className="bg-green-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal(false);
                  setData({
                    ...data,
                    subject: subject_faculty,
                  });
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {
        showModal3 && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-fit p-5 rounded-md">
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold">Create TimeTable</h1>
                <p className="text-gray-400 text-sm">
                  Add details required for generating the timetable!
                </p>
                <div className="flex gap-3">
                {
                  resourceOptions.map((value, index) => (
                    <div>
                      <div>{value}</div>
                      <select key={index} 
                      onChange={(e) => handleResourceChange(value, e.target.value )}
                      className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500">
                      <option value="">Select Resource</option>
                      {
                        allResource.filter((r) => r.resource_type === value).map((r, i) => (
                          <option key={i} value={r.resource_name}>
                            {r.resource_name}
                          </option>
                        ))
                      }
                      </select>
                    </div>
                  ))
                }
                </div>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Selected Resources:</h2>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {data.resource.map((res, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 border border-gray-300 rounded-md p-2 flex items-center gap-2"
                        >
                          <span>{res.resource_name}</span>
                          <button
                            onClick={() => removeResource(res.resource_name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IoClose size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
              <div className="flex justify-between m-5">
              <button
                className="bg-red-600 p-2 rounded-md"
                onClick={() => setShowModal3(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal2(true);
                  setShowModal3(false);
                }}
              >
                prev
              </button>
              <button
                className="bg-green-600 p-2 rounded-md"
                onClick={() => {
                  setShowModal3(false);
                  sendData();
                }}
              >
                Save
              </button>
            </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Page;
