'use client';
import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
   useEffect(() => {
        // Check if the user is already logged in
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.token) {
          // Redirect to the appropriate page based on the user's role
          if (user.role === 'Admin') {
            window.location.href = '/Admin';
          } else if (user.role === 'Reception') {
            window.location.href = '/Employee';
          }
        }else if(!user?.token){
          window.location.href = '/Login';
        }
      }, []);
  return (
     <div>
     
     </div>
  );
}
