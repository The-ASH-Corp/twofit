import React from 'react'
import { motion as Motion } from "framer-motion";


const ProgramCard = ({cardData}) => {
  return (
    <div className="overflow-y-scroll scrollbar-hide md:pl-[150px] ">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" bg-white rounded-4xl flex flex-col md:flex-row items-center justify-between gap-10 "
      >
        {cardData.map((data) => (
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative h-[605px] w-[calc(100vw-20px)] md:w-[376px] rounded-4xl mx-">
              <img
                src={data.img}
                alt="card img"
                className="h-full rounded-4xl object-cover"
              />
              <h1 className="absolute top-15 left-[50px] right-3 font-bold text-[40px] leading-[100%] tracking-[-0.04em]">
                {data.heading}
              </h1>
            </div>
            <div className="md:h-[605px] w-[calc(100vw-20px)] md:w-2xl rounded-4xl bg-[#0a4f48] px-5 md:px-15 py-8 ">
              <div className="flex flex-col items-start justify-between   text-white">
                {data.details.map((details) => (
                  <div className="w-full py-6 flex flex-col items-start justify-center border-b border-b-gray-800 gap-2.5">
                    <h2 className="font-semibold text-[20px] leading-[100%] tracking-[-0.04em]">
                      {details.heading}
                    </h2>
                    <span className="text-16 leading-[130%]">
                      {details.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Motion.div>
    </div>
  );
}

export default ProgramCard