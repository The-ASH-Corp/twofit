import React, { useState } from "react";
import { X } from "lucide-react";
import { assets } from "@/assets/asset";

export default function TaskModal({ task, onClose }) {
  const [fileName, setFileName] = useState("Upload File");
  const [showVideoModal, setShowVideoModal] = useState(false);
console.log(task)
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[400px] h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#0A4F48] text-[18px] font-bold">{task.type|| task.name}</h1>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 -mr-2 scrollbar-hide">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm">
            <img
              src={"src/assets/Workout.png"}
              alt={task.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <p className="text-[13px] text-gray-800 leading-relaxed font-medium">
              {task.notes}
            </p>
          </div>

          {/* PDF Card */}
          <div className="flex items-center justify-between bg-[#FDF8F3] p-4 rounded-[20px] border border-[#FBEAD9]/50">
            <div className="flex items-center gap-4">
              {/* <div className="w-11 h-11 bg-[#FBEAD9] flex items-center justify-center rounded-xl shadow-sm">
                <img src={assets.pdfVector} alt="pdf" className="w-5 h-5" />
              </div> */}
              <div>
                <p className="text-[14px] font-bold text-gray-800 leading-none mb-1.5">
                 {task.mediaName }
                </p>
                {/* <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                  PDF • 2.4 MB
                </p> */}
              </div>
            </div>
            <button 
              onClick={() => setShowVideoModal(true)}
              className="bg-[#0A4F48] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#083d38] transition-colors">
              View
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-700 block">
                Comment
              </label>
              <input
                type="text"
                placeholder="Add Comment"
                className="w-full border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-[#0A4F48] focus:outline-none p-3 px-4 text-[13px] rounded-xl transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-700 block">
                Attachment
              </label>
              <label className="w-full flex items-center justify-between border border-gray-100 bg-gray-50/30 rounded-xl p-1.5 cursor-pointer hover:bg-white hover:border-gray-200 transition-all">
                <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-[13px] font-bold">
                  Upload File
                </span>
                <span className="text-[13px] text-gray-400 font-medium pr-4">
                  Upload Photo or video
                </span>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-6 mt-6 border-t border-gray-50">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors"
          >
            Skip
          </button>
          <button className="flex-1 bg-[#0A4F48] text-white px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#083d38] transition-colors shadow-lg shadow-emerald-900/10">
            Mark as Done
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-[#0A4F48] text-lg font-bold">Exercise Video</h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <video
                controls
                autoPlay
                className="w-full rounded-xl"
                src={task.url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
