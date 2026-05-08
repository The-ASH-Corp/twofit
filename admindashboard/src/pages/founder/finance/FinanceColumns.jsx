const expertColors = {
  Head: "bg-[#FFF5ED] text-black",
  Admin: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
  Dietician: "bg-[#EBF2FE] text-black",
  Therapist: "bg-[#EBF2FE] text-black",
};
const formatINR = (amount) =>
  `₹ ${amount.toLocaleString("en-IN")}`;

// const statusColors = {
//   Active: "bg-[#45C4A2] text-white",
//   Inactive: "bg-[#66706D] text-white",
//   Suspended: "bg-[#FB5858] text-white",
// };

export const FinanceColumns = [
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
  { accessorKey: "employeeName", header: "Employees Name" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-sm ${expertColor}`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "baseSalary",
    header: "Base Salary",
    cell: ({ row }) => <span>{formatINR(row.original.baseSalary)}</span>,
  },
  {
    accessorKey: "incentive",
    header: "Incentives",
    cell: ({ row }) => <span>{formatINR(row.original.incentive)}</span>,
  },

  {
    accessorKey: "bonus",
    header: "Bonus",
    cell: ({ row }) => <span>{formatINR(row.original.bonus)}</span>,
  },

  {
    accessorKey: "deduction",
    header: "Deduction",
    cell: ({ row }) => <span>{formatINR(row.original.deduction)}</span>,
  },

  {
    accessorKey: "netSalary",
    header: "Net Salary",
    cell: ({ row }) => <span>{formatINR(row.original.netSalary)}</span>,
  },

  {
    accessorKey: "month",
    header: "Months",
  },

  {
    accessorKey: "year",
    header: "Year",
  },
  // { id: "actions", header: "Action", cell: () => "⋯" },
];
