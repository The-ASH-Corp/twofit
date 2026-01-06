import React from "react";

export default function Modal({ expert, onClose }) {
  const [rating, setRating] = React.useState(0);
  return (
    <div className="absolute right-0 h-full bg-white shadow-md rounded-2xl right-5 p-4 w-[300px] top-3 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-[#0A4F48] text-[16px] font-bold">
          Rate Your Experience
        </h1>
        <h1 onClick={onClose} className="cursor-pointer">
          close
        </h1>
      </div>

      <div className="flex gap-3 items-center mt-10 ">
        <img
          src={expert.image}
          alt={expert.name}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-sm">{expert.name}</h3>
          <div className="flex flex-row gap-2">
            <p className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-200 text-black">
              {expert.role}
            </p>
            <p className="text-xs px-3 py-1 rounded-full bg-[#45C4A2] text-white">
              {expert.status}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <p className="text-[11px] font-medium">Your Rating</p>
        <div className="flex gap-2  bg-[#F8F8F8] p-2 rounded-xl ">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-[11px] font-medium">Share Your Feedback:</p>
        <div className="">
          <textarea
            className="w-full  border border-[#e0dbdb] focus:outline-none focus:ring-0 rounded-xl p-2 h-24"
            placeholder="Character Limit 300-500 chars ..."
          ></textarea>
        </div>
      </div>

      <div className="mt-auto">
        <button className="bg-[#0A4F48] w-full bottom-0   text-white px-4 py-2 rounded-xl">
          Submit
        </button>
      </div>
    </div>
  );
}
