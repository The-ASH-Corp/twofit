const expertColors = {
  Dietician: "bg-[#FFF5ED] text-black",
  Therapist: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
};

import ActionMenu from "@/components/actionMenu/ActionMenu";
import { useNavigate } from "react-router-dom";



const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const ExpertColumns = [

  { accessorKey: "name", header: "Expert Name" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${expertColor}`}>
          {role}
        </span>
      );
    },
  },
  { accessorKey: "specialization", header: "Specialisation" },

  { accessorKey: "clients", header: "Clients" },
  { accessorKey: "maxClient", header: "Maximum Limit" },
  { accessorKey: "avgRating", header: "Rating" },
  { id: "tasks", header: "Tasks", cell: ({row})=> 
    <ViewButton row={row}/>
   },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colorClass = statusColors[status] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/admin/experts/edit/"
        deleteActionPath="/admin/experts/delete/"
      />
    ),
  },
];

const ViewButton = ({row})=> {
  const navigate = useNavigate();
   return (
     <button
       onClick={(e) => {
         e.stopPropagation();
         navigate(`/admin/experts/tasks/${row.id}`);
       }}
       className="px-2 py-1 text-white bg-[#0A4F48] rounded-md text-[11px]"
     >
       View
     </button>
   );
}