"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem("access_token");
        const expireTime = localStorage.getItem("token_exp");

        if (
          !token ||
          !expireTime ||
          new Date().getTime() > parseInt(expireTime)
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_exp");
          localStorage.removeItem("user_role");
          router.replace("/");
        } else {
          setChecking(false);
        }
      };

      checkToken();

      const interval = setInterval(checkToken, 10000);
      return () => clearInterval(interval);
    }, []);

    if (checking) return null;

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
