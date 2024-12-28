import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const recentData = [
  {
    name: "Megersa Biratu Muleta",
    phoneNumber: "0966916168",
    status: "Paid",
  },
  {
    name: "Wakjira Nagara Bashana",
    phoneNumber: "0966916168",
    status: "Not Paid",
  },
  {
    name: "Rabira Hailu Ragasa",
    phoneNumber: "0966916168",
    status: "Paid",
  },
  {
    name: "Abdi Leta K",
    phoneNumber: "0966916168",
    status: "Not Paid",
  },
  {
    name: "Lensa Tesfaye",
    phoneNumber: "0912345678",
    status: "Paid",
  },
  {
    name: "Bethelhem Kidus",
    phoneNumber: "0945678910",
    status: "Not Paid",
  },
];

export function RecentSales() {
  return (
    <Card className="h-[400px] p-4 overflow-y-auto w-[450px] bg-[#1E1E20] text-white rounded-md border-none">
      {recentData.map((item, index) => {
        // Extract initials
        const initials = item.name
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("");
  
        return (
          <div
            key={index}
            className="flex items-center space-y-4 mb-4 bg-[#1E1E20] p-4 rounded-md"
          >
            {/* Avatar */}
            <Avatar className="h-9 w-9 ml-4">
              <AvatarImage src="" alt={item.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
  
            {/* User Info */}
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-gray-400">{item.phoneNumber}</p>
            </div>
  
            {/* Status */}
            <div
              className={`ml-auto font-medium text-sm ${
                item.status === "Paid" ? "text-green-500" : "text-red-500"
              }`}
              style={{ minWidth: "80px", textAlign: "left" }}
            >
              {item.status}
            </div>
          </div>
        );
      })}
    </Card>
  );
  
}
