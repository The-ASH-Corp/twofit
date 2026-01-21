// const expertColors = {
//   Dietitian: "bg-[#FFF5ED] text-black",
//   Therapist: "bg-[#E7F9F4] text-black",
//   Trainer: "bg-[#EBF2FE] text-black",
// };
// const formatINR = (amount) =>
//   `₹${amount.toLocaleString("en-IN")}`;

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
  { accessorKey: "name", header: "Employees Name" },
  {
    accessorKey: "role",
    header: "Role",
    // cell: ({ row }) => {
    //   const role = row.original.role;
    //   const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

    //   return (
    //     <span className={`px-2 py-1 text-[11px] rounded-xl ${expertColor}`}>
    //       {role}
    //     </span>
    //   );
    // },
  },
  {
    accessorKey: "months",
    header: "Months",
    // cell: ({ row }) => formatINR(row.original.baseSalary),
  },
  {
    accessorKey: "salary",
    header: "Base Salary",
    // cell: ({ row }) => formatINR(row.original.baseSalary),
  },
  // {
  //   accessorKey: "leave",
  //   header: "Leave",
  //   // cell: ({ row }) => formatINR(row.original.baseSalary),
  // },
  {
    accessorKey: "incentives",
    header: "Incentives",
    // cell: ({ row }) => formatINR(row.original.incentive),
  },
  // {
  //   accessorKey: "deductions",
  //   header: "Deductions",
  //   // cell: ({ row }) => formatINR(row.original.incentive),
  // },
  {
    accessorKey: "netSalary",
    header: "Net Salary",
    // cell: ({ row }) => (
    //   <span className="font-semibold">
    //     {formatINR(row.original.totalPayout)}
    //   </span>
    // ),
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
    accessorKey: "date",
    header: "Date",
  },
  { id: "actions", header: "Action", cell: () => "⋯" },
];
