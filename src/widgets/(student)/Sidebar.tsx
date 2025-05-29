"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { IoIosApps } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdScheduleSend } from "react-icons/md";
import { getAuth, signOut } from "firebase/auth";
import easyToast from "@components/CustomToast";

export default function Sidebar() {
  const location = usePathname();
  const router = useRouter();
  const menuItems = [
    {
      title: "Home",
      link: "/dashboard/home",
      icon: <FaHome className="text-[22px]" />,
    },
    {
      title: "Application",
      link: "/dashboard/application",
      icon: <IoIosApps className="text-[22px]" />,
    },
    // {
    //   title: "Drafts",
    //   link: "/dashboard/drafts",
    //   icon: <MdScheduleSend className="text-[22px]" />,
    // },
  ];

  return (
    <div className="w-[15vw] h-screen fixed border bg-white border-r-gray-200 md:flex lg:flex lg:flex-col md:flex-col hidden">
      <div className="px-[1vw] py-[2vh]">
        <Image
          src={"/logo.png"}
          alt="Profile"
          width={1000}
          height={1000}
          className="object-cover"
          onError={(e) => {
            // Optional: handle broken image URL
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="mt-[5vh] w-full flex flex-col gap-1">
        {menuItems?.map((menuItem, index) => (
          <Link
            className={`flex text-gray-700 flex-row items-center gap-2 text-2xl py-2 hoverColor relative w-full px-[2vw] ${
              location?.includes(menuItem?.link) &&
              "bg-primary-100 text-primary-600 font-medium"
            }`}
            key={index}
            href={menuItem?.link}
          >
            {location === menuItem?.link && (
              <div className="h-full w-2 rounded-r-[20px] absolute left-[-1px] top-0 bg-primary-600"></div>
            )}
            <div className="flex mt-[-3px]">{menuItem?.icon}</div>
            <span className="text-[1.1rem]">{menuItem?.title}</span>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-5 flex items-center justify-center w-full px-[1vw]">
        <button
          onClick={() => {
            const auth = getAuth();
            signOut(auth)
              .then(() => {
                router.push("/");
                console.log("User signed out");
                easyToast({
                      message: "Logout Successful",
                      type: "success",
                    });
                // Optionally redirect or show a message
              })
              .catch((error) => {
                console.error("Error signing out:", error);
              });
          }}
          className="flex items-center justify-center w-full py-3 text-red-600 font-medium gap-2 rounded-[10px] bg-red-100"
        >
          <BiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}
