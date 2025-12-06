// import React, { useState } from 'react'
import arrowDown from "../../assets/Icons/VectorDownBlack.svg";
import arrowUp from "../../assets/Icons/VectorUp.svg"


const FooterLink = ({ index, data, activeIndex, setActiveIndex }) => {
  return (
    <div
      className="flex flex-col items-start gap-4 pb- w-full border-b border-b-gray-300"
    >
      <div
        className="flex justify-between items-center w-full"
        onClick={() => setActiveIndex(index === activeIndex ? null : index)}
      >
        <h2 className="text-[18px] font-semibold text-[#0A4F48]">
          {data.heading}
        </h2>
        <button
          onClick={() => setActiveIndex(index === activeIndex ? null : index)}
        >
          <img
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
        <ul className="flex flex-col items-start gap-2 text-[12px] pb-2">
          {data.links.map((link) => (
            <li>
              <a href="#">{link}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FooterLink;