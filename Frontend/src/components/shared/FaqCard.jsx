// import React, { useState } from 'react'
import arrowDown from "../../assets/Icons/VectorDown.svg";
import arrowUp from "../../assets/Icons/VectorUp.svg"


const FaqCard = ({ index, question, answer, activeIndex, setActiveIndex }) => {
  return (
    <div
      key={index}
      className={`flex flex-col items-start gap-3 pb-5 w-full ${
        activeIndex === index
          ? "border-b-2 border-b-[#00DFB3]"
          : "border-b border-b-gray-500 "
      }`}
    >
      <div
        className="flex justify-between items-center w-full"
        onClick={() => setActiveIndex(index === activeIndex ? null : index)}
      >
        <p className="text-[20px] font-semibold tracking-[-4%] pr-10">{question}</p>
        <button
          onClick={() => setActiveIndex(index === activeIndex ? null : index)}
        >
          <img
          className="min-w-3"
            src={activeIndex === index ? arrowUp : arrowDown}
            alt="arrow down"
          />
        </button>
      </div>
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${
            activeIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }
        `}
      >
        <p className="md:w-[70%] text-[14px] leading-[140%] text-gray-300 py-2">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FaqCard