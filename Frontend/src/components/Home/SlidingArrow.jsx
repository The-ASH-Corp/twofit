import React from "react";
import arrowLeft from "../../assets/Icons/VectorLeft.svg";
import arrowRight from "../../assets/Icons/VectorRight.svg";

const SlidingArrow = ({ slideLeft, slideRight }) => {
  return (
    <div className="flex justify-between items-center gap-4.5">
      <button onClick={slideLeft} className="bg-gray-100 rounded-full p-4">
        <img src={arrowLeft} alt="" />
      </button>

      <button onClick={slideRight} className="bg-[#0a4f48] rounded-full p-4">
        <img src={arrowRight} alt="" />
      </button>
    </div>
  );
};

export default SlidingArrow;
