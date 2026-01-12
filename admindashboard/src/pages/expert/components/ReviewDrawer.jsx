import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Play, Link as LinkIcon, FileText } from "lucide-react";

export default function ReviewDrawer({ review, onClose }) {
  if (!review) return null;

  const [expandedSections, setExpandedSections] = useState({
    warmup: true,
    exercise1: false,
    exercise2: false,
  });
  const [reviewText, setReviewText] = useState("");

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleApprove = () => {
    console.log("Approved");
    onClose();
  };

  const handleImprove = () => {
    console.log("Needs Improvement");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[360px] h-full bg-[#F8F9FA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-5 pb-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-[16px] text-gray-900">Detail View</h2>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[12px] font-semibold rounded-full">
              In Review
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Client Details */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-gray-500">Client Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Client Name</span>
                <span className="text-[13px] text-gray-900 font-medium">{review.clientName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Program</span>
                <span className="text-[13px] text-gray-900 font-medium">{review.program}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Date & Time</span>
                <span className="text-[13px] text-gray-900 font-medium">{review.dateTime}</span>
              </div>
            </div>
          </div>

          {/* Warm-up Section */}
          <div className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("warmup")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-[14px] font-semibold text-gray-900">Warm-up</h3>
              {expandedSections.warmup ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.warmup && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                <div className="pt-3">
                  <label className="text-[12px] text-gray-500 mb-2 block">Notes</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[12px] text-gray-700 leading-relaxed">
                      Start by stretching on one leg, and swinging the other leg forward and back. Use small swings that progress into larger swings as your hamstrings. Then transition to side-to-side leg swings.
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] text-gray-500 mb-2 block">Video</label>
                  <div className="flex items-center justify-between bg-[#FDF8F3] rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#F4DBC7] rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#8B6F47]" />
                      </div>
                      <div>
                        <p className="text-[12px] text-gray-900 font-medium">Breakfast-extra.mp4</p>
                        <p className="text-[11px] text-gray-500">8876 • 2.3 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-[11px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                        Get Link
                      </button>
                      <button className="px-3 py-1.5 text-[11px] font-medium text-white bg-[#0A4F48] rounded-lg hover:bg-[#083d37] transition-colors">
                        Play
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bodyweight Squats */}
          <div className="bg-white rounded-xl overflow-hidden border-l-4 border-[#0A4F48]">
            <button
              onClick={() => toggleSection("exercise1")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-[14px] font-semibold text-gray-900">Bodyweight Squats</h3>
              {expandedSections.exercise1 ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Glute Bridges */}
          <div className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("exercise2")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-[14px] font-semibold text-gray-900">Glute Bridges</h3>
              {expandedSections.exercise2 ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Client Feedback */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-gray-500">Client Feedback</h3>
            
            <div>
              <label className="text-[12px] text-gray-500 mb-2 block">Comment</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[12px] text-gray-700 leading-relaxed">
                  A no-cook, meal-prep-friendly option where oats are soaked in milk (dairy or plant-based) in the fridge overnight. They can be customized with toppings like fruits or nut butters.
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-[12px] text-gray-500 mb-2 block">Attachment</label>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <button className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#0A4F48] rounded-lg hover:bg-[#083d37] transition-colors">
                  Play
                </button>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-gray-500">Review</h3>
            <button className="w-full px-4 py-2 text-[13px] font-medium text-[#0A4F48] border border-[#0A4F48] rounded-lg hover:bg-[#0A4F48] hover:text-white transition-colors">
              Add Review
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-4 bg-white border-t border-gray-200 flex gap-3">
          <button
            onClick={handleImprove}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-[14px]"
          >
            Let's Improve
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 px-4 py-3 bg-[#0A4F48] text-white rounded-lg hover:bg-[#083d37] transition-colors font-medium text-[14px]"
          >
            Approved
          </button>
        </div>
      </div>
    </div>
  );
}
