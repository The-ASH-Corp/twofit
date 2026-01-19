import BaseTable from "@/components/table/BaseTable";
import React, { useEffect, useState } from "react";
import { feedbackColumns } from "./Feedbackolumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllFeedbacks } from "@/redux/features/client/client.thunk";

export default function FeedbackList() {
  const user = useAppSelector(selectUser);
  const [feedbackData, setFeedbackData] = useState([]);
  const dispatch = useDispatch();

  const fetchFeedbackData = async () => {
    const response = await dispatch(getAllFeedbacks(user._id));
    const data = await response.payload;

    // Flatten the nested feedback data structure
    const flattenedData =
      data?.flatMap((coach) =>
        coach.feedback.map((fb) => ({
          coachId: coach._id,
          name: coach.name
            ? coach.name.charAt(0).toUpperCase() + coach.name.slice(1)
            : "N/A",
          role: coach.role || "N/A",
          rating: fb.rating,
          review: fb.feedback,
          date: new Date(fb.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          _id: fb._id,
        }))
      ) || [];

    setFeedbackData(flattenedData);
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <div className="w-full">
      {/* Desktop View - Table */}
      <div className="hidden lg:block">
        <BaseTable columns={feedbackColumns} data={feedbackData} />
      </div>

      {/* Mobile View - Card List */}
      <div className="lg:hidden space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#0A4F48] font-semibold text-[15px]">
              Feedback List
            </h2>
            <button className="p-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-gray-600"
              >
                <path
                  d="M5 10h10M5 5h10M5 15h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Feedback Items */}
          <div className="space-y-3">
            {feedbackData.map((item, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[13px] font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 capitalize">
                      {item.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < item.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {item.review && (
                  <p className="text-[12px] text-gray-600 mb-2 line-clamp-2">
                    {item.review}
                  </p>
                )}
                <p className="text-[10px] text-gray-400">{item.date}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {feedbackData.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
              <button className="w-8 h-8 rounded-lg bg-[#0A4F48] text-white text-xs font-medium">
                1
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                2
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                3
              </button>
              <span className="text-gray-400 text-xs">...</span>
              <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                11
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                16
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
