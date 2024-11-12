"use client";
import Link from "next/link";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    university: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const signUp = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (user.username && user.university && user.email && user.password) {
      await fetch("http://localhost:3000/api/admin/signup", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        })
        .catch(() => {
          toast.error("An error occurred. Please try again.");
        });
    } else {
      toast.warn("Please fill in all fields");
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex w-[90vw] max-w-4xl bg-white shadow-lg justify-around items-center rounded-2xl p-10 space-x-6">
        <div className="flex-[0.4] flex justify-center flex-col items-center">
          <div className="mb-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 mt-2">Create a new account</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-6 w-full">
            Sign up with Google
          </button>
          <div className="text-gray-600 mt-4">
            Already have an account?&nbsp;
            <Link
              href="/forms/signin"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="flex-[0.6] flex justify-center flex-col items-center">
          <input
            type="text"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500 text-black"
            placeholder="Username"
            name="username"
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500 text-black"
            placeholder="University Name"
            name="university"
            onChange={handleInputChange}
          />
          <input
            type="email"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500 text-black"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
          />
          <input
            type="password"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500 text-black"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
          />

          <button
            className="bg-gray-700 hover:bg-gray-800 text-white py-3 w-[80%] rounded-md mt-4"
            onClick={signUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
