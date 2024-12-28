
import { cookies } from "next/headers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";


export default async function Home() {
   
  const userCookie = (await cookies()).get("user");
  const user = userCookie ? JSON.parse(userCookie.value) : null;

    // Server-side redirection
    if (user) {
      if (user.role === "Admin") {
        redirect("/Admin");
      } else if (user.role === "Reception") {
        redirect("/Employee");
      }
    } else {
      redirect("/Login");
    }
  
    return null; // No UI to render
  }

 
