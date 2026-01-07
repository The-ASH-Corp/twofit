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
    enableRowSelection: true,
  });

  const totalPages = Math.ceil(totalCount / limit);

  const getPaginationRange = () => {
    const totalPageCount = totalPages;
    const siblingCount = 1;

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }


    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, "...", totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  };

  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = getPaginationRange() || [];

  return (
    <div className="bg-white p-[16px] rounded-xl flex flex-col  overflow-hidden">
      <div className="mb-6 flex justify-between">
        <h2 className="text-[#0A4F48] font-bold text-[16px]">{pageLabel}</h2>
        <div className="flex gap-3">
          <div className="flex items-center bg-[#F8F8F8] px-3 rounded-lg">
            <img src={assets.search} className="  w-5 h-5  " />
            <input
              type="text"
              placeholder="Search anything"
              className=" w-72 px-[10px] py-[12px] border border-none rounded-xl  w-[250px] focus:outline-none bg-transparent"
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

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 mt-auto">
        <div className="flex items-center gap-3 text-sm text-[#66706D] font-medium">
          <span>Show</span>
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <MdOutlineKeyboardArrowDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>

          <span>of {totalCount} results</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              page === 1
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            }`}
          >
            <MdOutlineKeyboardArrowLeft size={18} />
          </button>

          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === "...") {
              return (
                <span key={idx} className="px-1 text-gray-400 font-bold">
                  ...
                </span>
              );
            }

            return (
              <button
                key={idx}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  page === pageNumber
                    ? "bg-[#0A4F48] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              page === totalPages
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            }`}
          >
            <MdOutlineKeyboardArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
