"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import '../src/app/globals.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Email dan password wajib diisi!");
    }

    try {
      const res = await fetch("http://localhost:8000/api/fo/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        alert(data.message || "Login gagal!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-inter bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[360px]">
        <div className="relative flex items-center mb-6">
          <h1 className="text-4xl font-bold font-kreon">Login</h1><br /><br /><br /><br />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[14px] text-gray-700 font-inter">
              Email
            </label>
            <input
              type="email"
              className="border px-4 py-2 rounded-md font-inter w-[300px] mt-2 h-[40px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-[14px] text-gray-700 font-inter">
              Password
            </label>
            <input
              type="password"
              className="border px-4 py-2 rounded-md font-inter w-[300px] mt-2 h-[40px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="relative bg-[#03A9F4] text-white py-2 rounded-md font-inter mt-6 w-[300px] h-[40px]"
          >
            Login
          </button>
          <br />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
