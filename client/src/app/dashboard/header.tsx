import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className=" flex justify-between items-center m-5">
      <div className="text-4xl font-bold">EduScheduler</div>

      <div className="flex gap-10 text-2xl mx-2">
        <Link href="/dashboard" className="hover:underline">
          Home
        </Link>

        <div>About</div>
        <div>
          <Image src="/globe.svg" alt="Logout" width={30} height={30} />
        </div>
      </div>
    </div>
  );
};

export default Header;
