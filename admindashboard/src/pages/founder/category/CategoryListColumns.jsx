// const expertColors = {
//   Dietitian: "bg-[#FFF5ED] text-black",
//   Therapist: "bg-[#E7F9F4] text-black",
//   Trainer: "bg-[#EBF2FE] text-black",
// };



export const CategoryListColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="w-[12px] h-[12px] cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="w-[12px] h-[12px] cursor-pointer"
      />
    ),
  },
  { accessorKey: "name", header: "Category Name" },
  { accessorKey: "programLimit", header: "Programs" },
  { accessorKey: "name", header: "Sub Admins" },
  { accessorKey: "name", header: "Experts" },
  { accessorKey: "name", header: "Clients" },
  { id: "actions", header: "Action", cell: () => "⋯" },
];
