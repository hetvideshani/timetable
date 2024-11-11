import React from 'react'

export default function page() {
  return (
    <div className='w-screen p-10 flex justify-center items-center'>
        <div className='w-4/5 drop-shadow-lg shadow-lg flex justify-center bg-[#FFFFFF] text-[#070F2B] p-10 rounded-md'>
            <div className='flex flex-col gap-5 w-full font-bold text-xl'>
                <div className='text-center font-bold text-4xl'>Resource</div>
                <div className='flex flex-col gap-2'>
                    <label>Name</label>
                    <input type="text" name="" id="" className='indent-2 p-1 border-[#070F2B] rounded-md outline focus:outline-2'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Type</label>
                    <input type="text" name="" id="" className='indent-2 p-1 border-[#070F2B] rounded-md outline focus:outline-2'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Duration</label>
                    <input type="text" name="" id="" className='indent-2 p-1 border-[#070F2B] rounded-md outline focus:outline-2'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Capacity</label>
                    <input type="number" name="" id="" className='indent-2 p-1 border-[#070F2B] rounded-md outline focus:outline-2'/>
                </div>
                <div className='flex justify-center gap-5 mt-10'>
                    <button className='bg-[#070F2B] text-white font-bold py-2 px-7 rounded-lg'>Create</button>
                    <button className='bg-red-800 text-white font-bold py-2 px-7 rounded-lg'>Cancel</button>
                </div>
            </div>
        </div>
    </div>
  )
}
