"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { setUser } from "@/store/authSlice";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // one handler for all inputs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post(API.AUTH.REGISTER, formData);

      // save user in redux
      dispatch(setUser(res.data.user));

      router.push("/auth/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />

        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />

        <input
          className="border w-full p-2 mb-4 rounded"
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleRegister}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          Sign Up
        </button>

      </div>
    </div>
  );
}