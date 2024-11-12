"use client"
import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import { FaPlus } from 'react-icons/fa';

const page = () => {

  const [uni_id, setUni_id] = useState('');
  const [subject_id, setSubject_id] = useState('');
  const [subject, setSubject] = useState([{
    id:0,
    subject_name:'',
    uni_id:0
  }]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState('');

  useEffect(()=>{
    get_uni_id();
  },[])

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
        
        await getSubject(customData);
    }

    const getSubject = async (id:any) => {    
      const response = await fetch(`http://localhost:3000/api/university/${id}/subject`);

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setSubject(data.data);
      } else {
        setSubject([]); 
      }
    }

    const handle_delete = async (sub_id:any) => {
      const response = await fetch(`http://localhost:3000/api/university/${uni_id}/subject/${sub_id}`, {
        method: 'DELETE',
      });
  
      window.location.href = '/dashboard/subject'
    }

    const handle_insert = () => {
      setIsModalOpen(true);
    };
  
    const handle_edit = (sub_name:any) => {
      setIsModalOpen(true);
      setInputData(sub_name);
    }

    const handleSubmit = async (e:any) => {
      e.preventDefault();
      try {
        const url = subject_id == '' ? `http://localhost:3000/api/university/${uni_id}/subject` :
        `http://localhost:3000/api/university/${uni_id}/subject/${subject_id}`;
  
        const method = subject_id == '' ? 'POST' : 'PUT';
        
        const response =  await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject_name : inputData }),
        });
        const result = await response.json();
        console.log('Data successfully posted:', result);
  
        setIsModalOpen(false);
        setInputData('');
        window.location.href = '/dashboard/subject'
      } catch (error) {
        console.error('Error posting data:', error);
      }
    };

    const get_sub_data = subject.map((data) =>{
      return (
          <div className='shadow-md hover:bg-slate-100 flex flex-col justify-center items-center w-full p-5 gap-0 font-bold rounded-sm'>
            <p className=' text-lg text-slate-900'>{data.id}</p>
            <p className=' text-2xl text-slate-950'>{data.subject_name}</p>
            <div className='flex gap-1 mt-5'>
              <button onClick={(e) => {handle_edit(data.subject_name); setSubject_id(`${data.id}`)}} className='bg-green-600 px-3 py-1 rounded-md'><LuPencil size={20} className=' text-white '></LuPencil></button>
              <button onClick={(e) => {handle_delete(data.id)}} className='bg-red-600 px-3 py-1 rounded-md'><IoClose size={20} className=' text-white'></IoClose></button>
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
          Subject
        </div>
        <button onClick={handle_insert} className='flex gap-1 justify-center items-center text-xl bg-blue-600 py-1 px-3 text-white rounded-md'>
          <FaPlus></FaPlus> <div>New</div>
        </button>

        {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add New Subject</h2>

            <form onSubmit={handleSubmit}>
              <input
                id="data"
                type="text"
                value={inputData}
                placeholder='Enter Subject Name'
                onChange={(e) => setInputData(e.target.value)} 
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
          {subject.length > 0 ? get_sub_data : <div></div>}
        </div>
    </div>
  )
}

export default page;
