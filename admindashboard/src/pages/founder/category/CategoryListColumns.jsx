// const expertColors = {
//   Dietitian: "bg-[#FFF5ED] text-black",
//   Therapist: "bg-[#E7F9F4] text-black",
//   Trainer: "bg-[#EBF2FE] text-black",
// };



export const CategoryListColumns = [
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
  { accessorKey: "categoryName", header: "Category Name" },
  { accessorKey: "programsCount", header: "Programs" },
  { accessorKey: "adminsCount", header: "Sub Admins" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "clientCount", header: "Clients" },
  { id: "actions", header: "Action", cell: () => "⋯" },
];
