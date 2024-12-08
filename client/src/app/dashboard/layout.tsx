// src/app/dashboard/page.tsx

import Header from "./header";

import { SidebarDemo } from "../components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main_body w-full flex flex-col bg-[#FCF5ED] ">
      <div className=" shadow-lg text-[#1F1717]">
        <Header />
      </div>
      <div className="flex h-[100vh]">
        <div className="flex flex-col items-center justify-center h-screen ">
          <SidebarDemo />
        </div>
        <div className="flex-1 overflow-y-auto drop-shadow-md bg-[#FCF5ED]">
          {children}
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
