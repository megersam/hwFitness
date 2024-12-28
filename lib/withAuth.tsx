// utils/withAuth.tsx
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[]) => {
  return (props: any) => {
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Check if user is logged in
      if (!user?.token) {
        window.location.href = "/Login"; // Redirect to login page
        return;
      }

      // Check if the user role is allowed
      if (!allowedRoles.includes(user?.role)) {
        window.location.href = "/unauthorized"; // Redirect to an unauthorized page
        return;
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
