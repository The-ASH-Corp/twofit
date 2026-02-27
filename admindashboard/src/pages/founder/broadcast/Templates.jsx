import React, { useEffect, useState } from "react";
import {
  Search,
} from "lucide-react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { getAllBroadcast } from "@/redux/features/broadcast/broadcast.thunk";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { selectAllBroadcast, selectBroadcastError, selectBroadcastStatus, selectTotalBroadcast } from "@/redux/features/broadcast/broadcast.selector";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import BroadcastMenu from "./BroadcastMenu";

const Templates = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = [
    "All",
    "Welcome",
    "Motivation",
    "Progress",
    "Tips",
    "Promotional",
  ];

  useEffect(() => {
    dispatch(getAllBroadcast({ page, limit, type: activeFilter }));
  }, [dispatch, page, limit, activeFilter]);

  const data = useAppSelector(selectAllBroadcast);
  const totalCount = useAppSelector(selectTotalBroadcast);
  const status = useAppSelector(selectBroadcastStatus);
  const error = useAppSelector(selectBroadcastError);

  const [broadcast, setBroadcast] = useState([]);

  useEffect(() => {
    setBroadcast(data);
  }, [data]);

  const totalPages = Math.ceil(totalCount / limit);

  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

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
        totalPageCount,
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  };

  const paginationRange = getPaginationRange() || [];

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setBroadcast(data);
      return;
    }

    const filtered = data.filter((broadcast) =>
      broadcast.title?.toLowerCase().includes(value),
    );

    setBroadcast(filtered);
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}!</p>;

  return (
    <div className="flex-1 flex flex-col gap-6 h-[calc(100vh-130px)] pt-4 md:pt-0    overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar pb-4">
        {/* Header Section */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Broadcast Templates
              </h1>
              <p className="text-slate-500 text-[12px] sm:text-sm font-medium mt-1">
                Manage and select templates for your broadcasts
              </p>
            </div>

            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A4F48] transition-colors w-5 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                onChange={(e) => searchInputHandler(e)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border-none rounded-xl text-sm font-semibold text-slate-700 w-full md:w-72 transition-all ring-1 ring-transparent focus:ring-[#0A4F48]/20 focus:shadow-lg outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="">
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`pb-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                    activeFilter === filter
                      ? "border-[#0A4F48] text-[#0A4F48]"
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Content Area */}
        {broadcast?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-6">
            {broadcast?.map((template, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-slate-200/60 p-5 flex flex-col gap-4 hover:border-[#0A4F48]/20 transition-all duration-300 relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-white rounded-full shadow-sm p-1 border border-slate-100">
                    <BroadcastMenu data={template} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#0A4F48]/5 text-[#0A4F48] text-[11px] font-bold uppercase tracking-wider border border-[#0A4F48]/10">
                      {template?.type}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold text-slate-800 group-hover:text-[#0A4F48] transition-colors line-clamp-1"
                    title={template?.title}
                  >
                    {template?.title}
                  </h3>
                </div>

                <div
                  onClick={() =>
                    navigate(`/founder/broadcasts/summary/${template?._id}`)
                  }
                  className="bg-[#F8FAFC] rounded-xl p-4 flex-1 cursor-pointer border border-transparent group-hover:border-[#0A4F48]/5 transition-colors"
                >
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {template?.message}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/founder/broadcasts/summary/${template?._id}`)
                  }
                  className="w-full bg-white text-slate-700 border border-slate-200 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-[#0A4F48] hover:text-white hover:border-[#0A4F48] hover:shadow-md hover:shadow-[#0A4F48]/20 transition-all mt-auto active:scale-[0.99]"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 min-h-[400px]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <p className="font-medium text-sm">
              No templates found matching your criteria
            </p>
          </div>
        )}
        {/* Pagination */}
        <div className="px-2 pb-0 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 mt-auto bg-transparent">
          {/* Results Per Page */}
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <span>Show</span>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border-none rounded-lg text-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 cursor-pointer"
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

          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider hidden sm:block">
            Page {page} of {totalPages}
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:bg-[#0A4F48] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all shadow-sm"
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
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all transform hover:scale-105 ${
                      page === pageNumber
                        ? "bg-[#0A4F48] text-white shadow-lg shadow-[#0A4F48]/25"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:bg-[#0A4F48] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all shadow-sm"
            >
              <MdOutlineKeyboardArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;