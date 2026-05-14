import ActionMenu from "../../../components/actionMenu/ActionMenu";
import { toast } from "react-toastify";

const expertColors = {
  Dietitian: "bg-[#FFF5ED] text-black",
  Therapist: "bg-[#E7F9F4] text-black",
  Trainer: "bg-[#EBF2FE] text-black",
};

const statusColors = {
  Active: "bg-[#45C4A2] text-white",
  Inactive: "bg-[#66706D] text-white",
  Suspended: "bg-[#FB5858] text-white",
};

export const AdminColumns = [
  { accessorKey: "name", header: "Admin Name" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const expertColor = expertColors[role] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${expertColor}`}>
          {role}
        </span>
      );
    },
  },
  { accessorKey: "specialization", header: "Specialisation" },
  {
    accessorKey: "clients",
    header: "Clients",
    cell: ({ row }) => row.original.totalUsers || 0,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colorClass = statusColors[status] || "bg-gray-200 text-gray-700";

      return (
        <span className={`px-2 py-1 text-[11px] rounded-xl ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const handleDelete = () => {
        const expertsCount = row.original.experts?.length || 0;
        if (expertsCount > 0) {
          toast.error("Remove the experts and clients for delete admin");
          return;
        }

        // Dispatch to AdminsList for Delete or navigate
        const event = new CustomEvent("open-delete-admin", {
          detail: { id: row.original._id, name: row.original.name },
        });
        window.dispatchEvent(event);
      };

      return (
        <ActionMenu
          row={row}
          editActionPath="/head/admins/edit/"
          onDelete={handleDelete}
        />
      );
    },
  },
];
