
"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import '../../department.css';

const Page = () => {
  const [uni_id, setUni_id] = useState("");
  const [department_id, setDepartment_id] = useState(0);
  const [department, setDepartment] = useState([
        {
          id: 0,
          department_name: "",
          uni_id: 0,
        },
      ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const [activeCard, setActiveCard] = useState<number | null>(null); // Tracks the active card
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

    await getDepartment(customData);
  };

  const getDepartment = async (id: any) => {
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

  const handle_delete = async (dept_id: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${dept_id}`,
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
      setDepartment(department.filter((dept) => dept.id !== dept_id));
      router.refresh();
    } else {
      console.error("Error deleting data:", data);
    }
  };

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (dept_name: any) => {
    setIsModalOpen(true);
    setInputData(dept_name);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url =
        department_id === 0
          ? `http://localhost:3000/api/university/${uni_id}/department`
          : `http://localhost:3000/api/university/${uni_id}/department/${department_id}`;

      const method = department_id === 0 ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department_name: inputData }),
      });
      const result = await response.json();
      console.log("Data successfully posted:", result);

      if (result.function_name === "update_department") {
        setDepartment((prevDepartments) =>
          prevDepartments.map((dept) =>
            dept.id === department_id
              ? { ...dept, department_name: inputData }
              : dept
          )
        );
      }

      if (result.function_name === "create_department") {
        setDepartment((prevDepartments) => [
          ...prevDepartments,
          result.data[0],
        ]);
      }

      setIsModalOpen(false);
      setInputData("");
      setDepartment_id(0);
      router.refresh();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const get_dept_data = department.map((data: any, index: number) => {
    const isActive = activeCard === index;

    return (
      <div
        className="shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm"
        key={index}
      >
        <div
          className={`main_content w-full flex justify-center items-center flex-col ${
            isActive ? "hidden" : ""
          }`}
          onClick={() => setActiveCard(index)}
        >
          <p className="text-lg text-slate-900">{data.id}</p>
          <p className="text-2xl text-slate-950">{data.department_name}</p>
          <div className="flex gap-1 mt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handle_edit(data.department_name);
                setDepartment_id(data.id);
              }}
              className="bg-green-600 px-3 py-1 rounded-md"
            >
              <LuPencil size={20} className="text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handle_delete(data.id);
              }}
              className="bg-red-600 px-3 py-1 rounded-md"
            >
              <IoClose size={20} className="text-white" />
            </button>
          </div>
        </div>
        <div
          className={`button_slide w-full h-28 flex gap-2 justify-center items-center ${
            isActive ? "active" : ""
          }`}
          onClick={() => setActiveCard(null)}
        >
          <button className="bg-slate-900 text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => router.push(`/dashboard/department/${data.id}/branch`)}>
            Branch
          </button>
          <button className="bg-slate-900 text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => router.push(`/dashboard/department/${data.id}/session`)}>
            Session
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-6 justify-center items-center p-5 w-full">
      <div className="flex justify-between w-full">
        <div className="text-3xl font-bold text-slate-950">Department</div>
        <button
          onClick={handle_insert}
          className="flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md"
        >
          <FaPlus /> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Add New Department</h2>

              <form onSubmit={handleSubmit}>
                <input
                  id="data"
                  type="text"
                  value={inputData}
                  placeholder="Enter Department Name"
                  onChange={(e) => setInputData(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
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
      </div>
      <div className="grid grid-cols-3 w-full gap-5">
        {department[0].id > 0 ? get_dept_data : null}
      </div>
    </div>
  );
};

export default Page;
