'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const page = () => {
    const [uni_id, setUni_id] = useState('');
    const params = useParams();
    const [branches, setBranches] = useState([{
        id:0,
        branch_name: "",
        dept_id:0,
    }]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputData, setInputData] = useState("");
    const [branch_id, setBranch_id] = useState(0);
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
          console.log("Data successfully deleted:", data);
          setBranches(branches.filter((data) => data.id !== branch_id));
          router.refresh();
        } else {
          console.error("Error deleting data:", data);
        }
      };

      const handle_insert = () => {
        setIsModalOpen(true);
      };
    
      const handle_edit = (branch_name: any) => {
        setIsModalOpen(true);
        setInputData(branch_name);
      };

      const handleSubmit = async (e:any) => {
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
            body: JSON.stringify({ branch_name: inputData }),
          });
          const result = await response.json();
          console.log("Data successfully posted:", result);
    
          if (result.function_name === "update_branch") {
            setBranches((prevBranch) =>
              prevBranch.map((bran) =>
                bran.id === branch_id
                  ? { ...bran, branch_name: inputData }
                  : bran
              )
            );
          }
    
          if (result.function_name === "create_branch") {
            setBranches((prevBranch) => [
              ...prevBranch,
              result.data[0],
            ]);
          }
    
          setIsModalOpen(false);
          setInputData("");
          setBranch_id(0); 
          router.refresh();
        } catch (error) {
          console.error("Error posting data:", error);
        }
      };

    const get_branches = async (id:any) => {
        const response = await fetch(`http://localhost:3000/api/university/${id}/department/${department_id}/branch`);
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setBranches(data.data);
        } else {
          setBranches([]);
        }
    }

    const get_branch_data = branches.map((data,index) => {
        return (
        <div
        className="shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm"
        key={index} onClick={() => {router.push(`/dashboard/department/${department_id}/${data.id}`)}}>
        <p className=" text-lg text-slate-900">{data.id}</p>
        <p className=" text-2xl text-slate-950">{data.branch_name}</p>
        <div className="flex gap-1 mt-5">
          <button
          onClick={(e) => {
            handle_edit(data.branch_name);
            setBranch_id(data.id);
          }}
            className="bg-green-600 px-3 py-1 rounded-md"
          >
            <LuPencil size={20} className=" text-white "></LuPencil>
          </button>
          <button
            onClick={() => {
              handle_delete(data.id);
            }}
            className="bg-red-600 px-3 py-1 rounded-md"
          >
            <IoClose size={20} className=" text-white"></IoClose>
          </button>
        </div>
      </div>)
    })

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
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Add New Branch</h2>

              <form onSubmit={handleSubmit}>
                <input
                  id="data"
                  type="text"
                  value={inputData}
                  placeholder="Enter Branch Name"
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
        {branches.length > 1 ? get_branch_data : null}
      </div>
    </div>
    );
}

export default page;
