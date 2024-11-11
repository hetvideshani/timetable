import Link from "next/link";
import React from "react";

export default function SignUp() {
  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
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
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Username"
          />
          <input
            type="text"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500"
            placeholder="University Name"
          />
          <input
            type="email"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Email"
          />
          <input
            type="password"
            className="border border-gray-300 p-3 text-lg my-3 w-[80%] rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Password"
          />

          <button className="bg-gray-700 hover:bg-gray-800 text-white py-3 w-[80%] rounded-md mt-4">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
