"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const SemesterPage = () => {
  const [uni_id, setUni_id] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allSemesters, setAllSemesters] = useState([
    {
      id: 0,
      sem_no: "",
      branch_id: 0,
      branch_name: "",
      class_no: 0,
      class_id: 0,
      subject_faculty: [] as {
        subject_id: number;
        subject_name: string;
        faculty_id: number;
        faculty_name: string;
      }[],
    },
  ]);

  const [semester, setSemester] = useState<{
    id: number | null;
    sem_no: string;
    class_id: number | null;
    subject_faculty: {
      subject_id: number;
      subject_name: string;
      faculty_id: number;
      faculty_name: string;
    }[];
  }>({
    id: null,
    sem_no: "",
    class_id: null,
    subject_faculty: [],
  });

  const [selectedBranch, setSelectedBranch] = useState({
    id: 0,
    branch_name: "",
    dept_id: 0,
    dept_name: "",
  });
  const [branches, setBranches] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);
  const [filteredBranches, setFilteredBranches] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);

  const [selectedClass, setSelectedClass] = useState({
    id: 0,
    class_no: "",
    branch_id: 0,
    branch_name: "",
    dept_id: 0,
    dept_name: "",
  });
  const [classes, setClasses] = useState([
    {
      id: 0,
      class_no: "",
      branch_id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);
  const [filteredClasses, setFilteredClasses] = useState([
    {
      id: 0,
      class_no: "",
      branch_id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState({
    id: 0,
    department_name: "",
    uni_id: 0,
  });
  const [departments, setDepartments] = useState([
    {
      id: 0,
      department_name: "",
      uni_id: 0,
    },
  ]);
  const [filteredDepartments, setFilteredDepartments] = useState([
    {
      id: 0,
      department_name: "",
      uni_id: 0,
    },
  ]);
  const [subjects, setSubjects] = useState([
    {
      id: 0,
      subject_name: "",
      uni_id: 0,
    },
  ]);
  const [filteredSubjects, setFilteredSubjects] = useState([
    {
      id: 0,
      subject_name: "",
      uni_id: 0,
    },
  ]);
  const [faculties, setFaculties] = useState([
    {
      id: 0,
      faculty_name: "",
      uni_id: 0,
    },
  ]);
  const [filteredFaculties, setFilteredFaculties] = useState([
    {
      id: 0,
      faculty_name: "",
      uni_id: 0,
    },
  ]);
  const [selectedSuject_Faculty, setSelectedSubject_Faculty] = useState({
    subject_id: 0,
    subject_name: "",
    faculty_id: 0,
    faculty_name: "",
  });
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const router = useRouter();
  const departmentdropdownRef = useRef<HTMLDivElement>(null);
  const branchdropdownRef = useRef<HTMLDivElement>(null);
  const classdropdownRef = useRef<HTMLDivElement>(null);
  const subjectdropdownRef = useRef<HTMLDivElement>(null);
  const facultydropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    get_uni_id();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        departmentdropdownRef.current &&
        !departmentdropdownRef.current.contains(event.target as Node)
      ) {
        setShowDepartmentDropdown(false);
      }
      if (
        branchdropdownRef.current &&
        !branchdropdownRef.current.contains(event.target as Node)
      ) {
        setShowBranchDropdown(false);
      }
      if (
        classdropdownRef.current &&
        !classdropdownRef.current.contains(event.target as Node)
      ) {
        setShowClassDropdown(false);
      }
      if (
        subjectdropdownRef.current &&
        !subjectdropdownRef.current.contains(event.target as Node)
      ) {
        setShowSubjectDropdown(false);
      }
      if (
        facultydropdownRef.current &&
        !facultydropdownRef.current.contains(event.target as Node)
      ) {
        setShowFacultyDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [departmentdropdownRef, branchdropdownRef, classdropdownRef]);

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

    await fetchSemesters(customData);
    await getBranches(customData);
    await getClasses(customData);
    await getDepartments(customData);
    await fetchSubjects(customData);
    await fetchFaculties(customData);
  };

  const getBranches = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/branch`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setBranches(data.data);
      setFilteredBranches(data.data);
    } else {
      console.log("No branches found");
    }
  };

  const getClasses = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/class`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setClasses(data.data);
      setFilteredClasses(data.data);
    } else {
      console.log("No classes found");
    }
  };

  const getDepartments = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setDepartments(data.data);
      setFilteredDepartments(data.data);
    } else {
      console.log("No departments found");
    }
  };

  const fetchSemesters = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/semester`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllSemesters(data.data);
    } else {
      console.log("No semesters found");
    }
  };

  const fetchSubjects = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/subject`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setSubjects(data.data);
      setFilteredSubjects(data.data);
    } else {
      console.log("No subjects found");
    }
  };

  const fetchFaculties = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/faculty`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setFaculties(data.data);
      setFilteredFaculties(data.data);
    } else {
      console.log("No faculties found");
    }
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (sem: any) => {
    setIsModalOpen(true);
    setSemester({
      ...semester,
      sem_no: sem.sem_no,
      id: sem.id,
      class_id: sem.class_id,
      subject_faculty: sem.subject_faculty,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log("Hello");
      console.log(semester);

      const url =
        semester.id === null || semester.id === 0
          ? `http://localhost:3000/api/university/${uni_id}/department/${selectedDepartment.id}/branch/${selectedBranch.id}/class/${selectedClass.id}/semester`
          : `http://localhost:3000/api/university/${uni_id}/department/${selectedDepartment.id}/branch/${selectedBranch.id}/class/${selectedClass.id}/semester/${semester.id}`;

      const method = semester.id === null || semester.id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(semester),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_semester") {
        setAllSemesters((prev) =>
          prev.map((sem) =>
            sem.id === semester.id
              ? {
                  ...sem,
                  sem_no: semester.sem_no,
                  class_id: selectedClass.id,
                  branch_id: selectedBranch.id,
                  subject_faculty: semester.subject_faculty,
                }
              : sem
          )
        );
      }

      if (result.function_name === "create_semester") {
        setAllSemesters((prev) => [
          ...prev,
          {
            id: result.data[0].id,
            sem_no: result.data[0].sem_no,
            branch_id: selectedBranch.id,
            branch_name: selectedBranch.branch_name,
            class_no: selectedClass.id,
            class_id: selectedClass.id,
            subject_faculty: semester.subject_faculty,
          },
        ]);
      }

      setIsModalOpen(false);
      setSemester({
        id: null,
        sem_no: "",
        class_id: null,
        subject_faculty: [],
      });
      setFilteredDepartments(departments);
      setFilteredBranches(branches);
      setFilteredClasses(classes);
      setFilteredSubjects(subjects);
      setFilteredFaculties(faculties);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handle_delete = async (sem: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${selectedDepartment.id}/branch/${selectedBranch.id}/class/${selectedClass.id}/semester/${sem.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.status === 201) {
      console.log("Data successfully deleted:", data);
      setAllSemesters(allSemesters.filter((data) => data.id !== sem.id));
      setSemester({
        id: null,
        sem_no: "",
        class_id: null,
        subject_faculty: [],
      });
      router.refresh();
    } else {
      console.error("Error deleting data:", data);
    }
  };

  const renderSemesters = allSemesters.map((data, index) => (
    <div
      key={index}
      className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
    >
      <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
        <button
          onClick={(e) => {
            handle_edit(data);
          }}
          className="flex gap-1 hover:text-green-600 border-r border-black p-2"
        >
          <FiEdit size={20} />
          <span>Edit</span>
        </button>
        <button
          onClick={(e) => {
            handle_delete(data);
          }}
          className="flex gap-1 hover:text-red-600 p-2"
        >
          <FiTrash2 size={20} />
          <span>Delete</span>
        </button>
      </div>
      <div className="right_content w-full flex flex-col gap-0 p-5 ">
        <p className=" text-2xl text-slate-950">Sem : {data.sem_no}</p>
        <p className=" text-xl text-slate-950">Branch - {data.branch_name}</p>
        <p className=" text-xl text-slate-950">
          {data.subject_faculty.map((name) => name.subject_name).join(", ")}
        </p>
      </div>
    </div>
  ));

  return (
    <>
      <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
        <div className="flex justify-between w-full">
          <div className="text-3xl font-bold text-slate-950">Semester</div>
          <button
            onClick={handle_insert}
            className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
          >
            <FaPlus /> <div>New</div>
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-black">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Semester</h1>
                </div>
                <div className="absolute right-0">
                  <button
                    className="hover:text-red-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={semester.sem_no}
                  placeholder="Enter Semester Name"
                  onChange={(e) =>
                    setSemester({ ...semester, sem_no: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <div ref={departmentdropdownRef} className="relative">
                  <input
                    type="text"
                    value={selectedDepartment.department_name}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const filtered = departments.filter((dep) =>
                        dep.department_name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      );

                      if (filtered.length === 0 || inputValue === '') {
                        setSelectedDepartment({
                          ...selectedDepartment,
                          department_name: "",
                        });
                        setFilteredDepartments(departments);
                      } else {
                        setSelectedDepartment({
                          ...selectedDepartment,
                          department_name: e.target.value,
                        });
                        setFilteredDepartments(filtered);
                      }

                      setSelectedBranch({
                        id: 0,
                        branch_name: "",
                        dept_id: 0,
                        dept_name: "",
                      });

                      setSelectedClass({
                        id: 0,
                        class_no: "",
                        branch_id: 0,
                        branch_name: "",
                        dept_id: 0,
                        dept_name: "",
                      });
                    }}
                    placeholder="Department"
                    onFocus={() => setShowDepartmentDropdown(true)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                  {showDepartmentDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredDepartments.map((dep, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedDepartment({
                              ...selectedDepartment,
                              id: dep.id,
                              department_name: dep.department_name,
                              uni_id: dep.uni_id,
                            });
                            setShowDepartmentDropdown(false);
                            setFilteredBranches(
                              branches.filter((br) => br.dept_id === dep.id)
                            );
                            setSelectedBranch({
                              id: 0,
                              branch_name: "",
                              dept_id: 0,
                              dept_name: "",
                            });

                            setSelectedClass({
                              id: 0,
                              class_no: "",
                              branch_id: 0,
                              branch_name: "",
                              dept_id: 0,
                              dept_name: "",
                            });
                          }}
                        >
                          {dep.department_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div ref={branchdropdownRef} className="relative">
                  <input
                    type="text"
                    value={selectedBranch.branch_name}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const filter = branches.filter(
                        (br) =>
                          br.branch_name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) &&
                          br.dept_id === selectedDepartment.id
                      );

                      if (filter.length === 0 || inputValue === "") {
                        setSelectedBranch({
                          ...selectedBranch,
                          branch_name: "",
                        });
                        setFilteredBranches(
                          branches.filter(
                            (br) => br.dept_id === selectedDepartment.id
                          )
                        );
                      } else {
                        setSelectedBranch({
                          ...selectedBranch,
                          branch_name: e.target.value,
                        });
                        setFilteredBranches(filter);
                      }

                      setSelectedClass({
                        id: 0,
                        class_no: "",
                        branch_id: 0,
                        branch_name: "",
                        dept_id: 0,
                        dept_name: "",
                      });
                      setFilteredClasses(classes);
                    }}
                    placeholder="Branch"
                    // disabled={selectedDepartment.id === 0}
                    onFocus={() => {
                      if (selectedDepartment.id === 0) {
                        console.log(selectedDepartment);

                        setSelectedDepartment({
                          department_name: "",
                          id: 0,
                          uni_id: 0,
                        });
                        return;
                      }
                      setShowBranchDropdown(true);
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                  {showBranchDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredBranches.map((branch, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedBranch({
                              ...selectedBranch,
                              id: branch.id,
                              branch_name: branch.branch_name,
                              dept_id: branch.dept_id,
                              dept_name: branch.dept_name,
                            });
                            setShowBranchDropdown(false);
                            setSelectedClass({
                              id: 0,
                              class_no: "",
                              branch_id: 0,
                              branch_name: "",
                              dept_id: 0,
                              dept_name: "",
                            });
                            setFilteredClasses(
                              classes.filter((cl) => cl.branch_id === branch.id)
                            );
                          }}
                        >
                          {branch.branch_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div ref={classdropdownRef} className="relative">
                  <input
                    type="text"
                    value={selectedClass.class_no}
                    onChange={(e) => {
                      console.log("HEllo");

                      console.log(filteredClasses);

                      const inputValue = e.target.value;
                      console.log("hello", inputValue);
                      const filter = classes.filter(
                        (cl) =>
                          cl.class_no
                            .toString()
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) &&
                          cl.branch_id === selectedBranch.id
                      );
                      if (filter.length === 0 || inputValue === "") {
                        setSelectedClass({
                          ...selectedClass,
                          class_no: "",
                        });
                        setFilteredClasses(
                          classes.filter(
                            (cl) => cl.branch_id === selectedBranch.id
                          )
                        );
                      } else {
                        setSelectedClass({
                          ...selectedClass,
                          class_no: e.target.value,
                        });
                        setFilteredClasses(filter);
                      }
                    }}
                    // disabled={selectedBranch.id === 0}
                    placeholder="Class"
                    onFocus={() => {
                      if (selectedBranch.id === 0) {
                        setSelectedBranch({
                          branch_name: "",
                          id: 0,
                          dept_id: 0,
                          dept_name: "",
                        });
                        return;
                      }
                      setShowClassDropdown(true);
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                  {showClassDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredClasses.map((cl, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedClass({
                              ...selectedClass,
                              id: cl.id,
                              class_no: cl.class_no,
                              branch_id: cl.branch_id,
                              branch_name: cl.branch_name,
                              dept_id: cl.dept_id,
                              dept_name: cl.dept_name,
                            });
                            setShowClassDropdown(false);
                            setSemester({
                              ...semester,
                              class_id: cl.id,
                            });
                          }}
                        >
                          {cl.class_no}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {semester.subject_faculty.map((sub_fac, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                      {sub_fac.subject_name}
                    </div>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                      {sub_fac.faculty_name}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSemester({
                          ...semester,
                          subject_faculty: semester.subject_faculty.filter(
                            (sub) => sub !== sub_fac
                          ),
                        })
                      }
                      className="text-black border border-red-600 px-4 py-2 m-1 rounded-md"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div ref={subjectdropdownRef} className="">
                    <input
                      type="text"
                      value={selectedSuject_Faculty.subject_name}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const filter = subjects.filter((sub) =>
                          sub.subject_name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        );

                        if (filter.length === 0) {
                          setSelectedSubject_Faculty({
                            ...selectedSuject_Faculty,
                            subject_name: "",
                          });
                          setFilteredSubjects(subjects);
                        } else {
                          setSelectedSubject_Faculty({
                            ...selectedSuject_Faculty,
                            subject_name: e.target.value,
                          });
                          setFilteredSubjects(filter);
                        }
                      }}
                      placeholder="Subject"
                      onFocus={() => setShowSubjectDropdown(true)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    {showSubjectDropdown && (
                      <div className=" top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                        {filteredSubjects.map((sub, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                            onClick={() => {
                              setSelectedSubject_Faculty({
                                ...selectedSuject_Faculty,
                                subject_id: sub.id,
                                subject_name: sub.subject_name,
                              });

                              setShowSubjectDropdown(false);
                              setFilteredSubjects(subjects);
                            }}
                          >
                            {sub.subject_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div ref={facultydropdownRef} className="relative">
                    <input
                      type="text"
                      value={selectedSuject_Faculty.faculty_name}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const filter = faculties.filter((fac) =>
                          fac.faculty_name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        );

                        if (filter.length === 0) {
                          setSelectedSubject_Faculty({
                            ...selectedSuject_Faculty,
                            faculty_name: "",
                          });
                          setFilteredFaculties(faculties);
                        } else {
                          setSelectedSubject_Faculty({
                            ...selectedSuject_Faculty,
                            faculty_name: e.target.value,
                          });
                          setFilteredFaculties(filter);
                        }
                      }}
                      placeholder="Faculty"
                      onFocus={() => setShowFacultyDropdown(true)}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    {showFacultyDropdown && (
                      <div className=" top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                        {filteredFaculties.map((fac, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                            onClick={() => {
                              setSelectedSubject_Faculty({
                                ...selectedSuject_Faculty,
                                faculty_id: fac.id,
                                faculty_name: fac.faculty_name,
                              });
                              setFilteredFaculties(faculties);
                              setShowFacultyDropdown(false);
                            }}
                          >
                            {fac.faculty_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        selectedSuject_Faculty.subject_id !== 0 &&
                        selectedSuject_Faculty.faculty_id !== 0
                      ) {
                        setSemester({
                          ...semester,
                          subject_faculty: [
                            ...semester.subject_faculty,
                            selectedSuject_Faculty,
                          ],
                        });
                      }

                      setSelectedSubject_Faculty({
                        subject_id: 0,
                        subject_name: "",
                        faculty_id: 0,
                        faculty_name: "",
                      });
                    }}
                    className="text-black w-full border-dashed border border-black px-4 py-2 rounded-md"
                  >
                    Add Subject
                  </button>
                </div>
                <div className="group flex relative mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-45 disabled:cursor-not-allowed"
                    disabled={
                      !semester.sem_no ||
                      !selectedDepartment.id ||
                      !selectedBranch.id ||
                      !selectedClass.id ||
                      semester.subject_faculty.length === 0
                    }
                  >
                    <span>Submit</span>
                  </button>
                  {/** Tooltip displayed only when the button is disabled and hovered */}
                  {(!semester.sem_no ||
                    !selectedDepartment.id ||
                    !selectedBranch.id ||
                    !selectedClass.id ||
                    semester.subject_faculty.length === 0) && (
                    <span
                      className="group-hover:opacity-100 transition-opacity bg-slate-500 px-1 
      text-sm text-gray-100 rounded-md absolute left-1/2 
      -translate-x-1/2 opacity-0"
                    >
                      Please enter required data to proceed.
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 w-full">{renderSemesters}</div>
      </div>
    </>
  );
};

export default SemesterPage;
