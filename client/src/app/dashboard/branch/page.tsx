"use client"
import React, { useState } from 'react'

const page = () => {
  const [dept_id, setDept_id] = useState('')
  // setDept_id()
  const get_dept_data = async () => {
    await fetch(window.location.href);
    console.log(window.location.href);
  }
  
  return (
    <div>page</div>
  )
}

export default page;
