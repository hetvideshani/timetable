// src/app/dashboard/page.tsx

import Link from "next/link";
import Header from "./header";
import { FloatingDock } from "@/app/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { SidebarDemo } from "../components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="main_body w-full flex flex-col bg-slate-200 ">
      <div className=" bg-[#1B262C] ">
        <Header />
      </div>
      <div className="flex h-[100vh]">
        <div className="flex flex-col items-center justify-center h-screen ">
          <SidebarDemo />
        </div>
        <div className="flex-1 overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
};
export default DashboardLayout;
