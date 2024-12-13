"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Alerts from "../Alerts";
import Loading from "../loading";

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
  const [alertData, setAlertData] = useState({
    status: 0,
    function_name: "",
    isModalOpen: false,
    onConfirm: (confirm: boolean) => {},
  });
  const [loading, setLoading] = useState(true);

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
  const [previous_department, setPreviousDepartment] = useState({
    id: 0,
    department_name: "",
    uni_id: 0,
  });
  const [department, setDepartment] = useState([
    { id: 0, department_name: "", uni_id: 0 },
  ]);
  const [filteredDepartment, setFilteredDepartment] = useState([
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
      setLoading(false);
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
      setFilteredDepartment(data.data);
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
    setSelectedDepartment({
      id: br.dept_id,
      department_name: br.dept_name,
      uni_id: Number(uni_id)
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

      const url =
        branch.id === null
          ? `http://localhost:3000/api/university/${uni_id}/department/${branch.dept_id}/branch`
          : `http://localhost:3000/api/university/${uni_id}/department/${previous_department.id}/branch/${branch.id}`;

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
        setAlertData({
          status: 201,
          function_name: "update",
          isModalOpen: true,
          onConfirm: (confirm: boolean) => {},
        });
        setTimeout(() => {
          setAlertData({
            status: 0,
            function_name: "",
            isModalOpen: false,
            onConfirm: () => {},
          });
        }, 3000);

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
        setAlertData({
          status: 201,
          function_name: "create",
          isModalOpen: true,
          onConfirm: (confirm: boolean) => {},
        });
        setTimeout(() => {
          setAlertData({
            status: 0,
            function_name: "",
            isModalOpen: false,
            onConfirm: () => {},
          });
        }, 3000);
        setAllBranches((prev: any) => [
          ...prev,
          {
            id: result.data[0].id,
            branch_name: result.data[0].branch_name,
            dept_id: result.data[0].dept_id,
            dept_name: selected_department.department_name,
          },
        ]);
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
    setAlertData({
      status: 1,
      function_name: "delete",
      isModalOpen: true,
      onConfirm: async (confirm: boolean) => {
        if (confirm) {
          setLoading(true);
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
            setLoading(false);
            setAlertData({
              status: 201,
              function_name: "delete",
              isModalOpen: true,
              onConfirm: () => {},
            });
            setTimeout(() => {
              setAlertData({
                status: 0,
                function_name: "",
                isModalOpen: false,
                onConfirm: () => {},
              });
            }, 3000);

            console.log("Data successfully deleted:", data);
            setAllBranches(all_branches.filter((data) => data.id !== br.id));
            setBranch({ id: null, branch_name: "", dept_id: null });
            router.refresh();
          } else {
            setAlertData({
              status: 400,
              function_name: "delete",
              isModalOpen: true,
              onConfirm: () => {},
            });
          }
        }
        setAlertData({
          status: 0,
          function_name: "",
          isModalOpen: false,
          onConfirm: () => {},
        });
      },
    });
  };

  const get_branch_data = all_branches.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
        onClick={() =>
          setBranch({
            id: data.id,
            branch_name: data.branch_name,
            dept_id: data.dept_id,
          })
        }
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
          <button
            onClick={(e) => {
              handle_edit(data);
              setPreviousDepartment({
                id: data.dept_id,
                department_name: data.dept_name,
                uni_id: Number(uni_id),
              });
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
          <p className=" text-2xl text-slate-950">{data.branch_name}</p>
          <p className=" text-xl text-slate-950">
            Department - {data.dept_name}
          </p>
        </div>
      </div>
    );
  });
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
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Branch</h1>
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
                  className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 ${validationState.branch_name
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
                      const inputValue = e.target.value;
                      const filtered = department.filter((type) =>
                        type.department_name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      );

                      setFilteredDepartment(filtered);
                      setValidationState({
                        ...validationState,
                        dept_id: false,
                      });

                      if (filtered.length === 0 || inputValue === '') {
                        setFilteredDepartment(department);
                        setSelectedDepartment({
                          ...selected_department,
                          department_name: "",
                        });
                      } else {
                        setSelectedDepartment({
                          ...selected_department,
                          department_name: inputValue,
                        });
                      }
                    }}
                    placeholder="Department"
                    onFocus={() => setShowDropdown(true)}
                    className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 ${validationState.dept_id
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />
                  <p className="mt-1 text-sm text-red-500">
                    {validationState.dept_id && "Department is required."}
                  </p>
                  {showDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredDepartment.length > 0 ? (
                        filteredDepartment.map((type, index) => (
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
                              setValidationState({
                                ...validationState,
                                dept_id: false,
                              });
                              setShowDropdown(false);
                            }}
                          >
                            {type.department_name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No data found</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={!branch.branch_name || !branch.dept_id || !selected_department.department_name}
                    className={`${(branch.branch_name && branch.dept_id && selected_department.department_name)
                      ? "bg-blue-500"
                      : "bg-gray-300 cursor-not-allowed"
                      } disabled:cursor-not-allowed text-white px-4 py-2 rounded-md`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {alertData.isModalOpen && (
          <Alerts
            status={alertData.status}
            isModalOpen={alertData.isModalOpen}
            function_name={alertData.function_name}
            onConfirm={(confirm) => {
              alertData.onConfirm(confirm);
              setAlertData({
                status: 0,
                function_name: "",
                isModalOpen: false,
                onConfirm: () => {},
              });
            }}
          ></Alerts>
        )}

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-4 w-full gap-5">
            {get_branch_data.length > 0 ? (
              get_branch_data
            ) : (
              <div className="text-lg font-bold text-slate-950">
                No Branch Found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default page;
