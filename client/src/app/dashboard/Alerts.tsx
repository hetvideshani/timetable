import React, { useState } from 'react'
import { FaDiagramSuccessor } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { IconError404 } from '@tabler/icons-react';

const Alerts = ({ status, function_name, isModalOpen }: { status: number; function_name: string; isModalOpen: boolean }) => {
    const [model, setModel] = useState(isModalOpen);
  
    function_name = function_name.split("_")[0];
  
    return (
      <div className={`fixed inset-0 flex items-start justify-center z-50 ${model ? 'backdrop-blur-sm bg-black/50' : 'hidden'}`}>
        <div className="mt-10 w-11/12 max-w-md p-6 rounded-lg bg-white shadow-lg flex flex-col gap-4 animate-fade-down">

          <div className="flex justify-end">
            <IoClose
              onClick={() => setModel(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer w-5 h-5"
            />
          </div>
  

          <div className="flex flex-col items-center">
            {status === 201 && (function_name === 'create' || function_name === 'update' || function_name === 'delete') ? (
              <>
                <FaDiagramSuccessor className="text-green-500 w-12 h-12" />
                <div className="text-center font-medium text-gray-800">
                  Data {function_name}d Successfully!
                </div>
              </>
            ) : status === 1 ? (
              <>
                <div className="text-center font-medium text-gray-800">
                  Do you want to remove this item?
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => setModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Yes
                  </button>
                </div>
              </>
            ) : (
              <>
                <IconError404 className="text-red-500 w-12 h-12" />
                <div className="text-center font-medium text-gray-800">
                  Error {function_name}ing the data!
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Alerts;
  
