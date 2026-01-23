import { IoMdClose } from "react-icons/io";

export const CategoryListColumns = (activeRowId, setActiveRowId, navigate) => [
  { accessorKey: "categoryName", header: "Category Name" },
  { accessorKey: "programsCount", header: "Programs" },
  { accessorKey: "adminsCount", header: "Sub Admins" },
  { accessorKey: "expertCount", header: "Experts" },
  { accessorKey: "clientCount", header: "Clients" },

  {
    id: "_id",
    header: "Action",
    cell: ({ row }) => {
      // console.log("row.id:", row.id, "row._id:", row.original._id);

      const isOpen = activeRowId === row.id;

      const handelEdit = (id) => {
        // console.log(id);
        setActiveRowId(false);
        navigate(`/founder/category/edit/${id}`);
      };

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
              className="absolute z-10 rounded-lg   shadow-[0_10px_30px_rgba(0,0,0,0.25)] w-30 p-2 bg-white flex flex-col items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={()=>setActiveRowId(false)}
                className="w-full flex items-center justify-end px-1"
              >
                <IoMdClose />
              </div>
              <button
                onClick={() => handelEdit(row.id)}
                className="w-full bg-[#EBF3F2] hover:bg-[#0A4F48] hover:text-white p-2 rounded-lg"
              >
                Edit
              </button>
              <button className=" w-full bg-[#EBF3F2] hover:bg-red-400 hover:text-white p-2 rounded-lg">
                Delete
              </button>
            </div>
          )}
        </div>
      );
    },
  },
];
