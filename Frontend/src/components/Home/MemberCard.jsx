import React from "react";


const MemberCard = ({ cardData }) => {
  return (
    <div className=" flex flex-col gap-10">
      <div className="pr-5 flex items-center justify-between gap-5   overflow-y-scroll scrollbar-hide">

        {cardData.slice(0,cardData.length/2).map((data) => (
          <div className="flex items-center justify-between gap-2 p-1 pr-8 bg-[#F1F1F1] rounded-full shrink-0">
            <img src={`http://localhost:4000${data.photo}`} alt="" className="w-13 h-13 object-cover rounded-full" />
            <p className="font-semibold text-[20px] tracking-[-4%] text-[#0A4F48]">
              {data.name}
            </p>
          </div>
        ))}
      </div>
      <div className="pr-5 flex items-center justify-between gap-5  overflow-y-scroll scrollbar-hide">

        {cardData.slice(cardData.length/2).map((data) => (
          <div className="flex items-center justify-between gap-2 p-1 pr-8 bg-[#F1F1F1] rounded-full shrink-0">
            <img src={`http://localhost:4000${data.photo}`} alt="" className="w-13 h-13 object-cover rounded-full" />
            <p className="font-semibold text-[20px] tracking-[-4%] text-[#0A4F48]">
              {data.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberCard;
