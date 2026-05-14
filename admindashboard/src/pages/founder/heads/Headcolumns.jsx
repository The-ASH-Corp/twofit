import ActionMenu from "@/components/actionMenu/ActionMenu";

const statusColors = {
  Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 border border-slate-200",
  Suspended: "bg-rose-100 text-rose-700 border border-rose-200",
};

export const therapyColumns = () => [
  { accessorKey: "headName", header: "Head Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "categoryName", header: "Assigned Category" },
  { accessorKey: "programCount", header: "Programs" },

  { accessorKey: "userCount", header: "Clients" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "Active";
      const colorClass = statusColors[status] || "bg-slate-100 text-slate-600";

      return (
        <span
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${colorClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Action</div>,
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <ActionMenu
          row={row}
          editActionPath="/founder/heads/edit/"
          deleteActionPath="/founder/heads/delete/"
        />
      </div>
    ),
  },
];
