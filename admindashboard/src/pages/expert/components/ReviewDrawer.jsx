import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Play,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { verifyTask, rejectTask } from "@/redux/features/tasks/task.thunk";

export default function ReviewDrawer({ review, onClose }) {
  if (!review) return null;
  const dispatch = useDispatch();

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    file: true,
  });
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleApprove = async () => {
    setProcessing(true);
    await dispatch(verifyTask(review._id));
    setProcessing(false);
    onClose();
  };

  const handleImprove = async () => {
    if (!comment) {
      alert("Please provide a comment for improvement");
      return;
    }
    setProcessing(true);
    await dispatch(rejectTask({ id: review._id, comment }));
    setProcessing(false);
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
            <h2 className="font-semibold text-[16px] text-gray-900">
              Task Review
            </h2>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-[12px] font-semibold rounded-full uppercase">
              {review.status}
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
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-[13px] font-semibold text-gray-500 uppercase">
                Client Details
              </h3>
              {expandedSections.details ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedSections.details && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Client Name</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    {review.userId?.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Program</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    {review.programId?.title || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Task</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    Day {review.globalDayIndex} - Ex {review.exerciseIndex + 1}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Submitted</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submission Preview */}
          <div className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("file")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-[14px] font-semibold text-gray-900">
                Submission Proof
              </h3>
              {expandedSections.file ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.file && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                <div className="pt-3">
                  <label className="text-[12px] text-gray-500 mb-2 block">
                    Client's Notes
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[12px] text-gray-700 leading-relaxed">
                      {review.notes || "No notes provided"}
                    </p>
                  </div>
                </div>

                {review.file && (
                  <div className="rounded-lg overflow-hidden border border-gray-100">
                    {review.file.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${review.file}`}
                        controls
                        className="w-full h-auto"
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${review.file}`}
                        alt="Proof"
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-gray-500 uppercase">
              Your Feedback
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide feedback for the client..."
              className="w-full h-24 text-[13px] border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#0A4F48] bg-gray-50/50"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-4 bg-white border-t border-gray-200 flex gap-3">
          <button
            onClick={handleImprove}
            disabled={processing}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-[14px] disabled:opacity-50"
          >
            Needs Work
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-[#0A4F48] text-white rounded-lg hover:bg-[#083d37] transition-colors font-medium text-[14px] disabled:opacity-50"
          >
            {processing ? "..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
