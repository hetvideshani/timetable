'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from 'react-icons/fa';

const page = () => {
  const [uni_id, setUni_id] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [all_branches, setAllBranches] = useState([{
    id: 0,
    branch_name: "",
    dept_id: 0,
    dept_name: ""
  }]);

  const [branch, setBranch] = useState<{
    id: number | null;
    branch_name: string;
    dept_id: number | null;
  }>({
    id: null,
    branch_name: "",
    dept_id: null,
  });

  const [dept_name, setDept_name] = useState('');
  const [department, setDepartment] = useState([{ id: 0, department_name: "", uni_id: 0 }]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    get_uni_id();
  }, [])

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
        customData = res.headers.get('uni_id');
        if (customData) {
          setUni_id(customData);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));

    await getBranch(customData);
    await department_data(customData);
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

  const department_data = async (id: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/department`);

    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setDepartment(data.data);
    } else {
      console.log('No data');
    }
  }

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (br: any) => {
    setIsModalOpen(true);
    setBranch({ ...branch, branch_name: br.branch_name, id: br.id, dept_id: br.dept_id });
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(branch);

      const url = branch.id === null ? `http://localhost:3000/api/university/${uni_id}/department/${branch.dept_id}/branch` :
        `http://localhost:3000/api/university/${uni_id}/department/${branch.dept_id}/branch/${branch.id}`;

      const method = branch.id === null ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branch),
      });
      const result = await response.json();
      console.log('Data successfully posted:', result);

      if (result.function_name === 'update_branch') {
        setAllBranches((prev: any) => prev.map((br: any) => br.id === branch.id ? { ...br, branch_name: branch.branch_name } : br));
      }

      if (result.function_name === 'create_branch') {
        setAllBranches((prev: any) => [...prev, result.data[0]]);
      }

      setIsModalOpen(false);
      setBranch({ id: null, branch_name: "", dept_id: null });
      router.refresh();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  const handle_delete = async (br: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/department/${br.dept_id}/branch/${br.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    if (data.status === 201) {
      console.log('Data successfully deleted:', data);
      setAllBranches(all_branches.filter((data) => data.id !== br.id));
      setBranch({ id: null, branch_name: "", dept_id: null });
      router.refresh();
    } else {
      console.error('Error deleting data:', data);
    }
  }

  const get_branch_data = all_branches.map((data, index) => {
    return (
      <div className='shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm' key={index} onClick={() => setBranch({ id: data.id, branch_name: data.branch_name, dept_id: data.dept_id })}>
        <p className=' text-lg text-slate-900'>{data.id}</p>
        <p className=' text-2xl text-slate-950'>{data.branch_name}</p>
        <p className=' text-xl text-slate-950'>Department - {data.dept_name}</p>
        <div className='flex gap-1 mt-5'>
          <button onClick={(e) => { handle_edit(data); }} className='bg-green-600 px-3 py-1 rounded-md'><LuPencil size={20} className=' text-white '></LuPencil></button>
          <button onClick={(e) => { handle_delete(data) }} className='bg-red-600 px-3 py-1 rounded-md'><IoClose size={20} className=' text-white'></IoClose></button>
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
            Branch
          </div>
          <button onClick={handle_insert} className='flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md'>
            <FaPlus></FaPlus> <div>New</div>
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Add New Branch</h2>

              <form onSubmit={handleSubmit}>
                <input
                  id="data"
                  type="text"
                  value={branch.branch_name}
                  placeholder='Enter Subject Name'
                  onChange={(e) => setBranch({ ...branch, branch_name: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <div ref={dropdownRef} className='relative' >
                  <input
                    type='text'
                    value={dept_name}
                    onChange={(e) => setDept_name(e.target.value)}
                    placeholder='Department'
                    onFocus={() => setShowDropdown(true)}

                  />
                  {showDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">

                      {department.map((type, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setBranch({ ...branch, dept_id: type.id });
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
        )}
        <div className="grid grid-cols-3 w-full gap-5">
          {all_branches.length > 1 ? get_branch_data : null}
        </div>
      </div>

    </>
  )
}

export default page;
