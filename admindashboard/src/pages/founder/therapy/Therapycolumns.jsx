import { useNavigate } from "react-router-dom";

export const therapyColumns = [
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
  { accessorKey: "name", header: "Therapy Name" },
  {accessorKey:"Clients",header:"No of Clients"},
  
   {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  }]

  const ActionCell = ({ row }) => {
  const navigate = useNavigate();
  const { _id, title, plans = [] } = row.original;
  const hasPlans = plans.length > 0;

  const handleNavigation = () => {
    if (hasPlans) {
      navigate("/founder/therapy/plans", {
        state: { programId: _id, title },
      });
    } else {
      navigate("/founder/therapy/create", {
        state: { programId: _id, title },
      });
    }
  };
    return (
    <button
      onClick={handleNavigation}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg ${
        hasPlans ? "bg-[#EBF3F2] text-[#0A4F48]" : "bg-[#0A4F48] text-white"
      } transition-colors`}
    >
      {hasPlans ? "View Plan" : "Add Plan"}
    </button>
  );

  }
