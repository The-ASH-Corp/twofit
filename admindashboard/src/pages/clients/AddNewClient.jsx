import React from 'react'

const AddNewClient = () => {
  return (
    <div className="flex items-center flex-col gap-4">
      {/* forms */}
      <div className="flex items-center justify-between w-full">
        {/* left */}
        <div className="w-[70%] bg-amber-200">dfgh</div>
        {/* right */}
        <div className="w-[30%] bg-amber-600">cfvgbhnjm</div>
      </div>
      {/* buttons */}
      <div className="flex items-center justify-between pt-4 w-full border-t border-t-gray-400 ">
        <div>
          <button className="font-semibold text-[12px] ">Save as Draft</button>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="font-semibold text-[12px] px-3.5 py-[11px] bg-[#EBF3F2] rounded-lg">
            Cancel
          </button>
          <button className="font-semibold text-[12px] px-3.5 py-[11px] bg-[#0A4F48] rounded-lg text-white">
            Save & Add Client
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewClient