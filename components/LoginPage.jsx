// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import LoginForm from "/components/LoginForm.jsx";

// const LoginPage = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const expireTime = localStorage.getItem("token_exp");

//     if (token && expireTime) {
//       const now = new Date().getTime();
//       if (now < parseInt(expireTime)) {
//         router.push("/dashboard");
//       } else {
//         localStorage.removeItem("token");
//         localStorage.removeItem("token_exp");
//       }
//     }
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <LoginForm />
//     </div>
//   );
// };

// export default LoginPage;
