"use client";
import Sidebar from "@widgets/(student)/Sidebar";
import Topbar from "@widgets/(student)/Topbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@lib/firebase"; // adjust if your firebase path is different
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        console.log("User:", currentUser);
        setUser(currentUser);
      } else {
        // User is signed out
           router.push("/");
        console.log("No user is signed in");
        setUser(null);
      }
    });

    return () => unsubscribe(); // cleanup the listener on unmount
  }, []);

  return (
    <div className="flex flex-row items-center w-full h-screen">
      <Sidebar />
      <div className="lg:pl-[15vw] pl-0 md:pl-[15vw] flex flex-col items-center justify-start w-full h-screen">
        <div className="w-full">
          <Topbar user={user} />
        </div>
        <div className="mt-[14vh] md:w-[85vw] w-full lg:w-[85vw] h-full lg:pl-[1vw] pl-0 md:pl-[1vw] overflow-y-auto pr-0 lg:pr-[1vw] md:pr-[1vw] pb-[2vh] px-[10vw] md:px-0">
          {children}
        </div>
      </div>
    </div>
  );
}
