// src/app/dashboard/page.tsx

import Link from "next/link";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="main_body w-full flex">
        <div className="side_bar w-1/4 flex flex-col gap-3 text-xl items-center h-screen">
          <div className="header p-5 flex justify-center items-center mt-5 font-extrabold shadow-md">
            <Link href="/dashboard" className="text-3xl font-serif ">
              EduScheduler
            </Link>
          </div>
          <div className="flex flex-col gap-3 w-full ps-10 mt-2 text-lg font-bold">
            <Link href="/dashboard/department" className="">
              Departments
            </Link>
            <Link href="/dashboard/branch" className="">
              Branches
            </Link>
            <Link href="/dashboard/class" className="">
              Classes
            </Link>
            <Link href="/dashboard/semester" className="">
              Semesters
            </Link>
            <Link href="/dashboard/session" className="">
              Sessions
            </Link>
            <Link href="/dashboard/resource" className="">
              Resources
            </Link>
            <Link href="/dashboard/faculty" className="">
              Faculties
            </Link>
            <Link href="/dashboard/subject" className="">
              Subjects
            </Link>
          </div>
        </div>
        <div className="main_content bg-white text-black w-full">
          <nav className="header p-5 font-bold w-full shadow-lg flex justify-end">
            <div className="flex gap-5 text-lg items-center">
              <Link
                href="/dashboard"
                className="hover:text-slate-600 cursor-pointer"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-slate-600 cursor-pointer"
              >
                About
              </Link>
              <button className="hover:text-slate-600 cursor-pointer">
                Logout
              </button>
            </div>
          </nav>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
