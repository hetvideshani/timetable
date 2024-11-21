"use client"
import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { error } from 'console';

const page = () => {

  const [uni_id, setUni_id] = useState('');
  const [resource_id, setResource_id] = useState(0);
  const [resource, setResource] = useState([{
    id: 0,
    resource_name: "",
    resource_type: "",
    capacity: 0,
    duration: 0
  }])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    resource_name: "",
    resource_type: "",
    capacity: 0,
    duration: 0
  })
  const router = useRouter();

  useEffect(() => {
    get_uni_id();
  }, [])

  const get_uni_id = async () => {
    let customData;
    await fetch(window.location.href)
     .then((res) => {
        customData = res.headers.get("uni_id");
        if (customData) {
          setUni_id(customData);
        }
      }).catch((error) => console.error(error));

      await getResource(customData)
  }

  const getResource = async (id:any) => {
    const response = await fetch(`http://localhost:3000/api/university/${id}/resource`)
    const data = await response.json();

    if(Array.isArray(data.data)) {
      setResource(data.data)
    }
    else {
      setResource([])
    }
  }

  const handle_delete = async (res_id:any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/university/${uni_id}/resource/${res_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if(data.status === 201) {
        console.log("Resource deleted successfully")
        setResource(resource.filter((res) => res.id !== res_id))
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handle_edit = (resource_name:any, resource_type:any, capacity:any, duration:any) => {
    setIsModalOpen(true)
    setInputData({resource_name, resource_type, capacity, duration})
  }

  const handle_insert = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const url = resource_id === 0 ? `http://localhost:3000/api/university/${uni_id}/resource` :
        `http://localhost:3000/api/university/${uni_id}/resource/${resource_id}`;

      const method = resource_id === 0? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resource_name: inputData.resource_name,
          resource_type: inputData.resource_type,
          capacity: inputData.capacity,
          duration: inputData.duration
        })
      })
      const data = await response.json();
      
      if (data.function_name === 'update_faculty') {
        setResource((prev: any) =>
          prev.map((res: any) => 
            res.id === resource_id 
              ? { ...res, resource_name: inputData.resource_name, resource_type: inputData.resource_type, capacity: inputData.capacity, duration: inputData.duration} 
              : res
          )
        )
      }

      if (data.function_name === 'create_faculty') {
        setResource((prev) => [
          ...prev, data.data[0]
        ]);
      }

      setIsModalOpen(false);
      setInputData({
        resource_name: "",
        resource_type: "",
        capacity: 0,
        duration: 0
      });
      setResource_id(0);
      router.refresh();
      
    } catch (error) {
      console.error(error);
    }
  }

  const get_res_data = resource.map((data,index) => {
    return (
      <div className='shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm' key={index}>
        <p className=' text-2xl text-slate-950'>{data.resource_name}</p>
        <p className=' text-2xl text-slate-950'>{data.resource_type}</p>
        <p className=' text-2xl text-slate-950'>Duration : {data.duration}</p>
        <p className=' text-2xl text-slate-950'>Capacity : {data.capacity}</p>
        <div className='flex gap-1 mt-5'>
          <button onClick={(e) => {
            handle_edit(data.resource_name, data.resource_type, data.duration, data.capacity);
            setResource_id(data.id)
          }
          } className='bg-green-600 px-3 py-1 rounded-md'><LuPencil size={20} className=' text-white '>

            </LuPencil>
          </button>
          <button onClick={(e) => { handle_delete(data.id) }} className='bg-red-600 px-3 py-1 rounded-md'><IoClose size={20} className=' text-white'></IoClose></button>
        </div>
      </div>
    )
  })

  return (
    <div className='flex flex-col gap-6 justify-center items-center p-5 w-full'>
      <div className='flex justify-between w-full'>
        <div>

        </div>
        <div className='text-3xl font-bold text-slate-950'>
          Resource
        </div>
        <button onClick={handle_insert} className='flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md'
        >
          <FaPlus></FaPlus> <div>New</div>
        </button>

        {isModalOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-gray-950">
              <h2 className="text-lg font-bold mb-4 ">Add New Resource</h2>

              <form onSubmit={handleSubmit}>
                <input
                  id="data"
                  type="text"
                  value={inputData.resource_name}
                  placeholder='Enter Resource Name'
                  onChange={(e) => setInputData({...inputData, resource_name: e.target.value})}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="text"
                  value={inputData.resource_type}
                  placeholder='Enter Resource Type'
                  onChange={(e) => setInputData({...inputData, resource_type: e.target.value})}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="number"
                  value={inputData.capacity? inputData.capacity : " "}
                  placeholder='Enter Capacity'
                  onChange={(e) => setInputData({...inputData, capacity: Number(e.target.value) })}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />

                <input
                  id="data"
                  type="number"
                  value={inputData.duration ? inputData.duration : ""}
                  placeholder='Enter Duration'
                  onChange={(e) => setInputData({...inputData, duration: Number(e.target.value) })}
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
        )}
      </div>
      <div className="grid grid-cols-3 w-full gap-5">
        {resource.length > 0 ? get_res_data : null}
      </div>
    </div>
  )
  
};

export default page;
