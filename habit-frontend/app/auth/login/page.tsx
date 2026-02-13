"use client";

import { useState } from "react";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post(API.AUTH.LOGIN, {
        email,
        password,
      });
      
      //save user to redux
      dispatch(setUser(res.data.user));

      router.push("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border w-full p-2 mb-4 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (<p className="text-red-500 text-sm mb-3">{error}</p>)}
        
         <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
    
      </div>
    </div>
  );
}
