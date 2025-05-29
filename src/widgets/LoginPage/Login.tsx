"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async () => {
    setError("");
    try {
      setIsSigningIn(true);
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        router.push("/dashboard");
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="px-[5vw] py-[3rem]">
        <Image
          src={"/Carmelpoly.png"}
          width={1000}
          height={1000}
          className="w-[28rem]"
          alt="Logo"
        />
      </div>

      <div className="flex lg:flex-row md:flex-row flex-col items-center justify-center w-full">
        <div className="flex-[1.5] w-full flex items-center justify-center">
          <Image
            src={"/login.svg"}
            width={1000}
            height={1000}
            className="md:w-[28rem] w-[15rem]"
            alt="Login Illustration"
          />
        </div>

        <div className="flex-1 w-[10vw] flex flex-col items-start justify-center gap-4 px-[5vw] md:px-0">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold">Welcome!</span>
            <span className="text-gray-700">
              Sign in with your email and password.
            </span>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[20vw]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[20vw]"
          />

          <button
            disabled={isSigningIn}
            onClick={handleEmailSignIn}
            className={`w-[20vw] px-8 py-3 bg-primary-600 text-white rounded-md ${
              isSigningIn ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSigningIn ? "Signing in..." : "Login"}
          </button>

          {error && <span className="text-red-600">{error}</span>}

          <span className="text-sm text-gray-600">
            Secure sign-in with your registered credentials.
          </span>
        </div>
      </div>
    </div>
  );
}
