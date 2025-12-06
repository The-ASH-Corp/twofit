import React from "react";
import { motion as Motion } from "framer-motion";

const DesignCard = ({ cardData, scrollRef }) => {
  return (
    <div
      ref={scrollRef}
      className="overflow-x-scroll scrollbar-hide pl-5 md:pl-[150px] pr-5 flex items-center gap-5 flex-nowrap"
    >
      {cardData.map((item) => (
        <div
          key={item.id}
          className="group flex flex-col w-full sm:w-[350px] h-[550px] gap-4 shrink-0"
        >
          {/* Top Image Block */}
          <div
            className="relative rounded-2xl h-full w-full bg-center bg-cover transition-all duration-300 md:group-hover:h-[69%]"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            <p className="absolute bottom-[35px] left-5 text-3xl text-white font-extrabold leading-[1.2] tracking-[-1px]">
              {item.heading}
            </p>
          </div>

          {/* Bottom Hover Content */}
          <div
            className="
            group origin-bottom 
            w-full 
            h-[30%] p-5 
            md:p-0 md:h-0 
            overflow-hidden 
            md:group-hover:h-[25%] 
            flex flex-col gap-4 
            bg-[#0A4F48] rounded-2xl 
            md:group-hover:p-5 
            text-white 
            transition-all duration-300
          "
          >
            <p className="md:px-4 font-semibold text-[28px] lg:px-2">Duration</p>

            <div className="flex items-center justify-between w-full gap-x-2 font-semibold text-[12px] sm:text-[16px]">
              <button className="rounded-2xl px-4 py-1 bg-[#10635b]">
                30 Days
              </button>
              <button className="rounded-2xl px-4 py-1 bg-[#10635b]">
                60 Days
              </button>
              <button className="rounded-2xl px-4 py-1 bg-[#10635b]">
                90 Days
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DesignCard;
