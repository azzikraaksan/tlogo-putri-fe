import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "/src/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Operational Jeep Tlogo Putri",
  description: "Website untuk mengelola operasional Komunitas Jeep Tlogo Putri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      {/* <body className="font-poppins antialiased bg-white text-gray-900"> */}
      <body className={`${poppins.variable} font-poppins`}>
        {children}
      </body>
    </html>
  );
}


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });