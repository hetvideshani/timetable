"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Alerts from "@/app/dashboard/Alerts";
import Loading from "@/app/dashboard/loading";

const page = () => {
  const [uni_id, setUni_id] = useState("");
  const params = useParams();
  const [branches, setBranches] = useState([
    {
      id: 0,
      branch_name: "",
      dept_id: 0,
    },
  ]);
  const [alertData, setAlertData] = useState({
    status: 0,
    function_name: "",
    isModalOpen: false,
    onConfirm: (confirm: boolean) => {},
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const [branch_id, setBranch_id] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const department_id = params.department;

  useEffect(() => {
    get_uni_id();
  }, []);

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

    await get_branches(customData);
  };

  const handle_delete = async (branch_id: any) => {
    setAlertData({
      status: 1,
      function_name: "delete_branch",
      isModalOpen: true,
      onConfirm: async (confirm: boolean) => {
        if (confirm) {
          setLoading(true);
          const response = await fetch(
            `http://localhost:3000/api/university/${uni_id}/department/${department_id}/branch/${branch_id}`,
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
              onConfirm: (confirm: boolean) => {},
            });
            setBranches(branches.filter((data) => data.id !== branch_id));
            setTimeout(() => {
              setAlertData({
                status: 0,
                function_name: "",
                isModalOpen: false,
                onConfirm: () => {},
              });
            }, 3000);
            router.refresh();
          } else {
            setAlertData({
              status: 500,
              function_name: "delete",
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
            console.error("Error deleting data:", data);
          }
        }
      },
    });
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (branch_name: any) => {
    setIsModalOpen(true);
    setInputData(branch_name);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url =
        branch_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/department/${department_id}/branch`
          : `http://localhost:3000/api/university/${uni_id}/department/${department_id}/branch/${branch_id}`;

      const method = branch_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch_name: inputData,
          dept_id: Number(department_id),
        }),
      });
      const result = await response.json();

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
        setBranches((prevBranch) =>
          prevBranch.map((bran) =>
            bran.id === branch_id ? { ...bran, branch_name: inputData } : bran
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

        setBranches((prevBranch) => [...prevBranch, result.data[0]]);
      }

      setIsModalOpen(false);
      setInputData("");
      setBranch_id(0);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
      setAlertData({
        status: 500,
        function_name: "create_branch",
        isModalOpen: true,
        onConfirm: (confirm: boolean) => {},
      });
    }
  };

  const get_branches = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/department/${department_id}/branch`
    );
    const data = await response.json();
    if (Array.isArray(data.data)) {
      setBranches(data.data);
      setLoading(false);
    } else {
      setBranches([]);
    }
  };

  const get_branch_data = branches.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm cursor-pointer"
        key={index}
        onClick={(e) => {
          router.push(
            `/dashboard/department/${department_id}/branch/${data.id}`
          );
        }}
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000 flex border-black justify-center items-center p-2 h-full w-full absolute z-10">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation to parent
              handle_edit(data.branch_name);
              setBranch_id(data.id);
            }}
            className="flex gap-1 focus:z-10 hover:text-green-600 border-r border-black p-2"
          >
            <FiEdit size={20} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation to parent
              handle_delete(data.id);
            }}
            className="flex gap-1 hover:z-10 hover:text-red-600 p-2"
          >
            <FiTrash2 size={20} />
            <span>Delete</span>
          </button>
        </div>
        <div className="right_content w-full items-center flex flex-col gap-0 p-10">
          <p className="text-2xl text-slate-950">{data.branch_name}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full">
        <div className="text-3xl font-bold text-slate-950">Branch</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus></FaPlus> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">
                    {branch_id == 0 ? "Add " : "Edit "}New Branch
                  </h1>
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
                  value={inputData}
                  placeholder="Enter Branch Name"
                  onChange={(e) => setInputData(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div className="group flex relative mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-45 disabled:cursor-not-allowed"
                    disabled={!inputData}
                  >
                    <span>Submit</span>
                  </button>
                  {/** Tooltip displayed only when the button is disabled and hovered */}
                  {!inputData && (
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
      </div>
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
        <div className="flex justify-center items-center">
          <Loading />
        </div>
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
  );
};

export default page;
