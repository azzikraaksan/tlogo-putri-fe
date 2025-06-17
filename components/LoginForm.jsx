"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";
import "/src/app/globals.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://tpapi.siunjaya.id/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.access_token;
        const role = data.role;
        const now = new Date().getTime();
        const expireTime = now + 1 * 60 * 60 * 1000;

        localStorage.setItem("access_token", token);
        localStorage.setItem("token_exp", expireTime);
        localStorage.setItem("user_role", role);

        if (role === "Front Office") {
          router.push("/dashboard");
        } else {
          alert("Akses ditolak.");
          localStorage.removeItem("access_token");
          router.push("/login");
        }
      } else {
        setError(data.message || "Email atau password Anda salah");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center bg-[url('/images/login2.jpg')]">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div
        className={`relative flex flex-col items-center justify-center min-h-screen ${loading ? "pointer-events-none" : ""}`}
      >
        <div className="bg-white p-8 rounded-lg shadow-xl w-[360px]">
          <div className="relative flex items-center mb-12 mt-6">
            <h1 className="text-4xl font-bold">Masuk</h1>
          </div>

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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan Kata Sandi"
                className="border px-4 py-2 rounded-[7px] w-[300px] mt-2 h-[50px] placeholder:font-normal placeholder:text-gray-300 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[36px] right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <div className="mb-10">
              <button
                type="submit"
                className="mb-5 bg-[#03A9F4] text-white py-2 rounded-[7px] mt-6 w-[300px] h-[40px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Masuk"}
              </button>
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm w-[300px] text-center">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
