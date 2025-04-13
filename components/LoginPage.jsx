"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "/components/LoginForm.jsx";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExp = localStorage.getItem("token_exp");
    const now = new Date().getTime();
  
    if (!token || now > tokenExp) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_exp");
      router.push("/");
    }
  }, []);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
