export const taskHistoryColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="w-3 h-3 cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="w-3 h-3 cursor-pointer"
      />
    ),
  },
  { accessorKey: "name", header: "Expert Name" },
 
  { accessorKey: "specialization", header: "Specialisation" },

  { accessorKey: "clients", header: "Clients" },
  { accessorKey: "maxClient", header: "Maximum Limit" },
  { accessorKey: "avgRating", header: "Rating" },
];
