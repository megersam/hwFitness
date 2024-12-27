import { Skeleton } from "@/components/ui/skeleton";
import React from "react"; 

const EmployeeCardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <div className="flex justify-end px-4 pt-4">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="flex flex-col items-center pb-10">
        <Skeleton className="w-24 h-24 mb-3 rounded-full" />
        <Skeleton className="w-32 h-6 mb-2" />
        <Skeleton className="w-24 h-4 mb-1" />
        <Skeleton className="w-40 h-4" />
      </div>
    </div>
  );
};

export default EmployeeCardSkeleton;
