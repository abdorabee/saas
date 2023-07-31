"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const SideBar = () => {
  return (
    <div
      className="space-y-4 py-4 flex flex-col
    h-full bg-[#111827] text-white "
    >
      <Link
        href="/dashboard"
        className="flex items-center 
      pl-3 mb-14"
      >
        <div className="relative w-8 h-8 mr-4">
          <Image fill alt="logo" src="/logo.png" />
        </div>
        <h1 className="text-2xl  font-sans font-bold">Nathan</h1>
      </Link>
    </div>
  );
};

export default SideBar;
