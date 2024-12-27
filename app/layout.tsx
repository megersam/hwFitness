import type { Metadata } from "next";
import { Urbanist } from 'next/font/google'
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/theme-provider";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { ClerkProvider } from "@clerk/nextjs";
// import QueryProvider from "@/context/query-provider";


const urbanist = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "HW Fitness",
  description: "Hw Fit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <html lang="en">

      <body
        className={cn("bg-background", urbanist.className)}
      >


        {children}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />



      </body>
    </html> 
  );
}