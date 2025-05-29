"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BsGrid3X3Gap } from "react-icons/bs";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { IoIosApps } from "react-icons/io";
import { MdScheduleSend } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { getAuth, signOut } from "firebase/auth";
import easyToast from "@components/CustomToast";

export default function Topbar({ user }: { user: any }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = usePathname();
  const router = useRouter();
  const isLoading = user === null;
  const displayName = user?.displayName || "User";
  const photoURL = user?.photoURL;

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

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
    <>
      <div className="w-full md:w-[85vw] lg:w-[85vw] h-[12vh] bg-white fixed flex items-center justify-between md:px-8 px-[5vw] lg:px-8 border border-b-gray-200">
        {/* Left side - Welcome message */}
        <div className="text-lg font-semibold text-primary-600 hidden md:flex lg:flex">
          {isLoading ? (
            <div className="animate-pulse w-[12rem] h-6 bg-gray-400 rounded-md" />
          ) : (
            `Welcome, ${displayName}👋`
          )}
        </div>
        <div
          className="lg:hidden md:hidden flex"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <BsGrid3X3Gap className="text-2xl text-primary-600" />
        </div>

        <div className="lg:hidden md:hidden flex">
          <Image
            src={"/Carmelpoly.png"}
            width={1000}
            height={1000}
            className="w-[14rem]"
            alt=""
          />
        </div>

        {/* Right side - Profile picture */}
        <div>
          {isLoading ? (
            <div className="animate-pulse lg:w-[45px] lg:h-[45px] w-[25px] h-[25px] rounded-full bg-gray-400" />
          ) : photoURL ? (
            <div className="border-[2px] border-primary-600 rounded-full p-[2.3px] flex items-center justify-center">
              <Image
                src={photoURL}
                alt="Profile"
                width={1000}
                draggable={false}
                height={1000}
                className="rounded-full object-cover lg:w-[45px] lg:h-[45px] w-[35px] h-[35px]"
                onError={(e) => {
                  // Optional: handle broken image URL
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-[45px] h-[45px] rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
            isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer Content */}
        <div className="absolute left-0 top-0 h-full w-[80%] sm:w-[60%] bg-white shadow-lg">
          <div className="flex justify-between items-center mb-6  px-6 pt-6">
            <span className="text-lg font-bold text-gray-700">Dashboard</span>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
          <div className="text-sm font-semibold text-primary-600 flex md:hidden  px-6">
            {isLoading ? (
              <div className="animate-pulse w-[12rem] h-6 bg-gray-400 rounded-md" />
            ) : (
              `Welcome, ${displayName}👋`
            )}
          </div>
          <div className="mt-8 flex flex-col gap-5">
            {menuItems?.map((menuItem, index) => (
              <Link
                className={`flex text-gray-700 flex-row items-center gap-2 text-2xl py-2 hoverColor relative w-full px-6 ${
                  location?.includes(menuItem?.link) &&
                  "bg-primary-100 text-primary-600 font-medium"
                }`}
                key={index}
                href={menuItem?.link}
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                {location === menuItem?.link && (
                  <div className="h-full w-2 rounded-r-[20px] absolute left-[-1px] top-0 bg-primary-600"></div>
                )}
                <div className="flex mt-[-3px]">{menuItem?.icon}</div>
                <span className="text-[1.1rem]">{menuItem?.title}</span>
              </Link>
            ))}
          </div>
          <div className="py-2 flex flex-col px-[2vw] lg:flex-row w-full items-center justify-center absolute bottom-16 self-center">
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
          <div className="py-2 flex flex-col lg:flex-row w-full items-center justify-center absolute bottom-3 self-center">
            <div className="flex-1 flex items-center justify-between font-semibold text-sm text-gray-700">
              <span className="">2025 © Carmel Polytechnic Admissions</span>
            </div>
            <div className="flex-1 flex items-center lg:justify-end text-sm font-semibold text-gray-700">
              All rights reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
