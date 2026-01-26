import ActionMenu from "@/components/actionMenu/ActionMenu";



export const CategoryListColumns = () => [
  { accessorKey: "categoryName", header: "Category Name" },
  { accessorKey: "headNames", header: "Head Name" },
  { accessorKey: "adminsCount", header: "Sub Admins" },
  { accessorKey: "programsCount", header: "Programs" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "clientCount", header: "Clients" },

  {
    id: "_id",
    header: "Action",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        editActionPath="/founder/category/edit/"
        deleteActionPath="/founder/category/delete/"
      />
    ),
  },
];
