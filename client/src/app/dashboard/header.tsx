import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center m-5 ">
      <div className="text-3xl font-bold">EduScheduler</div>

      <div className="flex gap-10 text-xl mx-2">
        <Link href="/dashboard" className="hover:font-semibold duration-150">
          Home
        </Link>

        <Link href="/dashboard" className="hover:font-semibold hover:scale-105 duration-150">
          About
        </Link>
        <div>
          <Image src="/globe.svg" alt="Logout" width={30} height={30} />
        </div>
      </div>
    </div>
  );
};

export default Header;
