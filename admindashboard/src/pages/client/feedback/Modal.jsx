import React, { useState } from "react";
import { X } from "lucide-react";
import { assets } from "@/assets/asset";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import { useDispatch } from "react-redux";
import { createFeedback } from "@/redux/features/client/client.thunk";
import { toast } from "react-toastify";

export default function Modal({ expert, onClose }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const user = useAppSelector(selectUser);

  const handleSubmit = async () => {
    const values = { expertId: expert._id, rating, feedback, userId: user._id };
    const response = await dispatch(createFeedback(values));
    if (response?.payload?.success) {
      onClose();
      toast.success("Feedback submitted successfully");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-[18px] text-[#0A4F48]">
            Rate Your Experience
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Expert Info */}
          <div className="flex gap-4 items-center">
            <img
              src={assets.profile}
              alt={expert.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-[15px] text-gray-800">
                {expert.name}
              </h3>
              <div className="flex flex-row gap-2">
                <p className="text-[11px] text-gray-600 px-3 py-1 rounded-full bg-gray-100 font-medium">
                  {expert.role}
                </p>
                <p className="text-[11px] px-3 py-1 rounded-full bg-emerald-500 text-white font-medium">
                  {expert.status}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-gray-700">
              Your Rating
            </p>
            <div className="flex gap-2 bg-gray-50 p-3 rounded-xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-gray-700">
              Share Your Feedback
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-[#0A4F48] focus:outline-none rounded-xl p-4 text-[13px] min-h-[140px] resize-none transition-all"
              placeholder="Character Limit 300-500 chars ..."
              maxLength={500}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="bg-[#0A4F48] w-full text-white px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#083d38] transition-colors shadow-lg shadow-emerald-900/10"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
