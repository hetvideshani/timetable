import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconUserCircle } from "@tabler/icons-react";
const Header = () => {
  return (
    <div className="flex justify-between items-center mx-3 my-1">
      {/* <div className="text-3xl font-bold">EduScheduler</div> */}
      <Image src="/logo.png" alt="EduScheduler" width={100} height={100} className="w-32 ms-5" />

      <div className="flex gap-10 mx-2">
        <div>
          {/* <Image src="/globe.svg" alt="Logout" width={30} height={30} /> */}
          <IconUserCircle size={35} className="text-[#bbe1fa]"></IconUserCircle>
        </div>
      </div>
    </div>
  );
};

export default Header;
