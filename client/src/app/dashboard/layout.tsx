// src/app/dashboard/page.tsx

import Link from "next/link";
import Header from "./header";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main_body w-full h-[100vh]  flex flex-col">
      <div className="border-b ">
        <Header />
      </div>
      <div className="flex h-[100vh]">
        <div className="flex-[0.25] flex flex-col p-8 text-2xl">
          <Link
            href="/dashboard/department"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Departments
          </Link>
          <Link
            href="/dashboard/branch"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Branches
          </Link>
          <Link
            href="/dashboard/class"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Classes
          </Link>
          <Link
            href="/dashboard/semester"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Semesters
          </Link>
          <Link
            href="/dashboard/session"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Sessions
          </Link>
          <Link
            href="/dashboard/resource"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Resources
          </Link>
          <Link
            href="/dashboard/faculty"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Faculties
          </Link>
          <Link
            href="/dashboard/subject"
            className=" p-2 hover:rounded-md hover:bg-blue-900 "
          >
            Subjects
          </Link>
        </div>

        <div className="flex-1 bg-white">{children}</div>
      </div>
    </div>
  );
};
export default DashboardLayout;
