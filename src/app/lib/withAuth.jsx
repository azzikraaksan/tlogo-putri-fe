"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem("access_token");
        const expireTime = localStorage.getItem("token_exp");

        if (!token || !expireTime || new Date().getTime() > parseInt(expireTime)) {
          localStorage.removeItem("token");
          localStorage.removeItem("token_exp");
          router.push("/");
        }
      };

      checkToken();
      const interval = setInterval(checkToken, 10000);
      return () => clearInterval(interval);
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
