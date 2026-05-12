import React from "react";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";

const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
    case "read":
      return <CheckCircle2 size={14} className="text-emerald-500" />;
    case "failed":
      return <XCircle size={14} className="text-red-500" />;
    case "sent":
      return <Send size={14} className="text-blue-500" />;
    case "accepted":
      return <Clock size={14} className="text-amber-500" />;
    default:
      return <MessageSquare size={14} className="text-gray-400" />;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "read":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    case "sent":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "accepted":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const statusColumns = () => [
  {
    accessorKey: "recipient",
    header: "Recipient",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800">
          {row.original.recipientUserId?.name || "Unknown"}
        </span>
        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
          {row.original.recipientPhone}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "templateType",
    header: "Template / Type",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-700">
          {row.original.templateName ||
            row.original.broadcastId?.title ||
            "Custom Message"}
        </span>
        <span className="text-[11px] text-slate-500 capitalize mt-0.5">
          Audience: {row.original.audienceType || "selected"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "unknown";
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
            status,
          )}`}
        >
          {getStatusIcon(status)}
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Sent At",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a")
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "lastStatusAt",
    header: "Last Update",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.lastStatusAt
          ? format(new Date(row.original.lastStatusAt), "dd MMM, hh:mm a")
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "failureReason",
    header: "Failure Reason",
    cell: ({ row }) =>
      row.original.status === "failed" ? (
        <span
          className="text-[11px] font-medium text-red-600 max-w-[200px] truncate block"
          title={row.original.failureReason}
        >
          {row.original.failureReason || "Unknown error"}
        </span>
      ) : (
        <span className="text-slate-300">-</span>
      ),
  },
];
