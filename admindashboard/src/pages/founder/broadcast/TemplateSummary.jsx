import { assets } from '@/assets/asset';
import { MoreHorizontal } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

 const attachment = [
   {
     name: "Breakfast-oats.jpg",
     type: "JPG",
     size: "2.4 MB",
   },
   {
     name: "Healthy-snack-almond.pdf",
     type: "PDF",
     size: "2.4 MB",
   },
   {
     name: "Healthy-snack-almond.pdf",
     type: "PDF",
     size: "2.4 MB",
   },
   {
     name: "Healthy-snack-almond.pdf",
     type: "PDF",
     size: "2.4 MB",
   },
 ];

const TemplateSummary = () => {
  const navigate = useNavigate()
    const data = {
      message:
        "🔥 Level Up Your Health Journey!\r\n\r\nUpgrade from **30 Days → 60 Days** and get:\r\n\r\n✔ Free Diet Review \r\n✔ Weekly Progress Calls\r\n✔ Personalized Workout Videos\r\n\r\nLimited-time upgrade bonus! 🤩\r\n\r\n",
    };
   
  return (
    <div className="h-[calc(100vh-130px)] pb-4 overflow-auto no-scrollbar">
      <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-between gap-4 w-full lg:w-[50%] mb-5">
        {/* header */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[16px] text-[#0A4F48] font-bold">
            Broadcast Summary
          </h1>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
        {/* content */}
        <div className="w-full flex flex-col items-center justify-between gap-6">
          <div className="w-full flex flex-col items-start gap-2 pb-6 border-b border-b-[#DBDEDD]">
            <p className="text-[#66706D] text-[12px]">Broadcast Title</p>
            <p className="text-[#000000] text-[12px]">Upgrade Your Plan</p>
          </div>
          <div className="w-full flex flex-col items-start gap-2 pb-6 border-b border-b-[#DBDEDD]">
            <p className="text-[#66706D] text-[12px]">Broadcast Type</p>
            <p className="text-[#000000] text-[12px]">Promotional</p>
          </div>
          <div className="w-full flex flex-col items-start gap-2 pb-6 border-b border-b-[#DBDEDD]">
            <p className="text-[#66706D] text-[12px]">Broadcast Message</p>
            <div>
              <p className="text-[#000000] text-[12px] wrap-break-word whitespace-pre-wrap">
                {data.message}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col items-start gap-2 pb-6 ">
            <p className="text-[#66706D] text-[12px]">Attachments</p>
            <div className="flex items-center flex-wrap  gap-2 w-full">
              {attachment?.map((items, i) => (
                <div key={i} className="p-4 bg-[#F8F8F8] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#F4DBC7] rounded-md">
                      <img
                        src={assets.pdfVector}
                        alt="pdf"
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[12px]">{items?.name}</p>
                      <div className="flex gap-1 items-center">
                        <p className="text-[#66706D] text-[11px]">
                          {items?.type}
                        </p>
                        <span className="p-0.5 bg-[#DBDEDD] rounded-full"></span>
                        <p className="text-[#66706D] text-[11px]">
                          {items?.size}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="h-px bg-gray-200 w-full mt-2"></div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/founder/broadcasts")}
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#EBF3F2] text-[#0A4F48]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#0A4F48] text-white hover:bg-[#073a35] shadow-sm"
          >
            Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateSummary