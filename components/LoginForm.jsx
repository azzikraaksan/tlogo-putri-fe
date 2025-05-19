"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import '/src/app/globals.css';


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
  
    // if (token && role) {
    //   if (role === "Front Office") {
    //     router.push("/dashboard");
    //   } else if (role === "Admin") {
    //     router.push("/dashboard_admin");
    //   } else {
    //     router.push("/dashboard2");
    //   }
    // }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Email dan password wajib diisi!");
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log('Login response:', data)

      if (res.ok) {
        const token = data.access_token
        const role = data.role
        const now = new Date().getTime()
        const expireTime = now + 1 * 60 * 60 * 1000 

        localStorage.setItem('access_token', token)
        localStorage.setItem('token_exp', expireTime)
        localStorage.setItem('user_role', role)

        if (role === 'Front Office') {
          router.push('/dashboard')
        } else if (role === 'Admin') {
          router.push('/dashboard')
        } else if (role === 'Owner') {
          router.push('/dashboard/penggajian/penggajian-utama')
        } else if (role === 'Driver') {
          router.push('/dashboard')
        } else {
          router.push('/dashboard2')
        }
      } else {
        setError(data.message || 'Login gagal, cek email & password')
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-[url('/images/login.jpg')]">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">Loading...</p>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}

      <div className={`flex flex-col items-center justify-center min-h-screen ${loading ? "pointer-events-none" : ""}`}>
        <div className="bg-white p-8 rounded-lg shadow-xl w-[360px]"><br />
          <div className="relative flex items-center mb-6">
            <h1 className="text-4xl font-bold">Masuk</h1>
          </div><br />
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <label className="absolute -top-1 left-3 bg-white px-1 text-[14px] text-[#808080]">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="Masukkan Email"
                className="border px-4 py-2 rounded-[7px] w-[300px] mt-2 h-[50px] placeholder:font-normal placeholder:text-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label className="absolute -top-1 left-3 bg-white px-1 text-[14px] text-[#808080]">
                Kata Sandi
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan Kata Sandi"
                className="border px-4 py-2 rounded-[7px] w-[300px] mt-2 h-[50px] placeholder:font-normal placeholder:text-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="bg-[#03A9F4] text-white py-2 rounded-[7px] mt-6 w-[300px] h-[40px] cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Masuk"}
            </button><br /><br />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
