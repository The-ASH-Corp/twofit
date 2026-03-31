import React from "react";

const roleStyles = {
  "Fitness Coach": "text-[#45C4A2] font-semibold",
  "Dietitian": "text-[#0A4F48] font-semibold",
  "Therapist": "text-[#065F46] font-semibold",
};

export const feedbackColumns = [

  { 
    accessorKey: "name", 
    header: "Expert Name",
    cell: ({ row }) => {
      const name = row.original.name || "N/A";
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E6F8F3] text-[#45C4A2] flex items-center justify-center text-[10px] font-bold">
            {initials}
          </div>
          <span className="font-bold text-[#0F172A]">{name}</span>
        </div>
      );
    }
  },
  { 
    accessorKey: "role", 
    header: "Role",
    cell: ({row}) => {
      const role = row.original.role;
      const roleStyle = roleStyles[role] || "text-gray-600 font-medium";
      
      return (
        <span className={`text-[13px] ${roleStyle}`}>
          {role}
        </span>
      );
    }
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({row}) => {
      const rating = row.original.rating;
      return (
        <div className="flex items-center gap-1.550.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < rating ? "text-[#F5BA02]" : "text-gray-200"}`}>
              ★
            </span>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({row}) => {
      const review = row.original.review;
      return (
        <span className="text-[13px] text-gray-500 italic font-medium">
          "{review}"
        </span>
      );
    }
  },
  { 
    accessorKey: "date", 
    header: "Date",
    cell: ({row}) => (
      <span className="text-[13px] text-gray-600 font-medium">{row.original.date}</span>
    )
  },
  
];
