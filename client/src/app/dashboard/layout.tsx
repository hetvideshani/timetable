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

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <Image
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  return (
    <div className="main_body w-full h-[100vh] flex flex-col bg-white text-[#BBE1FA]">
      <div className=" bg-[#1B262C] ">
        <Header />
      </div>
      <div className="flex h-[100vh]">
        {/* <div className="flex-[0.20] flex flex-col p-2 text-xl ">
          <Link
            href="/dashboard/department"
            className="p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Departments
          </Link>
          <Link
            href="/dashboard/branch"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Branches
          </Link>
          <Link
            href="/dashboard/class"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Classes
          </Link>
          <Link
            href="/dashboard/semester"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Semesters
          </Link>
          <Link
            href="/dashboard/session"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75]"
          >
            Sessions
          </Link>
          <Link
            href="/dashboard/resource"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Resources
          </Link>
          <Link
            href="/dashboard/faculty"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Faculties
          </Link>
          <Link
            href="/dashboard/subject"
            className=" p-2 hover:rounded-md hover:bg-[#0F4C75] "
          >
            Subjects
          </Link>
        </div> */}


        <div className="flex flex-col items-center justify-center h-screen w-[15vw] ">
          {/* <FloatingDock
            desktopClassName="translate-x-0" // only for demo, remove for production
            items={links}
          /> */}
          <SidebarDemo />
        </div>
        <div className="flex-1 bg-white overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
export default DashboardLayout;
