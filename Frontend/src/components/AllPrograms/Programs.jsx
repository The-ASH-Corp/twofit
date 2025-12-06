import React, { useState, useEffect } from 'react';
import Heading from '../shared/Heading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Programs() {
  const [program, setProgram] = useState([])
  const navigate = useNavigate()





  useEffect(() => {
    axios
      .get('http://localhost:4000/api/v1/allprograms/programs')
      .then((response) => {
        setProgram(response.data.data);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const handleClick = (id) => {
    navigate(`/programs/${id}`)
  }



    return (
      <div className="">
        <div className="flex flex-col  items-center w-full justify-center py-15">
          <Heading
            heading="Choose Your Plan"
            description="Guided programs designed for your goals"
          />
        </div>
        <div className=" grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 px-30 ">
          {program.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col w-75 h-115 gap-4 md:gap-0 md:hover:gap-2"
              onClick={() => handleClick(item._id)}
            >
              <div
                className="relative rounded-2xl h-full md:group-hover:h-70 bg-center bg-cover transition-all duration-300 "
                style={{ backgroundImage: `url(http://localhost:4000${item.photo})` }}
              >
                <p className="absolute  bottom-18 left-9 text-4xl text-white font-extrabold leading-[1.2] tracking-[-1px] ">
                  {item.title}
                </p>
              </div>

              <div className="group origin-bottom md:group-hover:flex  w-full h-[30%] p-5 md:p-0 md:h-0 overflow-hidden md:group-hover:h-[30%]  flex-col gap-4   bg-[#0A4F48] rounded-2xl md:group-hover:p-5 text-white transition-all duration-300 ">
                <p className="md:px-4 md:text-md text-xl lg:px-2 ">Duration</p>
                <div className="flex items-center justify-between w-full gap-x-2">
                  <button className="rounded-2xl px-4 py-1 border-gray-500   bg-[#10635b]">
                    30 Days
                  </button>
                  <button className="rounded-2xl px-4 py-1 border-gray-500   bg-[#10635b]">
                    60 Days
                  </button>
                  <button className="rounded-2xl px-4 py-1 border-gray-500   bg-[#10635b]">
                    90 Days
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>{/* <Faq/> */}</div>
        <div>{/* <SeeWhatPossible/> */}</div>
      </div>
    );
  }

