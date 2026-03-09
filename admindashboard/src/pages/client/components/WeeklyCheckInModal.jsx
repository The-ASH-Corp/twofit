import React, { useState } from "react";

const questions = [
  { id: "progress_confidence", label: "Progress Confidence", description: "How confident do you feel about your progress?" },
];

export default function WeeklyCheckInModal({ weekIndex, onSubmit }) {
  const [responses, setResponses] = useState(
    questions.map((q) => ({ description: q.label, rating: 0 }))
  );
  const [submitting, setSubmitting] = useState(false);


  const getScaleLabel = (rating) => {
    switch (rating) {
      case 1: return "Very Low";
      case 2: return "Low";
      case 3: return "Neutral";
      case 4: return "Confident";
      case 5: return "Very Confident";
      default: return "";
    }
  };


  const handleRate = (index, rating) => {
    const newResponses = [...responses];
    newResponses[index].rating = rating;
    newResponses[index].description = getScaleLabel(rating);
    setResponses(newResponses);
  };

  const isComplete = responses.every((r) => r.rating > 0);

  const handleSubmit = async () => {
    if (!isComplete) return;
    setSubmitting(true);
    try {
      await onSubmit(weekIndex, responses);
    } catch (error) {
      console.error("Failed to submit check-in:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop - Non-closable */}
      <div 
        className="fixed inset-0 bg-[#0A4F48]/40 backdrop-blur-md"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
        {/* Header */}
        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex justify-between items-start border-b border-gray-50">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#0A4F48]">Weekly Assessment</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium italic">
              Question: "<span className="text-[#0A4F48] font-bold">How confident do you feel about your progress?</span>"
            </p>
          </div>
        </div>

        {/* content */}
        <div className="px-6 md:px-8 py-6 md:py-8 overflow-y-auto max-h-[70vh] space-y-6 md:space-y-8 no-scrollbar">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-4 md:space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-lg font-bold text-gray-800">{q.label}</label>
                <div className="h-6">
                  {responses[idx].rating > 0 && (
                    <span className="text-[10px] md:text-sm font-bold text-[#0A4F48] bg-[#EBF3F2] px-3 py-1 rounded-full animate-in fade-in slide-in-from-left-2 transition-all">
                      {getScaleLabel(responses[idx].rating)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between items-stretch md:items-center bg-[#F8F9FA] p-4 md:p-6 rounded-2xl border border-gray-50 gap-3 md:gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="relative group/tooltip flex-1 md:max-w-[64px]">
                    {/* Desktop Tooltip Popup */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1.5 bg-[#0A4F48] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap mb-2 shadow-lg z-20 hidden md:block">
                      {getScaleLabel(num)}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0A4F48]" />
                    </div>

                    <button
                      onClick={() => handleRate(idx, num)}
                      className={`w-full flex items-center md:flex-col gap-4 md:gap-1 p-2 md:p-0 rounded-xl transition-all duration-200 transform md:hover:scale-110 active:scale-[0.98] md:active:scale-95 ${
                        responses[idx].rating === num 
                          ? "bg-white md:bg-transparent shadow-sm md:shadow-none" 
                          : "hover:bg-[#EBF3F2] md:hover:bg-transparent"
                      }`}
                    >
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${
                        responses[idx].rating === num 
                          ? "bg-[#0A4F48] text-white shadow-lg shadow-emerald-900/20" 
                          : "bg-white md:bg-white text-gray-400 md:text-gray-400"
                      }`}>
                        <span className="text-base md:text-lg font-bold">{num}</span>
                      </div>
                      
                      {/* Mobile Label - Vertical List style */}
                      <span className={`md:hidden text-sm font-bold transition-colors ${
                        responses[idx].rating === num ? "text-[#0A4F48]" : "text-gray-400"
                      }`}>
                        {getScaleLabel(num)}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="hidden md:flex justify-between px-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">1 - Low Confidence</span>
                <span className="text-[11px] font-bold text-[#0A4F48] uppercase tracking-wider">5 - High Confidence</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || submitting}
            className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-bold transition-all shadow-lg ${
              isComplete && !submitting
                ? "bg-[#0A4F48] text-white hover:bg-[#083d38] shadow-emerald-900/20 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Complete Assessment"
            )}
          </button>
          <p className="text-center text-[9px] md:text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest leading-relaxed">
            Required to access dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
