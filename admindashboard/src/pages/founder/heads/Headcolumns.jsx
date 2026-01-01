export const therapyColumns = [
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
  { accessorKey: "name", header: "Head Name" },
  { accessorKey: "gender", header: "gender" },
  { accessorKey: "email", header: "email" },
  { accessorKey: "phone", header: "phone" },
  { id: "actions", header: "actions", cell: () => "⋯" },
];
