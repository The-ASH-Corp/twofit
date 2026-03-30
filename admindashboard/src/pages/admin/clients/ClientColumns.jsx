import ActionMenu from "@/components/actionMenu/ActionMenu";
import React from "react";
import StatusCell from "./StatusCell";

export const getClientColumns = (onRefresh) => [
 
  { accessorKey: "name", header: "Client Name" },
  { accessorKey: "duration", header: "Duration" },

  { accessorKey: "programStartDate", header: "Start Date" },
  { accessorKey: "programEndDate", header: "End Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell row={row} onRefresh={onRefresh} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/admin/clients/edit/"
        deleteActionPath="/admin/clients/delete/"
      />
    ),
  },
];
