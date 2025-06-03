// // middleware.js
// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const token = request.cookies.get("token")?.value;
//   const url = request.nextUrl.clone();

//   // Halaman yang butuh autentikasi
//   const authPages = ["/login", "/dashboard"];

//   const isProtected = authPages.some((path) =>
//     url.pathname.startsWith(path)
//   );

//   // Jika halaman butuh token dan token tidak ada
//   if (isProtected && !token) {
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   // Kalau driver akses halaman login → redirect ke halaman lain (misalnya homepage)
//   if (url.pathname === "/login" && token) {
//     const user = parseJwt(token); // Pakai fungsi parse token kamu
//     if (user?.role === "driver") {
//       url.pathname = "/"; // arahkan ke homepage atau /fo
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/login", "/dashboard/:path*", "/confirm/:path*"], // HAPUS /confirm dari sini
// };


// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose"; // Kalau kamu pakai JWT
// import { cookies } from "next/headers";

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;

//   // Bypass middleware untuk halaman konfirmasi
//   if (pathname.startsWith("/confirm")) {
//     return NextResponse.next();
//   }

//   // Bypass juga untuk halaman root (kalau kamu mau biarkan driver lihat halaman ini)
//   if (pathname === "/") {
//     return NextResponse.next();
//   }

//   // Redirect ke login kalau belum login
//   if (!token && pathname !== "/login") {
//     const url = request.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   // Kalau sudah login tapi role driver masuk ke /login, lempar ke /
//   if (token && pathname === "/login") {
//     try {
//       const user = parseJwt(token); // pakai fungsi decode JWT kamu
//       if (user?.role === "driver") {
//         const url = request.nextUrl.clone();
//         url.pathname = "/";
//         return NextResponse.redirect(url);
//       }
//     } catch (err) {
//       console.error("Token invalid", err);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
