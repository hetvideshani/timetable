// src/app/dashboard/page.tsx
'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

const page = () => {
    const [data,SetData] = useState('');

    useEffect(()=>{
      fetch(window.location.href)
      .then((res) => {
        const customData = res.headers.get('useremail');
        console.log(customData);
        
        if (customData) {
          SetData(customData);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));

      console.log(data);
      
    },[])

    return (
      <div>
        <div className="main_body w-full flex">
          <div className="side_bar w-1/4 flex flex-col gap-3 text-xl items-center h-screen">
            <div className="header p-5 flex justify-center items-center font-extrabold ">
              <Link href="/dashboard" className="text-2xl font-serif">EduScheduler</Link>
            </div>
            <button className="bg-white text-slate-950 p-3 flex gap-3 rounded-md justify-center items-center text-sm font-bold">
              <div className="text-2xl">👤</div>
              <div className="flex flex-col gap-0 items-start">
                <div>Welcome, {data}</div>
                <div className="text-xs text-blue-600 underline">Edit your profile</div>
              </div>
            </button>
            <div className="flex flex-col gap-3 w-full ps-10 mt-5 text-lg font-bold">
              <Link href="/dash_components/department" className="">Departments</Link>
              <Link href="/dash_components/branch" className="">Branches</Link>
              <Link href="/dash_components/class" className="">Classes</Link>
              <Link href="/dash_components/semester" className="">Semesters</Link>
              <Link href="/dash_components/resource" className="">Resources</Link>
              <Link href="/dash_components/faculty" className="">Faculties</Link>
              <Link href="/dash_components/subject" className="">Subjects</Link>
            </div>
          </div>
            <div className="main_content bg-white text-black w-full">
              <nav className="header p-5 font-bold w-full shadow-lg flex justify-end">
                
                <div className="flex gap-5 text-lg items-center">
                  <Link href="/dashboard" className="hover:text-xl hover:text-blue-300 cursor-pointer">Home</Link>
                  <Link href="/dashboard" className="hover:text-xl hover:text-blue-300 cursor-pointer">About</Link>
                  <button className="hover:text-xl hover:text-blue-300 cursor-pointer">Logout</button>
                </div>
              </nav>
            </div>
        </div>
      </div>
    );
  };
  
  export default page;
  