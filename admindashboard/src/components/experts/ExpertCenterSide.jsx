
import React, { useEffect, useMemo, useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Activity,
  MessageCircle
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { getCoachRatingGraph } from "@/redux/features/coach/coach.thunk";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpertCenterSide = ({ expert }) => {
  const dispatch = useDispatch();
  const [ratingDuration, setRatingDuration] = useState("6");
  const [ratingGraphData, setRatingGraphData] = useState(null);
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const ratingData = useMemo(() => {
    if (!ratingGraphData?.ratingData?.length) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "#F4DBC7",
            borderRadius: 6,
            barThickness: 50,
          },
        ],
      };
    }

    return {
      labels: ratingGraphData.ratingData.map((item) => item.month),
      datasets: [
        {
          data: ratingGraphData.ratingData.map((item) => item.rating),
          backgroundColor: (context) => {
            const index = context.dataIndex;
            if (index === hoveredBarIndex) return "#0A4F48";
            return "#E2E8F0"; // Default slate-200
          },
          hoverBackgroundColor: "#0A4F48",
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    };
  }, [ratingGraphData, hoveredBarIndex]);

  const ratingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (_, elements) => {
      if (elements?.length) {
        setHoveredBarIndex(elements[0].index);
      } else {
        setHoveredBarIndex(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1E293B",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (context) => `Rating: ${context.raw} / 5.0`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
            color: "#F1F5F9",
            drawBorder: false,
        },
        ticks: { stepSize: 1, color: "#94A3B8", font: { size: 10, weight: 'bold' }, padding: 10 },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11, weight: '500' } },
        border: { display: false }
      },
    },
  };

  useEffect(() => {
    if (expert?._id) {
      dispatch(getCoachRatingGraph({ id: expert._id, duration: ratingDuration }))
        .unwrap()
        .then((data) => setRatingGraphData(data))
        .catch((err) => console.error(err));
    }
  }, [expert?._id, ratingDuration, dispatch]);

  // Review Pagination Logic
  const reviews = expert?.feedback || [];
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  const displayedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="flex flex-col gap-6 ">
      
      {/* 1. Rating Chart Section */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden shrink-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0A4F48]">
                 <Activity size={20} strokeWidth={2} />
              </div>
              <div>
                 <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">Average Rating</h2>
                 <p className="text-[11px] text-[#64748B] font-medium mt-1">Client satisfaction over time</p>
              </div>
           </div>
           
           {/* Dropdown for Duration */}
           <div className="relative">
              <button 
                onClick={() => setShowRatingMenu(!showRatingMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] transition-all"
              >
                  <span>{ratingDuration} Months</span>
                  <ChevronDown size={14} />
              </button>
              
              {showRatingMenu && (
                 <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-[#E2E8F0] shadow-lg z-20 py-1">
                    {[3, 6, 12].map((m) => (
                       <button
                         key={m}
                         onClick={() => {
                            setRatingDuration(String(m));
                            setShowRatingMenu(false);
                         }}
                         className="w-full text-left px-4 py-2 text-xs font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0A4F48]"
                       >
                           Last {m} Months
                       </button>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* Chart Area */}
        <div className="p-6 h-[200px] w-full">
           <Bar data={ratingData} options={ratingOptions} />
        </div>
      </div>

      {/* 2. Client Feedback Section */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden shrink-0">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between sticky top-0 bg-white z-10 ">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                   <MessageCircle size={20} strokeWidth={2} />
                </div>
                <div>
                   <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">Client Feedback</h2>
                   <p className="text-[11px] text-[#64748B] font-medium mt-1">Recent reviews & comments</p>
                </div>
             </div>
             
             {/* Pagination Controls */}
             {totalReviewPages > 1 && (
                 <div className="flex items-center gap-2 ">
                    <button 
                       disabled={currentPage === 1}
                       onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                       className="p-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-50 hover:bg-[#F8FAFC] text-slate-500"
                    >
                        <ChevronLeft size={16}/>
                    </button>
                    <span className="text-xs font-bold text-slate-600">
                        {currentPage} / {totalReviewPages}
                    </span>
                    <button 
                       disabled={currentPage === totalReviewPages}
                       onClick={() => setCurrentPage(c => Math.min(totalReviewPages, c + 1))}
                       className="p-1.5 rounded-lg border border-[#E2E8F0] disabled:opacity-50 hover:bg-[#F8FAFC] text-slate-500"
                    >
                        <ChevronRight size={16}/>
                    </button>
                 </div>
             )}
          </div>

          <div className="overflow-y-visible p-4 space-y-3">
             {reviews.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                        <MessageCircle size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No feedbacks yet</p>
                 </div>
             ) : (
                displayedReviews.map((review, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] hover:shadow-sm transition-all duration-200 ">
                       <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-[#334155]">{review?.userId?.name || review?.clientName || "Anonymous Client"}</h4>
                          <div className="flex items-center gap-0.5">
                             {[1,2,3,4,5].map(star => (
                                <Star 
                                  key={star} 
                                  size={12} 
                                  className={star <= (review?.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                />
                             ))}
                          </div>
                       </div>
                       <p className="text-xs text-[#64748B] leading-relaxed italic">"{review?.feedback || review?.comment || "No comment provided."}"</p>
                       <p className="text-[10px] text-[#94A3B8] font-medium mt-2 text-right">
                          {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                       </p>
                   </div>
                ))
             )}
          </div>
      </div>

    </div>
  );
};

export default ExpertCenterSide;
