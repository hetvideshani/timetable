"use client"
import React, { useEffect, useState } from 'react'

const page = () => {
  const [uni_id, setUni_id] = useState('');
  const [department, setDepartment] = useState([{
    id:null,
    department_name:'',
    uni_id:null
  }]);
  const [loading, setLoading] = useState(true);
  
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
      
      await getDepartment(customData);
  }

  const getDepartment = async (id:any) => {    
    const response = await fetch(`http://localhost:3000/api/university/${id}/department`);

    const data = await response.json();
    setDepartment(data.data);
    setLoading(false);
  }

  return (
    <div className='w-sc'>
        <div>
          {
            loading? 'Loading...' : (department.map((item, index) => (
              <div key={index}>
                <p>Department Name: {item.department_name}</p>
              </div>
            )))
          }
        </div>
    </div>
  )
}

export default page;