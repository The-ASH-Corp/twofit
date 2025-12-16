import React from 'react'

const ClientProfile = () => {
  return (
    <div className="flex justify-between w-full gap-4">
      {/* left */}
      <div className="w-[25%] flex flex-col items-center gap-4">
        {/* name */}
        <div className="w-full bg-white rounded-lg p-4 pt-7.5">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3 px-[29px] pt-6">
              <h2 className="font-bold text-[16px] ">Aarav Kumar</h2>
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                  Weight Loss
                </span>
                <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                  60 Days
                </span>
                <span className="px-2 py-0.5 bg-[#45C4A2] rounded-full text-white">
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-center flex-col gap-2.5 p-3 w-full rounded-lg bg-[#F8F8F8]">
              <div className="flex items-center justify-between w-full ">
                <span className="text-[#66706D] text-[12px]">Start Date</span>
                <span className="text-[12px]">02 Jan 2025</span>
              </div>
              <div className="flex items-center justify-between w-full ">
                <span className="text-[#66706D] text-[12px]">Start Date</span>
                <span className="text-[12px]">02 Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
        {/* personal info */}
        <div className="p-4 w-full bg-white rounded-lg flex flex-col items-center gap-4">
          <div className='flex items-center justify-between w-full'>
            <h2 className="text-[#0A4F48] font-bold text-[16px]">Personal Info</h2>
            <span>j</span>
          </div>
          <div className='flex flex-col items-start gap-4 w-full'>
            <div className='flex items-center gap-4'>
                <div className='p-2.5'></div>
            </div>
          </div>
        </div>
      </div>
      {/* center */}
      <div className="w-[50%] bg-amber-200"></div>
      {/* right */}
      <div className="w-[25%] bg-amber-200"></div>
    </div>
  );
}

export default ClientProfile