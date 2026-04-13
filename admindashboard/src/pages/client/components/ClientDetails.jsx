
import React from 'react'

const ClientDetails = ({user}) => {

    console.log(user)

  return (
    <div className="client-card hero-project-card relative w-full  overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-1 flex-col pr-[120px] sm:pr-[200px] lg:pr-60 gap-5">
        <h2 className="client-title text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.1] tracking-[-0.02em]">
          Your details
        </h2>

        <div className="flex items-center gap-4 w-full">
          <div className="px-4 py-1 bg-gray-100 rounded-xl flex flex-col items-start justify-start">
            <p className="font-bold text-[15px]">Height</p>
            <p className="text-[13px]">{user?.height} CM</p>
          </div>
          <div className="px-4 py-1 bg-gray-100 rounded-xl flex flex-col items-start justify-start">
            <p className="font-bold text-[15px]">Height</p>
            <p className="text-[13px]">{user?.height} CM</p>
          </div>
          <div className="px-4 py-1 bg-gray-100 rounded-xl flex flex-col items-start justify-start">
            <p className="font-bold text-[15px]">Height</p>
            <p className="text-[13px]">{user?.height} CM</p>
          </div>
          <div className="px-4 py-1 bg-gray-100 rounded-xl flex flex-col items-start justify-start">
            <p className="font-bold text-[15px]">Height</p>
            <p className="text-[13px]">{user?.height} CM</p>
          </div>
          <div className="px-4 py-1 bg-gray-100 rounded-xl flex flex-col items-start justify-start">
            <p className="font-bold text-[15px]">Height</p>
            <p className="text-[13px]">{user?.height} CM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails