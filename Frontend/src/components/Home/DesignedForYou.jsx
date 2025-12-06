import React, { useRef } from "react";
import Heading from "../shared/Heading";
import DesignCard from "./DesignCard";
import { designData } from "../../utils/constants";
import SlidingArrow from "./SlidingArrow";

const DesignedForYou = () => {
  const scrollRef = useRef(null);

  // Scroll Left
  const slideLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -(window.innerWidth),
        behavior: "smooth",
      });
    }
  };

  // Scroll Right
  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: (window.innerWidth),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full py-15 bg-[#f1ece8]">
      <div className="flex flex-col items-center justify-center w-full gap-10">
        <Heading
          heading={"Designed for You"}
          description={"Personalized Program for Optimal Results."}
        />

        <div className="flex items-center justify-center gap-2 w-full">
          <DesignCard cardData={designData} scrollRef={scrollRef} />
        </div>

        <SlidingArrow slideLeft={slideLeft} slideRight={slideRight} />
      </div>
    </div>
  );
};

export default DesignedForYou;
