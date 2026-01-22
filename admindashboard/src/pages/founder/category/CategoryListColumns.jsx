export const CategoryListColumns = (activeRowId, setActiveRowId) => [
  { accessorKey: "categoryName", header: "Category Name" },
  { accessorKey: "programsCount", header: "Programs" },
  { accessorKey: "adminsCount", header: "Sub Admins" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "clientCount", header: "Clients" },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      console.log("row.id:", row.id, "row._id:", row.original._id);

  const isOpen = activeRowId === row.id;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveRowId(isOpen ? null : row.id);
        }}
      >
        ...
      </button>

      {isOpen && (
        <div
          className="absolute z-10 rounded-lg   shadow-[0_10px_30px_rgba(0,0,0,0.25)] w-30 p-2 bg-white flex flex-col items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button className=" w-full hover:bg-[#0A4F48] hover:text-white p-2 rounded-lg">
            Edit
          </button>
          <button className=" w-full hover:bg-red-400 hover:text-white p-2 rounded-lg">
            Delete
          </button>
        </div>
      )}
    </div>
  );
},

  },
];
