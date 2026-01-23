import ActionMenu from "@/components/actionMenu/ActionMenu";

export const CategoryListColumns = () => [
  { accessorKey: "categoryName", header: "Category Name" },
  { accessorKey: "programsCount", header: "Programs" },
  { accessorKey: "adminsCount", header: "Sub Admins" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "clientCount", header: "Clients" },

  {
    id: "_id",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu row={row} editActionPath="/founder/category/edit/" />
    ),
  },
];
