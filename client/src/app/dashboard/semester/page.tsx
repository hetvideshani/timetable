'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from 'react-icons/fa';

const SemesterPage = () => {
  const [uni_id, setUni_id] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allSemesters, setAllSemesters] = useState([{
    id: 0,
    semester_name: "",
    branch_id: 0,
    branch_name: ""
  }]);

  const [semester, setSemester] = useState<{
    id: number | null;
    semester_name: string;
    branch_id: number | null;
  }>({
    id: null,
    semester_name: "",
    branch_id: null,
  });

  const [branch_name, setBranch_name] = useState('');
  const [branches, setBranches] = useState([{ id: 0, branch_name: "", uni_id: 0 }]);
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

    await getBranches(customData);
    await fetchSemesters(customData);
  }

  const getBranches = async (id: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/branch`);
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setBranches(data.data);
    } else {
      console.log('No branches found');
    }
  }

  const fetchSemesters = async (id: any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/semester`);
    const data = await response.json();
    if (Array.isArray(data.data)) {
      console.log(data.data);
      setAllSemesters(data.data);
    } else {
      console.log('No semesters found');
    }
  }

  const handle_insert = () => {
    setIsModalOpen(true);
  };

  const handle_edit = (sem: any) => {
    setIsModalOpen(true);
    setSemester({ ...semester, semester_name: sem.semester_name, id: sem.id, branch_id: sem.branch_id });
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log(semester);

      const url = semester.id === null ? `http://localhost:3000/api/university/${uni_id}/branch/${semester.branch_id}/semester` :
        `http://localhost:3000/api/university/${uni_id}/branch/${semester.branch_id}/semester/${semester.id}`;

      const method = semester.id === null ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(semester),
      });
      const result = await response.json();
      console.log('Data successfully posted:', result);

      if (result.function_name === 'update_semester') {
        setAllSemesters((prev) => prev.map((sem) => sem.id === semester.id ? { ...sem, semester_name: semester.semester_name } : sem));
      }

      if (result.function_name === 'create_semester') {
        setAllSemesters((prev) => [...prev, result.data[0]]);
      }

      setIsModalOpen(false);
      setSemester({ id: null, semester_name: "", branch_id: null });
      router.refresh();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  const handle_delete = async (sem: any) => {
    const response = await fetch(
      `http://localhost:3000/api/university/${uni_id}/branch/${sem.branch_id}/semester/${sem.id}`,
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
      setAllSemesters(allSemesters.filter((data) => data.id !== sem.id));
      setSemester({ id: null, semester_name: "", branch_id: null });
      router.refresh();
    } else {
      console.error('Error deleting data:', data);
    }
  }

  const renderSemesters = allSemesters.map((data, index) => (
    <div key={index} className='shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm'>
      <p className=' text-lg text-slate-900'>{data.id}</p>
      <p className=' text-2xl text-slate-950'>{data.semester_name}</p>
      <p className=' text-xl text-slate-950'>Branch - {data.branch_name}</p>
      <div className='flex gap-1 mt-5'>
        <button onClick={() => handle_edit(data)} className='bg-green-600 px-3 py-1 rounded-md'><LuPencil size={20} className=' text-white '></LuPencil></button>
        <button onClick={() => handle_delete(data)} className='bg-red-600 px-3 py-1 rounded-md'><IoClose size={20} className=' text-white'></IoClose></button>
      </div>
    </div>
  ))

  return (
    <>
      <div className='flex flex-col gap-6 justify-center items-center p-5 w-full'>
        <div className='flex justify-between w-full'>
          <div className='text-3xl font-bold text-slate-950'>
            Semester
          </div>
          <button onClick={handle_insert} className='flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md'>
            <FaPlus /> <div>New</div>
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Add New Semester</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={semester.semester_name}
                  placeholder='Enter Semester Name'
                  onChange={(e) => setSemester({ ...semester, semester_name: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <div ref={dropdownRef} className='relative'>
                  <input
                    type='text'
                    value={branch_name}
                    onChange={(e) => setBranch_name(e.target.value)}
                    placeholder='Branch'
                    onFocus={() => setShowDropdown(true)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                  {showDropdown && (
                    <div className="relative top-full left-0 bg-white border-gray-300 rounded-md shadow-md mt-1 w-full">
                      {branches.map((branch, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                          onClick={() => {
                            setSemester({ ...semester, branch_id: branch.id });
                            setBranch_name(branch.branch_name);
                            setShowDropdown(false);
                          }}
                        >
                          {branch.branch_name}
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
        <div className='grid grid-cols-3 gap-3 w-full'>
          {renderSemesters}
        </div>
      </div>
    </>
  )
}

export default SemesterPage;
