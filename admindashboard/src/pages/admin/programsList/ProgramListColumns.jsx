const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

import { useNavigate } from "react-router-dom";

export const ProgramListColumns = [
  // ... existing columns ...
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
  { accessorKey: "title", header: "Program Name" },
  { accessorKey: "duration", header: "Duration" },
  {
    header: "category",
    cell: ({ row }) => (
      <span className=" capitalize">{row.original.category?.name || "—"}</span>
    ),
  },
  { accessorKey: "linkedTemplate", header: "Linked Template" },

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
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

const ActionCell = ({ row }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/admin/programs/create")}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EBF3F2] hover:bg-[#dceceb] text-[#0A4F48] text-[11px] font-bold rounded-lg transition-colors"
    >
      View Plan
    </button>
  );
};
