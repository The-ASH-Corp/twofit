import React, { useState, useEffect } from "react";
import Heading from "../shared/Heading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://outstanding-stillness-production.up.railway.app/api/v1/programs/list")
      .then((response) => {
        setPrograms(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
      });
  }, []);

  const handleClick = (id) => {
    navigate(`/programs/${id}`);
  };

  return (
    <div className=" py-12">
       <div className="text-center w-full justify-center mt-24">
        <Heading
          heading="Choose Your Plan"
          description="Guided programs designed for your goals"
        />
      </div>

       <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                gap-x-4 gap-y-4 mt-12 px-4 md:px-34"
      >
        {programs.map((item, i) => (
          <div
            key={i}
            className="group flex flex-col h-115 gap-1 md:gap-0 md:hover:gap-2 cursor-pointer"
            onClick={() => handleClick(item._id)}
          >
             <div
              className="relative rounded-2xl  h-full md:group-hover:h-full bg-center bg-cover transition-all duration-300"
              style={{
                backgroundImage: `url(${import.meta.env.VITE_API_URL}${item.photo})`,
              }}
            >
              <p className="absolute bottom-5 left-5 text-3xl text-white font-extrabold leading-tight tracking-tight">
                {item.title}
              </p>
            </div>

             <div className="group origin-bottom md:group-hover:flex w-full h-[30%] p-5 md:p-0 md:h-0 overflow-hidden md:group-hover:h-[30%] flex-col gap-4 bg-[#0A4F48] rounded-2xl md:group-hover:p-5 text-white transition-all duration-300">
              <p className="md:px-4 md:text-md text-xl lg:px-2">Duration</p>

              <div className="flex items-center justify-between w-full gap-x-2">
                {["30 Days", "60 Days", "90 Days"].map((days) => (
                  <button
                    key={days}
                    className="rounded-2xl px-4 py-1 bg-[#10635b]"
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>
          </div>


    

        ))}
      </div>
    </div>
  );
}
