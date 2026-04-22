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

import { useState, useMemo } from "react";
import { BsDatabaseAdd } from "react-icons/bs";

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
  pagination
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openStatus, setOpenStatus] = useState(false);

  const navigate = useNavigate();

  const availableStatuses = useMemo(() => {
    if (!data) return [];
    const statuses = new Set();
    data.forEach((item) => {
      // Check for common status fields or use specific ones based on component usage
      if (item.status) statuses.add(item.status);
    });
    // Ensure we handle the specific status values requested
    // If data doesn't contain them (e.g. empty page), they won't appear, which is correct behavior for dynamic filtering
    return Array.from(statuses);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (statusFilter === "All Status") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getRowId: (row) => row?._id,
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
    <div
      className="bg-white rounded-3xl overflow-hidden flex flex-col w-full font-sans"
      style={data?.length > 0 ? { height: "fit-content" } : { height: "100%" }}
    >
      {/* Header Section */}
      <div className="py-4 md:py-6 px-3 md:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 bg-white">
        <div className="mx-1 md:mx-0">
          <h2 className="text-[#0F172A] font-black text-xl md:text-2xl tracking-tight mb-1 md:mb-2">
            {pageLabel}
          </h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Manage and view your {pageLabel.toLowerCase() || "data"} here
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A4F48] transition-colors">
              <img
                src={assets.search}
                className="w-5 h-5 opacity-60"
                alt="search"
              />
            </div>
            <input
              type="text"
              placeholder="Search data..."
              className="w-full sm:w-64 pl-12 pr-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white border-2 border-transparent focus:border-[#0A4F48]/10 rounded-2xl text-sm font-semibold text-slate-700 transition-all outline-none placeholder:text-slate-400 placeholder:font-medium"
              onChange={(e) => onSearchInputChange(e)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {availableStatuses.length > 0 && (
              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setOpenStatus(!openStatus)}
                  className="w-full h-[46px] px-4 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold flex items-center justify-between gap-2 transition-all active:scale-95 border-2 border-slate-100 focus:border-[#0A4F48]/10 shadow-sm"
                >
                  <span className="truncate max-w-[110px] sm:max-w-[140px]">{statusFilter}</span>
                  <MdOutlineKeyboardArrowDown className="w-5 h-5 text-slate-400" />
                </button>
                {openStatus && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-[100] p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <button
                      onClick={() => {
                        setStatusFilter("All Status");
                        setOpenStatus(false);
                      }}
                      className={`block w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${statusFilter === "All Status" ? "bg-[#0A4F48]/10 text-[#0A4F48]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                    >
                      All Status
                    </button>
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setOpenStatus(false);
                        }}
                        className={`block w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${statusFilter === status ? "bg-[#0A4F48]/10 text-[#0A4F48]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {actionPath && (
              <button
                onClick={() => navigate(actionPath)}
                className="flex-1 sm:flex-none h-[46px] px-4 md:px-6 bg-[#0A4F48] hover:bg-[#084039] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0A4F48]/25 hover:shadow-xl hover:shadow-[#0A4F48]/30 transition-all active:scale-95 hover:-translate-y-0.5"
              >
                <BiPlus className="w-5 h-5 stroke-2" />
                <span className="hidden sm:inline">{actionLabel}</span>
                <span className="sm:hidden">{actionLabel.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto overflow-y-visible px-3 md:px-8 pb-32">
        {data?.length > 0 ? (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="hidden md:table-header-group">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pl-6"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="bg-transparent">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-all duration-300 cursor-pointer flex flex-col md:table-row relative bg-[#F8FAFC] hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 rounded-2xl z-0 hover:z-50 has-[div[role='menu']]:z-60 border border-slate-100 md:border-none mb-6 md:mb-0"
                  onClick={() => {
                    if (profilePath) {
                      profilePath(row.original?._id);
                    }
                  }}
                  style={{ borderRadius: "1rem" }}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const isFirst = index === 0;
                    const isLast = index === row.getVisibleCells().length - 1;

                    return (
                      <td
                        key={cell.id}
                        className={`py-3 md:py-5 px-4 md:px-6 text-sm font-bold text-slate-700 flex md:table-cell items-center justify-between md:justify-start gap-4 border-b border-slate-50 md:border-none last:border-none ${isFirst ? "rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" : ""} ${isLast ? "rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none" : ""}`}
                        data-label={
                          table.getHeaderGroups()[0]?.headers[index]?.column
                            ?.columnDef?.header
                        }
                      >
                        {/* Mobile Label */}
                        <span className="md:hidden text-[10px] font-black text-slate-400 min-w-[80px] uppercase tracking-wider">
                          {flexRender(
                            table.getHeaderGroups()[0]?.headers[index]?.column
                              ?.columnDef?.header,
                            table
                              .getHeaderGroups()[0]
                              ?.headers[index]?.getContext(),
                          )}
                        </span>
                        {/* Cell Content */}
                        <div className="md:block relative text-right md:text-left flex-1 min-w-0 break-words">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 bg-[#F8FAFC] rounded-3xl border-2 border-dashed border-slate-200 mx-4 md:mx-6 mb-4 md:mb-6 min-h-[300px]">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
              <BsDatabaseAdd
                size={24}
                className="text-slate-300 md:w-7 md:h-7"
              />
            </div>
            <div className="text-center px-4">
              <h3 className="text-base md:text-lg font-bold text-slate-700 mb-1">
                No data found
              </h3>
              <p className="text-xs md:text-sm font-medium text-slate-400">
                Get started by creating a new entry.
              </p>
            </div>
            {actionPath && (
              <button
                onClick={() => navigate(actionPath)}
                className="mt-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-[#0A4F48] text-[#0A4F48] rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md"
              >
                Add Record
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {data?.length > 0 && !pagination && (
        <div className="px-8 pb-8 pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Results Per Page */}
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium bg-[#F8FAFC] px-4 py-2 rounded-xl">
            <span>Show</span>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => {
                  handleLimitChange(Number(e.target.value));
                  handlePageChange(1);
                }}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white border-none shadow-sm rounded-lg text-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 cursor-pointer"
              >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <MdOutlineKeyboardArrowDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="hidden sm:inline">per page</span>
          </div>

          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Page {page} of {totalPages}
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8FAFC] text-slate-500 hover:bg-[#0A4F48] hover:text-white disabled:opacity-30 disabled:hover:bg-[#F8FAFC] disabled:hover:text-slate-500 transition-all shadow-sm"
            >
              <MdOutlineKeyboardArrowLeft className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 mx-2">
              {paginationRange.map((pageNumber, idx) => {
                if (pageNumber === "...") {
                  return (
                    <span
                      key={idx}
                      className="text-slate-300 text-xs px-1 font-black"
                    >
                      •••
                    </span>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all transform hover:scale-105 ${
                      page === pageNumber
                        ? "bg-[#0A4F48] text-white shadow-lg shadow-[#0A4F48]/25"
                        : "bg-[#F8FAFC] text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8FAFC] text-slate-500 hover:bg-[#0A4F48] hover:text-white disabled:opacity-30 disabled:hover:bg-[#F8FAFC] disabled:hover:text-slate-500 transition-all shadow-sm"
            >
              <MdOutlineKeyboardArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
