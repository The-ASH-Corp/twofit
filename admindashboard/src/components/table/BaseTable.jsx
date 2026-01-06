import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  // getPaginationRowModel,
} from "@tanstack/react-table";
import { assets } from "../../assets/asset";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { BiPlus } from "react-icons/bi";

import { useState } from "react";
export default function BaseTable({
  columns,
  data,
  actionLabel,
  profilePath,
  actionPath,
  pageLabel,
  onSearchInputChange,
  handlePageChange,
  handleLimitChange,
  page,
  limit,
  totalCount,
}) {
  const [rowSelection, setRowSelection] = useState({});

  const navigate = useNavigate();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    // getPaginationRowModel,
    enableRowSelection: true,
  });

 

  return (
    <div className="bg-white p-[16px] rounded-xl flex flex-col max-h-[80vh] overflow-hidden">
      <div className="mb-6 flex justify-between">
        <h2 className="text-[#0A4F48] font-bold text-[16px]">{pageLabel}</h2>
        <div className="flex gap-3">
          <div className="flex items-center bg-[#F8F8F8] px-3 rounded-lg">
            <img src={assets.search} className="  w-5 h-5  " />
            <input
              type="text"
              placeholder="Search anything"
              className=" w-72 px-[10px] py-[12px] border border-none rounded-xl  w-[250px] focus:outline-none"
              onChange={(e) => onSearchInputChange(e)}
            />
            <img src={assets.filter} className="  w-4 h-4" />
          </div>
          <button className="bg-[#EBF3F2] rounded-md text-[12px] font-semibold px-3 py-0 flex items-center gap-2 ">
            All Status
            <MdOutlineKeyboardArrowDown className="w-4 h-4" />
          </button>
          <button className="bg-[#EBF3F2] rounded-md text-[12px] font-semibold px-3 py-0 flex items-center gap-2 ">
            Bulk Actions
            <MdOutlineKeyboardArrowDown className="w-4 h-4" />
          </button>
          {actionPath ? (
            <button
              onClick={() => navigate(actionPath)}
              className="bg-[#0A4F48] text-white rounded-md text-[12px] font-semibold px-3 py-0 flex items-center gap-2 "
            >
              <BiPlus className="w-6 h-6" />

              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#F8F8F8] ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-3 px-2 font-semibold text-black"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#DBDEDD] hover:bg-gray-50 transition"
                onClick={() => profilePath(row.original._id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-5 px-2 text-[11px] font-medium text-black"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 mt-4 items-center justify-between bg-white py-2">
        <div className="flex gap-3">
          <p>Show</p>
          <select
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            value={limit}
            className="focus:outline-none bg-[#F0F0F0] px-2 py-1 rounded flex items-center"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <MdOutlineKeyboardArrowLeft />
          </button>
          <span className="bg-[#F0F0F0] px-3 py-1 rounded">{page}</span>
          <button onClick={() => handlePageChange(page + 1)}>
            <MdOutlineKeyboardArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
