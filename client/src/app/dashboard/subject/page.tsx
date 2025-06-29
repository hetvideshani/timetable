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
  const [subject_id, setSubject_id] = useState(0);
  const [subject, setSubject] = useState([
    {
      id: 0,
      subject_name: "",
      uni_id: 0,
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
  const [inputData, setInputData] = useState("");
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
      .catch((error) => console.error("Error fetching data:", error));

    await getSubject(customData);
  };

  const getSubject = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/subject`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setLoading(false);
      setSubject(data.data);
    } else {
      setSubject([]);
    }
  };

  const handle_delete = (sub_id: number) => {
    setAlertData({
      status: 1,
      function_name: "delete",
      isModalOpen: true,
      onConfirm: async (confirm) => {
        if (confirm) {
          setLoading(true);
          try {
            const res = await fetch(
              `http://localhost:3000/api/university/${uni_id}/subject/${sub_id}`,
              { method: "DELETE" }
            );
            const data = await res.json();
            if (data.status === 201) {
              setLoading(false);
              setSubject((prev) => prev.filter((sub) => sub.id !== sub_id));
              setAlertData({
                status: 201,
                function_name: "delete_success",
                isModalOpen: true,
                onConfirm: (confirm: boolean) => {},
              });
            } else {
              throw new Error("Unexpected response status");
            }
          } catch (error) {
            setAlertData({
              status: 500,
              function_name: "delete_error",
              isModalOpen: true,
              onConfirm: (confirm: boolean) => {},
            });
            console.error("Error deleting subject:", error);
          }
          router.refresh();
        } else {
          setAlertData((prev) => ({ ...prev, isModalOpen: false }));
          router.refresh();
        }
      },
    });
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (sub_name: any) => {
    setIsModalOpen(true);
    setInputData(sub_name);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url =
        subject_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/subject`
          : `http://localhost:3000/api/university/${uni_id}/subject/${subject_id}`;

      const method = subject_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_name: inputData }),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      setAlertData({
        status: result.status,
        function_name: result.function_name,
        isModalOpen: true,
        onConfirm: (confirm: boolean) => {},
      });
      // router.refresh();

      if (result.function_name === "update_subject") {
        setSubject((prev: any) =>
          prev.map((sub: any) =>
            sub.id === subject_id ? { ...sub, subject_name: inputData } : sub
          )
        );
      }

      if (result.function_name === "create_subject") {
        setSubject((prev) => [...prev, result.data[0]]);
      }

      // alerts(result.status, result.function_name, true)

      setIsModalOpen(false);
      setInputData("");
      setSubject_id(0);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
      setAlertData({
        status: 500,
        function_name: "error",
        isModalOpen: true,
        onConfirm: (confirm: boolean) => {},
      });
    }
  };

  const get_sub_data = subject.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
      >
        <div className="edit_delete opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-md group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-all duration-1000  flex  border-black justify-center items-center h-full p-2 w-full absolute">
          <button
            onClick={(e) => {
              handle_edit(data.subject_name);
              setSubject_id(data.id);
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
        <div className="right_content w-full  flex flex-col gap-0 p-5 ">
          <p className=" text-2xl text-slate-950">{data.subject_name}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full">
        <div className="text-3xl font-bold text-slate-950">Subjects</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus></FaPlus> <div>New</div>
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex relative">
              <div className="flex-1 ">
                <h1 className="text-lg font-bold mb-4">Add New Subject</h1>
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
                placeholder="Enter Subject Name"
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
          {get_sub_data.length > 0 ? (
            get_sub_data
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
