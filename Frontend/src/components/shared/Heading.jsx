import React from 'react'

const Heading = ({heading, description}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-[26px]">
      <h1 className="text-[27px] md:text-[75px] tracking-[-4%] leading-none font-bold text-center">
        {heading}
      </h1>
      <p className="text-[13px] md:text-[22px] text-center leading-[150%]">{description}</p>
    </div>
  );
}

export default Heading