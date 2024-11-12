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
      <div></div>
    );
  };
  
  export default page;
  