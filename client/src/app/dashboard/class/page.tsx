'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from 'react-icons/fa';
import CustomDropdown from '../dropdown';
import { get } from 'http';

const page = () => {
  const [uni_id, setUni_id] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [all_classes, setAllClasses] = useState([{
    id: 0,
    class_no: 0,
    total_batches: 0,
    students_per_batch: 0,
    branch_id: 0,
    branch_name: "",
    dept_name: "",
    dept_id: 0,
  }]);
  const [one_class, setOneClass] = useState<{
    id: number | null;
    class_no: number;
    total_batches: number;
    students_per_batch: number;
    branch_id: number | null;
  }>({
    id: null,
    class_no: 0,
    total_batches: 0,
    students_per_batch: 0,
    branch_id: null,
  });

  const [all_department, setAllDepartment] = useState([{ id: 0, department_name: "", uni_id: 0 }]);
  const [selected_department, setSelectedDepartment] = useState({ id: 0, department_name: "", uni_id: 0 });
  const [all_branches, setAllBranches] = useState([{
    id: 0,
    branch_name: "",
    dept_id: 0,
    dept_name: ""
  }]);
  const [selected_branch, setSelectedBranch] = useState({ id: 0, branch_name: "", dept_id: 0, dept_name: "" });
  const [branches, setBranches] = useState([{ id: 0, branch_name: "", dept_id: 0, dept_name: "" }]);
  const [previous_data, setPreviousData] = useState({
    id: 0,
    class_no: 0,
    total_batches: 0,
    students_per_batch: 0,
    branch_id: 0,
    branch_name: "",
    dept_name: "",
    dept_id: 0,
  });
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const router = useRouter();
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    get_uni_id();
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target as Node)
      ) {
        setShowDropdown1(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target as Node)
      ) {
        setShowDropdown2(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef1, dropdownRef2]);

  const get_uni_id = async () => {
    let customData;
    await fetch(window.location.href)
      .then((res) => {
        customData = res.headers.get('uni_id');
        if (customData) {
          setUni_id(customData);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));

    await getDepartment(customData);
    await getBranch(customData);
    await getClasses(customData);
  }

  const getDepartment = async (id: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/department`);

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllDepartment(data.data);
    } else {
      console.log('No data');
    }
  }

  const getBranch = async (id: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/branch`);

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllBranches(data.data);
    } else {
      console.log('No data');
    }
  }

  const getClasses = async (id: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/class`);

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllClasses(data.data);
    } else {
      console.log('No data');
    }
  }

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (br: any) => {
    console.log(br);
    setIsModalOpen(true);
    setOneClass({ id: br.id, class_no: br.class_no, total_batches: br.total_batches, students_per_batch: br.students_per_batch, branch_id: br.branch_id });
    setBranches(all_branches.filter((data) => data.dept_id === br.dept_id));
  }

  const handle_delete = async (br: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${uni_id}/department/${br.dept_id}/branch/${br.id}/class/${br.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === 201) {
      console.log('Data successfully deleted:', data);
      setAllClasses(all_classes.filter((data) => data.id !== br.id));
      setOneClass({ id: 0, class_no: 0, total_batches: 0, students_per_batch: 0, branch_id: 0 });
      router.refresh();
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(one_class);

      const url = one_class.id === 0 || one_class.id === null ? `http://localhost:3000/api/university/${uni_id}/department/${selected_department.id}/branch/${selected_branch.id}/class` : `http://localhost:3000/api/university/${uni_id}/department/${previous_data.dept_id}/branch/${previous_data.branch_id}/class/${one_class.id}`;

      const method = one_class.id === 0 || one_class.id === null ? 'POST' : 'PUT';

      if (method === 'PUT') {
        setOneClass({ ...one_class, branch_id: selected_branch.id });
      }

      console.log(one_class);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(one_class),
      });

      const result = await response.json();

      if (result.status === 201) {

        console.log('class successfully posted:', result);
        console.log(result.data);

        if (result.function_name === 'update_class') {
          setAllClasses((prev: any) => prev.map((cl: any) => cl.id === one_class.id ? {
            ...cl, class_no: one_class.class_no, total_batches: one_class.total_batches, students_per_batch: one_class.students_per_batch, branch_id: one_class.branch_id, branch_name: selected_branch.branch_name,
            dept_id: selected_department.id, dept_name: selected_department.department_name
          } : cl));
        }

        if (result.function_name === 'create_class') {
          setAllClasses((prev: any) => [...prev, { id: result.data[0].id, class_no: result.data[0].class_no, total_batches: result.data[0].total_batches, students_per_batch: result.data[0].students_per_batch, branch_id: result.data[0].branch_id, branch_name: selected_branch.branch_name, dept_id: selected_department.id, dept_name: selected_department.department_name }]);
        }
      }
      else {
        console.error('Error posting data:', result);
      }

      setIsModalOpen(false);
      setOneClass({ id: 0, class_no: 0, total_batches: 0, students_per_batch: 0, branch_id: 0 });
      router.refresh();
    }
    catch (error) {
      console.error('Error posting data:', error);
    }
  }

  const get_class_data = all_classes.map((data, index) => {
    return (
      <div
        className="shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm"
        key={index} onClick={() => {
          setOneClass({ id: data.id, class_no: data.class_no, total_batches: data.total_batches, students_per_batch: data.students_per_batch, branch_id: data.branch_id });
          setSelectedDepartment({ id: data.dept_id, department_name: data.dept_name, uni_id: Number(uni_id) });
          setSelectedBranch({ id: data.branch_id, branch_name: data.branch_name, dept_id: data.dept_id, dept_name: data.dept_name });
          setPreviousData({ id: data.id, class_no: data.class_no, total_batches: data.total_batches, students_per_batch: data.students_per_batch, branch_id: data.branch_id, branch_name: data.branch_name, dept_name: data.dept_name, dept_id: data.dept_id });
        }}
      >
        <p className=" text-lg text-slate-900">{data.id}</p>
        <p className=" text-xl text-slate-950">Department : {data.dept_name}</p>
        <p className=" text-xl text-slate-950">Branch : {data.branch_name}</p>
        <p className=" text-xl text-slate-950">Class No : {data.class_no}</p>
        <p className=" text-xl text-slate-950">Total Batch : {data.total_batches}</p>
        <p className=" text-xl text-slate-950">Student Per Batch : {data.students_per_batch}</p>
        <div className="flex gap-1 mt-5">
          <button
            onClick={(e) => {
              handle_edit(data);
            }}
            className="bg-green-600 px-3 py-1 rounded-md"
          >
            <LuPencil size={20} className=" text-white "></LuPencil>
          </button>
          <button
            onClick={() => {
              handle_delete(data);
            }}
            className="bg-red-600 px-3 py-1 rounded-md"
          >
            <IoClose size={20} className=" text-white"></IoClose>
          </button>
        </div>
      </div>
    )
  })

  return (
    <>
      <div className='flex flex-col gap-6 justify-center items-center p-5 w-full'>
        <div className='flex justify-between w-full'>
          <div>

          </div>
          <div className='text-3xl font-bold text-slate-950'>
            Class
          </div>
          <button onClick={handle_insert} className='flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md'>
            <FaPlus></FaPlus> <div>Add New Class</div>
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-black">
              <h2 className="text-lg  font-bold mb-4">Add New Branch</h2>

              <form onSubmit={handleSubmit}>
                <input
                  id="data"
                  type="text"
                  value={one_class.class_no}
                  placeholder='Enter Subject Name'
                  onChange={(e) => setOneClass({ ...one_class, class_no: Number(e.target.value) })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div ref={dropdownRef1} className='relative' >
                  <input
                    type='text'
                    value={selected_department.department_name}
                    onChange={(e) => setSelectedDepartment({ ...selected_department, department_name: e.target.value })}
                    placeholder='Department'
                    onFocus={() => setShowDropdown1(true)}
                  />
                  {showDropdown1 && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {all_department.map((type, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedDepartment({ id: type.id, department_name: type.department_name, uni_id: type.uni_id });
                            setShowDropdown1(false);
                            setBranches(all_branches.filter((data) => data.dept_id === type.id));
                          }}
                        >
                          {type.department_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div ref={dropdownRef2} className='relative' >
                  <input
                    type='text'
                    value={selected_branch.branch_name}
                    onChange={(e) => setSelectedBranch({ ...selected_branch, branch_name: e.target.value })}
                    placeholder='Branch'
                    onFocus={() => setShowDropdown2(true)}
                  />
                  {showDropdown2 && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {branches.map((type, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSelectedBranch({ id: type.id, branch_name: type.branch_name, dept_id: type.dept_id, dept_name: type.dept_name });
                            setShowDropdown2(false);
                            setOneClass({ ...one_class, branch_id: type.id });
                          }}
                        >
                          {type.branch_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  id="data"
                  type="text"
                  value={one_class.total_batches}
                  placeholder='Enter Total Batches'
                  onChange={(e) => setOneClass({ ...one_class, total_batches: Number(e.target.value) })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="text"
                  value={one_class.students_per_batch}
                  placeholder='Enter Student per batch'
                  onChange={(e) => setOneClass({ ...one_class, students_per_batch: Number(e.target.value) })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div className="mt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Submit</button>

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
        )
        }

        <div className="grid grid-cols-3 w-full gap-5">
          {all_classes[0].id > 0 && all_classes !== null ? get_class_data : null}
        </div>

      </div>
    </>
  )
}

export default page
