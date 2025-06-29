"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import Alerts from "../Alerts";
import Loading from "../loading";

const page = () => {
  const [uni_id, setUni_id] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [all_sessions, setAllSessions] = useState([
    {
      id: 0,
      session_sequence: 0,
      do_nothing: false,
      duration: 0,
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
  const [duration, setDuration] = useState("");
  const [session, setSession] = useState<{
    id: number | null;
    session_sequence: number | null;
    duration: number | null;
    do_nothing: boolean | null;
    dept_id: number | null;
  }>({
    id: null,
    session_sequence: null,
    duration: null,
    do_nothing: false,
    dept_id: null,
  });

  const [dept_name, setDept_name] = useState("");
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

    await getSessions(customData);
    await department_data(customData);
  };

  const getSessions = async (id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${id}/session`
    );

    const data = await response.json();
    if (Array.isArray(data.data)) {
      setLoading(false);
      console.log(data.data);
      setAllSessions(data.data);
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

  const handle_edit = (ses: any) => {
    setIsModalOpen(true);
    setSession({
      ...session,
      dept_id: ses.dept_id,
      id: ses.id,
      do_nothing: ses.do_nothing,
      duration: ses.duration,
      session_sequence: ses.session_sequence,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(session);

      const url =
        session.id === null
          ? `http://localhost:3000/api/university/${uni_id}/department/${session.dept_id}/session`
          : `http://localhost:3000/api/university/${uni_id}/department/${session.dept_id}/session/${session.id}`;

      const method = session.id === null ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_session") {
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
        setAllSessions((prev: any) =>
          prev.map((ses: any) =>
            ses.id === session.id
              ? {
                  ...ses,
                  dept_id: session.dept_id,
                  do_nothing: session.do_nothing,
                  duration: session.duration,
                  session_sequence: session.session_sequence,
                  dept_name: dept_name,
                }
              : ses
          )
        );
      }
      console.log(result[0]);

      if (result.function_name === "create_session") {
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
        setAllSessions((prev: any) => [
          ...prev,
          {
            id: result.data[0].id,
            dept_id: result.data[0].dept_id,
            do_nothing: result.data[0].do_nothing,
            duration: result.data[0].duration,
            session_sequence: result.data[0].session_sequence,
            dept_name: dept_name,
          },
        ]);
      }

      setIsModalOpen(false);
      setSession({
        id: null,
        dept_id: null,
        do_nothing: false,
        duration: null,
        session_sequence: null,
      });
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

  const handle_delete = async (br: any) => {
    setAlertData({
      status: 1,
      function_name: "delete",
      isModalOpen: true,
      onConfirm: async (confirm) => {
        if (confirm) {
          setLoading(true);
          try {
            const res = await fetch(
              `http://localhost:3000/api/university/${uni_id}/department/${br.dept_id}/session/${br.id}`,
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
              setAllSessions((prev) =>
                prev.filter((sess) => sess.id !== br.id)
              );
              setAlertData({
                status: 201,
                function_name: "delete",
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

  const get_session_data = all_sessions.map((data, index) => {
    return (
      <div
        className="main_content group shadow-md relative justify-center items-center w-full font-bold rounded-sm"
        key={index}
        onClick={() =>
          setSession({
            id: data.id,
            session_sequence: data.session_sequence,
            duration: data.duration,
            dept_id: data.dept_id,
            do_nothing: data.do_nothing,
          })
        }
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
          <p className=" text-2xl text-slate-950">{data.session_sequence}</p>
          <p className=" text-xl text-slate-950">
            {data.do_nothing ? "Break" : "Allocated"}
          </p>
          <p className=" text-xl text-slate-950">Duration - {data.duration}</p>
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
          <div className="text-3xl font-bold text-slate-950">Session</div>
          <button
            onClick={handle_insert}
            className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
          >
            <FaPlus></FaPlus> <div>New</div>
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 z-10 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <div className="flex relative">
                <div className="flex-1 ">
                  <h1 className="text-lg font-bold mb-4">Add New Session</h1>
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
                  type="number"
                  value={
                    session.session_sequence ? session.session_sequence : ""
                  }
                  placeholder="Enter Session Sequence"
                  onChange={(e) =>
                    setSession({
                      ...session,
                      session_sequence: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  id="data"
                  type="number"
                  value={session.duration ? session.duration : ""}
                  placeholder="Enter Session Duration"
                  onChange={(e) =>
                    setSession({ ...session, duration: Number(e.target.value) })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <div className="mt-1 p-2 flex gap-3 text-gray-500 items-center w-full">
                  <label>Is Break Session ?</label>
                  <input
                    id="data"
                    type="checkbox"
                    checked={session.do_nothing ? session.do_nothing : false}
                    onChange={(e) =>
                      setSession({ ...session, do_nothing: e.target.checked })
                    }
                  />
                </div>

                <div ref={dropdownRef} className="relative">
                  <input
                    type="text"
                    value={dept_name}
                    onChange={(e) => {
                      setDept_name(e.target.value);
                      const filtered = department.filter((type) =>
                        type.department_name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      );

                      if (filtered.length === 0) {
                        setFilteredDepartment(department);
                        setDept_name("");
                      } else {
                        setFilteredDepartment(filtered);
                      }
                    }}
                    placeholder="Department"
                    className={`bg-gray-50 border text-gray-900 rounded-md border-r-gray-300 block w-full p-2.5`}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && (
                    <div className="relative top-full left-0   bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {filteredDepartment.map((type, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSession({ ...session, dept_id: type.id });
                            setDept_name(type.department_name);
                            setShowDropdown(false);
                          }}
                        >
                          {type.department_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="group flex relative mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-45 disabled:cursor-not-allowed"
                    disabled={
                      !session.dept_id ||
                      !session.duration ||
                      !session.session_sequence ||
                      !dept_name
                    }
                  >
                    <span>Submit</span>
                  </button>
                  {/** Tooltip displayed only when the button is disabled and hovered */}
                  {(!session.dept_id ||
                    !session.duration ||
                    !session.session_sequence ||
                    !dept_name) && (
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
            {get_session_data.length > 0 ? (
              get_session_data
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
