"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";

export default function Resource() {
  const [resource, setResource] = useState({
    name: "",
    type: "",
    duration: "",
    capacity: "",
  });
  const [resourceList, setResourceList] = useState<{ name: string; type: string; duration: string; capacity: string; }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const addResource = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (
      resource.name &&
      resource.type &&
      resource.duration &&
      resource.capacity
    ) {
      if (editingIndex !== null) {
        // Update resource
        const updatedResources = [...resourceList];
        updatedResources[editingIndex] = resource;
        setResourceList(updatedResources);
        setEditingIndex(null); // Reset edit mode
      } else {
        // Add new resource
        setResourceList((prev) => [...prev, resource]);
      }
      setResource({ name: "", type: "", duration: "", capacity: "" });
    } else {
      alert("Please fill in all fields");
    }
  };

  const deleteResource = (index: number) => {
    setResourceList((prev) => prev.filter((_, i) => i !== index));
  };

  const editResource = (index: number) => {
    const selectedResource = resourceList[index];
    setResource(selectedResource);
    setEditingIndex(index); // Set the index to enable edit mode
  };

  const saveAllResources = () => {
    // Simulate saving to the database
    console.log("Saving all resources to the database:", resourceList);
    alert("All resources saved to the database!");
    // Here you can make an API call to save the resources to your database
  };

  return (
    <div className=" h-screen flex flex-col items-center justify-center p-5">
      <div className="w-[90vw] max-w-3xl bg-white shadow-lg rounded-2xl px-10 py-6 space-y-6">
        {/* Resource form */}
        <div className="text-center font-bold text-2xl text-gray-900 mt-8">
          {editingIndex !== null ? "Edit Resource" : "Add New Resource"}
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            name="name"
            value={resource.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="type"
            value={resource.type}
            onChange={handleInputChange}
            placeholder="Type"
            className="border border-gray-300 p-3 text-black rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="duration"
            value={resource.duration}
            onChange={handleInputChange}
            placeholder="Duration"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            name="capacity"
            value={resource.capacity}
            onChange={handleInputChange}
            placeholder="Capacity"
            className="border border-gray-300 p-3 rounded-md text-black focus:outline-none focus:border-blue-500"
          />

          {resourceList.length > 0 && (
            <div className="text-center font-bold text-4xl text-gray-900 mb-4">
              Resource List
            </div>
          )}
          {/* Display list of resources in rows of 3 */}
          <div className="flex flex-wrap justify-start">
            {resourceList.map((res, index) => (
              <div
                key={index}
                className=" p-4 border border-gray-200 rounded-md flex  shadow-sm text-gray-700 m-1"
              >
                <div>
                  <p className="font-bold">{res.name}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="ml-2 text-gray-600 hover:text-yellow-500"
                    onClick={() => editResource(index)}
                  >
                    <LuPencil size={20} />
                  </button>
                  <button
                    className="ml-2 text-gray-600 hover:text-red-500"
                    onClick={() => deleteResource(index)}
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={addResource}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              {editingIndex !== null ? "Save Changes" : "Add Resource"}
            </button>
            <button
              onClick={saveAllResources}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-bold mt-4"
              type="button"
            >
              Save All Resources
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
