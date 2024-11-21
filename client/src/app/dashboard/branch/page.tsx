"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";

const page = () => {
  const [validationState, setValidationState] = useState<{
    [key: string]: boolean;
  }>({});
  const [uni_id, setUni_id] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [all_branches, setAllBranches] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
      dept_name: "",
    },
  ]);

  const [branch, setBranch] = useState<{
    id: number | null;
    branch_name: string;
    dept_id: number | null;
  }>({
    id: null,
    branch_name: "",
    dept_id: null,
  });

  const [selected_department, setSelectedDepartment] = useState({
    id: 0,
    department_name: "",
    uni_id: 0,
  });
  const [previous_department, setPreviousDepartment] = useState({ id: 0, department_name: "", uni_id: 0 });
  const [department, setDepartment] = useState([
    { id: 0, department_name: "", uni_id: 0 },
  ]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    get_uni_id();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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

    await getBranch(customData);
    await department_data(customData);
  };

  const getBranch = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/branch`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllBranches(data.data);
    } else {
      console.log("No data");
    }
  };

  const department_data = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setDepartment(data.data);
    } else {
      console.log("No data");
    }
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (br: any) => {
    setIsModalOpen(true);
    setBranch({
      ...branch,
      branch_name: br.branch_name,
      id: br.id,
      dept_id: br.dept_id,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors: any = {};

    if (!branch.branch_name.trim()) {
      validationErrors.branch_name = true;
    }

    if (!branch.dept_id) {
      validationErrors.dept_id = true;
    }

    if (Object.keys(validationErrors).length > 0) {
      setValidationState(validationErrors);
      return;
    }
    try {
      console.log(branch);

      const url = branch.id === null ? `http://localhost:3000/api/university/${uni_id}/department/${branch.dept_id}/branch` :
        `http://localhost:3000/api/university/${uni_id}/department/${previous_department.id}/branch/${branch.id}`;
      
      const method = branch.id === null ? "POST" : "PUT";

      console.log(branch);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branch),
      });

      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_branch") {
        setAllBranches((prev: any) =>
          prev.map((br: any) =>
            br.id === branch.id
              ? {
                  ...br,
                  branch_name: branch.branch_name,
                  dept_id: branch.dept_id,
                  dept_name: selected_department.department_name,
                }
              : br
          )
        );
      }

      if (result.function_name === "create_branch") {
        setAllBranches((prev: any) => [...prev, {
          id:result.data[0].id,
          branch_name:result.data[0].branch_name,
          dept_id:result.data[0].dept_id,
          dept_name:selected_department.department_name
        }]);
      }

      setIsModalOpen(false);
      setBranch({ id: null, branch_name: "", dept_id: null });
      setSelectedDepartment({ id: 0, department_name: "", uni_id: 0 });
      setPreviousDepartment({ id: 0, department_name: "", uni_id: 0 });
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handle_delete = async (br: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${br.dept_id}/branch/${br.id}`,
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
      setAllBranches(all_branches.filter((data) => data.id !== br.id));
      setBranch({ id: null, branch_name: "", dept_id: null });
      router.refresh();
    } else {
      console.error("Error deleting data:", data);
    }
  };

  const get_branch_data = all_branches.map((data, index) => {
    return (
      <div
        className="shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm"
        key={index}
        onClick={() =>
          setBranch({
            id: data.id,
            branch_name: data.branch_name,
            dept_id: data.dept_id,
          })
        }
      >
        <p className=" text-lg text-slate-900">{data.id}</p>
        <p className=" text-2xl text-slate-950">{data.branch_name}</p>
        <p className=" text-xl text-slate-950">Department - {data.dept_name}</p>
        <div className="flex gap-1 mt-5">
          <button
            onClick={(e) => {
              handle_edit(data);
              setPreviousDepartment({ id: data.dept_id, department_name: data.dept_name, uni_id: Number(uni_id) });
            }}
            className="bg-green-600 px-3 py-1 rounded-md"
          >
            <LuPencil size={20} className=" text-white "></LuPencil>
          </button>
          <button
            onClick={(e) => {
              handle_delete(data);
            }}
            className="bg-red-600 px-3 py-1 rounded-md"
          >
            <IoClose size={20} className=" text-white"></IoClose>
          </button>
        </div>
      </div>
    );
  });

  const canSubmit = true;
  return (
    <>
      <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
        <div className="flex justify-between w-full">
          <div></div>
          <div className="text-3xl font-bold text-slate-950">Branch</div>
          <button
            onClick={handle_insert}
            className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
          >
            <FaPlus></FaPlus> <div>New</div>
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Add New Branch</h2>

              <form onSubmit={handleSubmit}>
                {/* <input
                  id="data"
                  type="text"
                  value={branch.branch_name}
                  placeholder="Enter Subject Name"
                  required
                  onChange={(e) =>
                    setBranch({ ...branch, branch_name: e.target.value })
                  }
                  className="peer required:border-red-500 required:focus:border-red-500 required:focus:ring-red-500 mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <p className="mt-1 text-sm text-red-500 invisible peer-invalid:visible">
                  Branch Name is required.
                </p>

                <div ref={dropdownRef} className="relative">
                  <input
                    className="required:border-red-500 required:focus:border-red-500 required:focus:ring-red-500 mt-1 p-2 border border-gray-300 rounded-md w-full"
                    type="text"
                    value={selected_department.department_name}
                    required
                    onChange={(e) =>
                      setSelectedDepartment({
                        ...selected_department,
                        department_name: e.target.value,
                      })
                    }
                    placeholder="Department"
                    onFocus={() => setShowDropdown(true)}
                  />
                  <p className="mt-1 text-sm text-red-500 invisible peer-invalid:visible">
                    Department is required.
                  </p>
                  {showDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {department.map((type, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedDepartment({
                              id: type.id,
                              department_name: type.department_name,
                              uni_id: type.uni_id,
                            });
                            setShowDropdown(false);
                          }}
                        >
                          {type.department_name}
                        </div>
                      ))}
                    </div>
                  )} */}
                {/* </div> */}
                <input
                  id="data"
                  type="text"
                  name="branch_name"
                  placeholder="Enter Branch Name"
                  value={branch.branch_name}
                  onChange={(e) => {
                    setBranch({ ...branch, branch_name: e.target.value });
                    setValidationState({
                      ...validationState,
                      branch_name: false,
                    });
                  }}
                  className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 ${
                    validationState.branch_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <p className="mt-1 text-sm text-red-500">
                  {validationState.branch_name && "Branch Name is required."}
                </p>

                <div ref={dropdownRef} className="relative">
                  <input
                    type="text"
                    value={selected_department.department_name}
                    onChange={(e) => {
                      setValidationState({ ...validationState, dept_id: false });
                      setSelectedDepartment({
                        ...selected_department,
                        department_name: e.target.value,
                      });
                    }}
                    placeholder="Department"
                    onFocus={() => setShowDropdown(true)}
                    className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 ${
                      validationState.dept_id ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <p className="mt-1 text-sm text-red-500">
                    {validationState.dept_id && "Department is required."}
                  </p>
                  {showDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {department.map((type, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedDepartment({
                              id: type.id,
                              department_name: type.department_name,
                              uni_id: type.uni_id,
                            });
                            setBranch({ ...branch, dept_id: type.id });
                            setValidationState({ ...validationState, dept_id: false });
                            setShowDropdown(false);
                          }}
                        >
                          {type.department_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`${
                      canSubmit
                        ? "bg-blue-500"
                        : "bg-gray-300 cursor-not-allowed"
                    } disabled:cursor-not-allowed text-white px-4 py-2 rounded-md`}
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="w-full gap-5">
          {/* {all_branches.length > 1 ? get_branch_data : null} */}
          <div className="w-full px-8">
            <HoverEffect items={all_branches} />
          </div>

        </div>
      </div>
    </>
  );
};

export default page;
