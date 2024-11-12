"use client"
import React, { useEffect, useState } from 'react'

const page = () => {
  
  const [department, setDepartment] = useState('');
  
  useEffect(()=>{
    getDepartment()
  },[])

  const getDepartment = async () => {
    // const userHeaders = await headers();
    // const userEmail = userHeaders.get('useremail');
    // console.log(userEmail);
    
  }

  return (
    <div>
        
    </div>
  )
}

export default page;