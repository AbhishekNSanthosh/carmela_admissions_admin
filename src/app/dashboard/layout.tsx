"use client";

import Sidebar from "@widgets/(admin)/Sidebar";
import Topbar from "@widgets/(admin)/Topbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "@lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import easyToast from "@components/CustomToast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.log("🚫 No user logged in");
        setUser(null);
        router.push("/");
        return;
      }

      console.log("✅ Firebase Auth user:", currentUser);
      const uid = currentUser.uid;

      try {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const snapshot = await getDocs(q);
        console.log("📂 Firestore snapshot empty?", snapshot.empty);

        if (snapshot.empty) {
          await auth.signOut();
          setUser(null);
          router.push("/");
          easyToast({
            message: "Access denied: User not found",
            type: "error",
          });
          return;
        }

        const userFireStoreData = snapshot.docs[0].data();
        setUserData(userFireStoreData);
        console.log("👤 Firestore user data:", userData);

        if (userFireStoreData.admin === true) {
          setUser(currentUser);
          console.log("✅ Admin access granted");
        } else {
          await auth.signOut();
          setUser(null);
          router.push("/");
          easyToast({
            message: "Access denied: Not an admin",
            type: "error",
          });
        }
      } catch (err) {
        console.error("🔥 Error checking admin access:", err);
        setUser(null);
        router.push("/");
        easyToast({
          message: "Something went wrong. Try again later.",
          type: "error",
        });
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  console.log("User data=>", user);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center w-full h-screen">
      <Sidebar />
      <div className="lg:pl-[15vw] pl-0 md:pl-[15vw] flex flex-col items-center justify-start w-full h-screen">
        <div className="w-full">
          <Topbar user={userData} />
        </div>
        <div className="mt-[14vh] md:w-[85vw] w-full lg:w-[85vw] h-full lg:pl-[1vw] pl-0 md:pl-[1vw] overflow-y-auto pr-0 lg:pr-[1vw] md:pr-[1vw] pb-[2vh] px-[10vw] md:px-0">
          {children}
        </div>
      </div>
    </div>
  );
}
