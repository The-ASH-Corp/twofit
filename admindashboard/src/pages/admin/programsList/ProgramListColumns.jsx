const expertColors = {
  Dietitian: "bg-[#FFF5ED] text-black",
  Therapist: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
};

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const ProgramListColumns = [
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
  { accessorKey: "name", header: "Program Name" },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "clients", header: "Clients" },
  { accessorKey: "linkedTemplate", header: "Linked Template" },
  {
  accessorKey: "experts",
  header: "Experts",

  cell: ({ row }) => {
    return (
      <div className="flex gap-1 flex-wrap">
        {row.original.experts.map((exp) => {
          const expertColor =
            expertColors[exp] || "bg-gray-200 text-gray-700";

          return (
            <span
              key={exp}
              className={`px-2 py-1 text-[11px] rounded-sm ${expertColor}`}
            >
              {exp}
            </span>
          );
        })}
      </div>
    );
  }
},


  //   {
  //     accessorKey: "experts",
  //     header: "Experts",
  //     cell: ({ row }) => (
  //       <div className="flex gap-2 flex-wrap">
  //         {row.original.experts.map((exp) => {
  //           const colorClass =
  //             expertColors[exp] || "bg-gray-100 text-gray-700 border";

  //           return (
  //             <span
  //               key={exp}
  //               className={`px-2 py-1 text-[11px] rounded-sm ${colorClass}`}
  //             >
  //               {exp}
  //             </span>
  //           );
  //         })}
  //       </div>
  //     ),
  //   },

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
  { id: "actions", header: "Action", cell: () => "⋯" },
];
