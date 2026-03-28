import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import { useDispatch } from "react-redux";
import { createFeedback } from "@/redux/features/client/client.thunk";
import { toast } from "react-toastify";
import { assets } from "@/assets/asset";
import { ENV } from "@/utils/env";
import { AiFillStar } from "react-icons/ai";

export default function Modal({ expert, onClose, fetchFeedbackData }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const user = useAppSelector(selectUser);

  const MIN_CHARS = 300;
  const MAX_CHARS = 500;

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const baseUrl = (ENV.API_BASE_URL || "").replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const getExpertImage = () => {
    if (expert?.image) return getFileUrl(expert.image);
    if (expert?.profile) return expert.profile;
    const role = (expert?.role || "").toLowerCase();
    if (role.includes("trainer")) return assets.trainerCartoon;
    if (role.includes("diet") || role.includes("nutrition")) return assets.dietitianCartoon;
    if (role.includes("therapist") || role.includes("therapy")) return assets.therapistCartoon;
    return assets.profile;
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }

    try {
      const values = {
        expertId: expert?._id,
        rating,
        feedback,
        userId: user?._id,
      };

      await dispatch(createFeedback(values)).unwrap();

      fetchFeedbackData();
      toast.success("Feedback submitted successfully");
    } catch (error) {
      // Display the specific error message from backend
      const errorMessage =
        error?.message || error || "Failed to submit feedback";
      toast.error(errorMessage);
    } finally {
      onClose();
      setRating(0);
      setHoveredRating(0);
      setFeedback("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:justify-end lg:flex-row">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── MOBILE: bottom sheet ── */}
      <div className="relative lg:hidden w-full bg-white rounded-t-4xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[92dvh]">
        {/* Grabber */}
        <div className="flex justify-center pt-4 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-3 pb-4 shrink-0">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Rate Your Experience
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6 no-scrollbar">
          {/* Expert Info Card */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
              <img
                src={getExpertImage()}
                alt={expert?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] text-gray-900 truncate">{expert?.name}</p>
              <p className="text-[12px] text-gray-500 capitalize">{expert?.role}</p>
            </div>
            <span className="shrink-0 text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase">
              Active
            </span>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Your Rating
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <AiFillStar
                    className={`w-9 h-9 transition-colors duration-150 ${
                      star <= (hoveredRating || rating)
                        ? "text-[#F5BA02]"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback textarea */}
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Share Your Feedback
            </p>
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, MAX_CHARS))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#0A4F48] focus:bg-white focus:outline-none rounded-2xl p-4 text-[14px] text-gray-700 placeholder:text-gray-400 min-h-[140px] resize-none transition-all"
                placeholder={`Character limit: ${MIN_CHARS}-${MAX_CHARS} chars`}
              />
              <span
                className={`absolute bottom-3 right-4 text-[11px] font-semibold ${
                  feedback.length < MIN_CHARS ? "text-gray-400" : "text-emerald-600"
                }`}
              >
                {feedback.length} / {MAX_CHARS}
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 pb-8 pt-4 shrink-0">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-[#0A4F48] text-white py-4 rounded-full text-[15px] font-black tracking-wide transition-all active:scale-95 shadow-lg shadow-[#0A4F48]/20"
          >
            Submit
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── DESKTOP: right sidebar drawer (unchanged style) ── */}
      <div className="relative hidden lg:flex w-[400px] h-full bg-white shadow-2xl flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-[18px] text-[#0A4F48]">Rate Your Experience</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Expert Info */}
          <div className="flex gap-4 items-center bg-gray-50 rounded-2xl p-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
              <img src={getExpertImage()} alt={expert?.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[15px] text-gray-900 truncate">{expert?.name}</h3>
              <p className="text-[12px] text-gray-500 capitalize mt-0.5">{expert?.role}</p>
            </div>
            <span className="shrink-0 text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase">
              Active
            </span>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Your Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-90"
                >
                  <AiFillStar
                    className={`w-9 h-9 transition-colors duration-150 ${
                      star <= (hoveredRating || rating) ? "text-[#F5BA02]" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Share Your Feedback</p>
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, MAX_CHARS))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#0A4F48] focus:bg-white focus:outline-none rounded-2xl p-4 text-[13px] text-gray-700 placeholder:text-gray-400 min-h-[140px] resize-none transition-all"
                placeholder={`Character limit: ${MIN_CHARS}-${MAX_CHARS} chars`}
              />
              <span
                className={`absolute bottom-3 right-4 text-[11px] font-semibold ${
                  feedback.length < MIN_CHARS ? "text-gray-400" : "text-emerald-600"
                }`}
              >
                {feedback.length} / {MAX_CHARS}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-[#0A4F48] text-white py-4 rounded-full text-[14px] font-black tracking-wide transition-all hover:bg-[#083d38] active:scale-95 shadow-lg shadow-[#0A4F48]/20"
          >
            Submit
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
