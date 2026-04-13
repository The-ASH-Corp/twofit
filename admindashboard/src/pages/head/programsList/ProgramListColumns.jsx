const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const ProgramListColumns = [
  { accessorKey: "title", header: "Program Name" },
  { accessorKey: "duration", header: "Duration" },
  {
    header: "category",
    cell: ({ row }) => (
      <span className=" capitalize">{row.original.category?.name || "—"}</span>
    ),
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
  // { id: "actions", header: "Action", cell: () => "⋯" },
];
