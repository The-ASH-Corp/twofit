
import { CalendarDays, Goal, RulerDimensionLine, Signature, Weight } from 'lucide-react';
import React from 'react'


const ClientDetails = ({user}) => {

    
    function calculateAge(dob) {
      const birthDate = new Date(dob);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() >= birthDate.getDate());

      if (!hasBirthdayPassed) {
        age--;
      }

      return age;
    }

  return (
    <div className="client-card hero-project-card relative w-full  overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-1 flex-col gap-5">
        <h2 className="client-title text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.1] tracking-[-0.02em]">
          Your details
        </h2>

        <div className="flex items-center gap-4 w-full flex-wrap wrap-normal">
          <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
            <div className="rounded-xl bg-gray-50 p-1">
              <Signature size={29} color="#0A4F48" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <p className="font-bold text-[15px]">Name</p>
              <p className="text-[13px] text-gray-600">{user?.name}</p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
            <div className="rounded-xl bg-gray-50 p-1">
              <CalendarDays size={29} color="#0A4F48" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <p className="font-bold text-[15px]">Age</p>
              <p className="text-[13px] text-gray-600">
                {calculateAge(user?.dob)} Y/O
              </p>
            </div>
          </div>
          <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
            <div className="rounded-xl bg-gray-50 p-1">
              <Goal size={29} color="#0A4F48" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <p className="font-bold text-[15px]">Goal</p>
              <p className="text-[13px] text-gray-600">{user?.goals}</p>
            </div>
          </div>

          <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
            <div className="rounded-xl bg-gray-50 p-1">
              <RulerDimensionLine size={29} color="#0A4F48" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <p className="font-bold text-[15px]">Height</p>
              <p className="text-[13px] text-gray-600">{user?.height} CM</p>
            </div>
          </div>

          <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
            <div className="rounded-xl bg-gray-50 p-1">
              <Weight size={29} color="#0A4F48" />
            </div>
            <div className="flex flex-col items-start justify-start">
              <p className="font-bold text-[15px]">Weight</p>
              <p className="text-[13px] text-gray-600">
                {user?.weightHistory[user?.weightHistory?.length - 1]?.weight}{" "}
                KG
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails