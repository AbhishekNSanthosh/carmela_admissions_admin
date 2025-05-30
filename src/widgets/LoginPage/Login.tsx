"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "@lib/firebase";
import { useRouter } from "next/navigation";
import easyToast from "@components/CustomToast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      easyToast({
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    try {
      setIsSigningIn(true);
      const auth = getAuth(app);
      const db = getFirestore(app);

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Check if user exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userCredential.user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await auth.signOut();
        throw new Error("Access denied. User not found in database.");
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Verify admin status
      if (userData.admin !== true) {
        await auth.signOut();
        throw new Error("Access denied. You are not an admin.");
      }

      // Successful login
      easyToast({
        message: "Login successful!",
        type: "success",
      });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";

      // Firebase Auth error codes
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later.";
          break;
        default:
          // Handle custom errors from our logic
          if (error.message) {
            errorMessage = error.message;
          }
      }

      setError(errorMessage);
      easyToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Check if user is admin
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            if (userData.admin === true) {
              router.push("/dashboard");
              return;
            }
          }
          // If not admin or not found, sign out
          await auth.signOut();
        } catch (err) {
          console.error("Auth state check error:", err);
        }
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
      <div className="px-[5vw] py-[3rem]">
        <Image
          src="/Carmelpoly.png"
          width={1000}
          height={1000}
          className="w-[28rem]"
          alt="Logo"
          priority
        />
      </div>

      <div className="flex lg:flex-row md:flex-row flex-col items-center justify-center w-full max-w-6xl mx-auto">
        <div className="flex-[1.5] w-full flex items-center justify-center">
          <Image
            src="/login.svg"
            width={1000}
            height={1000}
            className="md:w-[28rem] w-[15rem]"
            alt="Login Illustration"
            priority
          />
        </div>

        <div className="flex-1 w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
              <p className="text-gray-600 mt-2">
                Sign in to access the dashboard
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors ${
                isSigningIn ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSigningIn ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
}