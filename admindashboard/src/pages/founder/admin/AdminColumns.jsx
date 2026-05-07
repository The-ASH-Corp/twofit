import ActionMenu from "@/components/actionMenu/ActionMenu";

// const expertColors = {
//   Dietitian: "bg-[#FFF5ED] text-black",
//   Therapist: "bg-[#E7F9F4] text-black",
//   Trainer: "bg-[#EBF2FE] text-black",
// };

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const AdminColumns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <input
  //       type="checkbox"
  //       checked={table.getIsAllRowsSelected()}
  //       onChange={table.getToggleAllRowsSelectedHandler()}
  //       className="w-3 h-3 cursor-pointer"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <input
  //       type="checkbox"
  //       checked={row.getIsSelected()}
  //       onChange={row.getToggleSelectedHandler()}
  //       className="w-3 h-3 cursor-pointer"
  //     />
  //   ),
  // },
  { accessorKey: "adminName", header: "Admin Name" },
  // {
  //   accessorKey: "role",
  //   header: "Role",
  //   cell: ({ row }) => {
  //     const role = row.original.role;
  //     const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

  //     return (
  //       <span className={`px-2 py-1 text-[11px] rounded-xl ${expertColor}`}>
  //         {role}
  //       </span>
  //     );
  //   },
  // },
  { accessorKey: "headName", header: "Head Name" },
  { accessorKey: "categoryName", header: "Assigned Category" },
  { accessorKey: "programCount", header: "Programs" },
  { accessorKey: "coachCount", header: "Experts" },
  { accessorKey: "userCount", header: "Clients" },

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
    cell: ({ row }) => {
      const programCount = Number(row.original.programCount || 0);

      if (programCount > 0) {
        return <span className="text-xs font-semibold text-slate-400">-</span>;
      }

      const handleDelete = () => {
        const event = new CustomEvent("open-delete-founder-admin", {
          detail: {
            id: row.original._id,
            name: row.original.adminName,
          },
        });
        window.dispatchEvent(event);
      };

      return (
        <ActionMenu
          row={row}
          editActionPath="/founder/admins/edit/"
          onDelete={handleDelete}
        />
      );
    },
  },
];
