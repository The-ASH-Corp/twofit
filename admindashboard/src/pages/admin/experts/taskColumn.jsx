import ActionMenu from "@/components/actionMenu/ActionMenu";

export const taskColumn = [
  { accessorKey: "title", header: "title" },
  { accessorKey: "timeOfDay", header: "time" },
  {
    accessorKey: "description",
    header: "description",
    cell: ({ row }) => {
      return (
        <span className="">
          {row?.original?.description}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/admin/experts/edit/"
        deleteActionPath="/admin/experts/delete/"
      />
    ),
  },
];