import React from 'react'


const PossibleCard = ({ cardData, scrollRef }) => {
  return (
    <div
      ref={scrollRef}
      className="overflow-x-scroll scrollbar-hide pl-2.5  md:pl-[150px]"
    >
      <div className=" flex items-center gap-5 pr-2.5">
        {cardData.map((data) => (
          <div className="p-3 bg-[#F1ECE8] rounded-lg shrink-0 w-[calc(100vw-20px)] h-full md:w-fit">
            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
              <div className="bg-[#E5D8D1] px-5 py-1 absolute top-0 right-0 rounded-full hidden md:block">
                <p>1 Month</p>
              </div>
              {/* img container */}
              <div
                className="relative h-[360px] w-[223px] bg-cover bg-center rounded-lg shrink-0"
                style={{ backgroundImage: `url(http://localhost:5000${data.photo})` }}
              >
                <div className="bg-white py-1 px-5 rounded-full absolute bottom-5 left-5">
                  <p className="text-[16px] ">Before</p>
                </div>
              </div>
              {/* data container */}
              <div className="flex flex-col items-start justify-center gap-5 md:max-w-120 pr-10">
                <div className="flex flex-col items-start gap-1">
                  <h2 className="font-semibold text-[28px] tracking-[-4%] text-[#0A4F48]">
                    {data.name}
                  </h2>
                  <p className="text-[18]">{data.designation}</p>
                </div>
                <p>{data.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PossibleCard