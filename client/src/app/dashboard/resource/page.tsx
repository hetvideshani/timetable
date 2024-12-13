"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Alerts from "../Alerts";
import Loading from "../loading";
const page = () => {
  const [uni_id, setUni_id] = useState("");
  const [resource_id, setResource_id] = useState(0);
  const [resource, setResource] = useState([
    {
      id: 0,
      resource_name: "",
      resource_type: "",
      capacity: 0,
      duration: 0,
    },
  ]);
  const [alertData, setAlertData] = useState({
    status: 0,
    function_name: "",
    isModalOpen: false,
    onConfirm: (confirm: boolean) => {},
  });
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    resource_name: "",
    resource_type: "",
    capacity: 0,
    duration: 0,
  });
  const router = useRouter();

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
      .catch((error) => console.error(error));

    await getResource(customData);
  };

  const getResource = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/resource`
    );
    const data = await response.json();

    if (Array.isArray(data.data)) {
      setLoading(false);
      setResource(data.data);
    } else {
      setResource([]);
    }
  };

  const handle_delete = async (res_id: any) => {
    setAlertData({
      status: 1,
      function_name: "delete",
      isModalOpen: true,
      onConfirm: async (confirm: boolean) => {
        if (confirm) {
          setLoading(true);
          try {
            const response = await fetch(
              `http://localhost:3000/api/university/${uni_id}/resource/${res_id}`,
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
              console.log("Resource deleted successfully");
              setResource(resource.filter((res) => res.id !== res_id));
              router.refresh();
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
    });
  };

  const handle_edit = (
    resource_name: any,
    resource_type: any,
    capacity: any,
    duration: any
  ) => {
    setIsModalOpen(true);
    setInputData({ resource_name, resource_type, capacity, duration });
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url =
        resource_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/resource`
          : `http://localhost:3000/api/university/${uni_id}/resource/${resource_id}`;

      const method = resource_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resource_name: inputData.resource_name,
          resource_type: inputData.resource_type,
          capacity: inputData.capacity,
          duration: inputData.duration,
        }),
      });
      const data = await response.json();
      console.log(data);

      if (data.function_name === "update_resource") {
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
        setResource((prev: any) =>
          prev.map((res: any) =>
            res.id === resource_id
              ? {
                  ...res,
                  resource_name: inputData.resource_name,
                  resource_type: inputData.resource_type,
                  capacity: inputData.capacity,
                  duration: inputData.duration,
                }
              : res
          )
        );
      }

      if (data.function_name === "create_resource") {
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
        setResource((prev) => [...prev, data.data]);
      }

      setIsModalOpen(false);
      setInputData({
        resource_name: "",
        resource_type: "",
        capacity: 0,
        duration: 0,
      });
      setResource_id(0);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const get_res_data = resource.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
          <button
            onClick={(e) => {
              handle_edit(
                data.resource_name,
                data.resource_type,
                data.duration,
                data.capacity
              );
              setResource_id(data.id);
            }}
            className="flex gap-1 hover:text-green-600 border-r border-black p-2"
          >
            <FiEdit size={20} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              handle_delete(data.id);
            }}
            className="flex gap-1 hover:text-red-600 p-2"
          >
            <FiTrash2 size={20} />
            <span>Delete</span>
          </button>
        </div>
        <div className="right_content w-full flex flex-col gap-0 items-center p-5 ">
          <p className=" text-2xl text-slate-950">{data.resource_name}</p>
          <p className=" text-xl text-slate-950">{data.resource_type}</p>
          <p className=" text-xl text-slate-950">{data.duration} min</p>
          <p className=" text-xl text-slate-950">{data.capacity} seats</p>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full h-full">
        <div></div>
        <div className="text-3xl font-bold text-slate-950">Resource</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus></FaPlus> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-gray-950">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Resource</h1>
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
                  value={inputData.resource_name}
                  placeholder="Enter Resource Name"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      resource_name: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="text"
                  value={inputData.resource_type}
                  placeholder="Enter Resource Type"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      resource_type: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="number"
                  value={inputData.capacity ? inputData.capacity : " "}
                  placeholder="Enter Capacity"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      capacity: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="number"
                  value={inputData.duration ? inputData.duration : ""}
                  placeholder="Enter Duration"
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      duration: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div className="group flex relative mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-45 disabled:cursor-not-allowed"
                    disabled={
                      !inputData.resource_name ||
                      !inputData.resource_type ||
                      !inputData.capacity ||
                      !inputData.duration
                    }
                  >
                    <span>Submit</span>
                  </button>
                  {/** Tooltip displayed only when the button is disabled and hovered */}
                  {(!inputData.resource_name ||
                    !inputData.resource_type ||
                    !inputData.capacity ||
                    !inputData.duration) && (
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
        <Loading />
      ) : (
        <div className="grid grid-cols-4 w-full gap-5">
          {get_res_data.length > 0 ? (
            get_res_data
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
