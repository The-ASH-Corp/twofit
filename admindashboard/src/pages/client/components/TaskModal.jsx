import React, { useState } from "react";

export default function TaskModal({ task, onClose }) {
  const [fileName, setFileName] = useState("Upload File");

  return (
    <div className="absolute w-[350px] flex flex-col h-full bg-white rounded-2xl  right-0 top-5  p-4 space-y-4 shadow-md">
      <h1 className="text-[#0A4F48] text-[14px] font-bold">{task.type}</h1>
      <img src={task.image} />
      <div className="flex gap-1">
        <p className="text-[12px] font-400">{task.time}</p>
        <p className="text-[12px] font-400">{task.desc}</p>
      </div>
      <div className="block space-y-2">
        <label className="text-[11px] block">Comment</label>
        <input
          type="text"
          placeholder="Add Comment"
          className="border border-gray-200 focus:outline-none p-2 w-full rounded-xl"
        />

        <div className="block space-y-2">
          <label className="text-[11px] block">Attachments</label>

          <label className="w-full flex items-center gap-3 border border-gray-200 rounded-xl p-2 cursor-pointer">
            <span className="bg-[#0A4F48] text-white px-4 py-2 rounded-2xl text-sm">
              Upload File
            </span>
            <span className="text-sm text-gray-500">Upload image or video</span>

            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex justify-between gap-2 mt-auto">
        <button className="bg-[#EBF3F2] px-4 py-2 rounded-md w-full">
          Skip
        </button>
        <button className="w-full bg-[#0A4F48] px-4 py-2 rounded-md">
          Mark as Done
        </button>
      </div>
    </div>
  );
}
