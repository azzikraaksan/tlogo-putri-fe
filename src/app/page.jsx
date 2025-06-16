"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "/components/LoginPage.jsx";

const Page = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const expire = localStorage.getItem("token_exp");
    const role = localStorage.getItem("user_role");
    const now = new Date().getTime();

    if (token && expire && now < parseInt(expire)) {
      if (role === "Owner") {
        router.replace("/dashboard/penggajian/penggajian-utama");
      } else {
        router.replace("/dashboard");
      }
    } else {
      setChecking(false); 
    }
  }, []);

  if (checking) return null;

  return <LoginPage />;
};

export default Page;


