import { assets } from "@/assets/asset";
import React from "react";



const assignedExperts = [
  {
    img: assets.profileVector,
    coach: "Trainer",
    name: "Rahul Mehta",
  },
  {
    img: assets.profileVector,
    coach: "Dietitian",
    name: "Anjali Sharma",
  },
  {
    img: assets.profileVector,
    coach: "Therapist",
    name: "Mira Kapoor",
  },
];

const ProfileLeftSide = ({ client }) => {

  const [day, month, year] = client.dob.split("-");
  const today = new Date();
  let age = today.getFullYear() - year;
  // console.log(age);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };
  

  const profileInfo = [
    {
      img: assets.GenderVector,
      title: "Gender",
      data: client.gender,
    },
    {
      img: assets.AgeVector,
      title: "Age",
      data: age,
    },
    {
      img: assets.EmailVector,
      title: "Email Address",
      data: client.email,
    },
    {
      img: assets.PhoneVector,
      title: "Phone Number",
      data: client.phone,
    },
    {
      img: assets.HomeVector,
      title: "Address",
      data: client.address,
    },
  ];

  return (
    <div className="w-[25%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar">
      {/* name */}
      <div className="w-full bg-white rounded-lg p-4 pt-7.5">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 px-[29px] pt-6">
            <h2 className="font-bold text-[16px] ">{client.name}</h2>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                {client.goals}
              </span>
              <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                {client.duration} Days
              </span>
              <span className="px-2 py-0.5 bg-[#45C4A2] rounded-full text-white">
                {client.status}
              </span>
            </div>
          </div>
          <div className="flex items-center flex-col gap-2.5 p-3 w-full rounded-lg bg-[#F8F8F8]">
            <div className="flex items-center justify-between w-full ">
              <span className="text-[#66706D] text-[12px]">Start Date</span>
              <span className="text-[12px]">
                {formatDate(client.programStartDate)}
              </span>
            </div>
            <div className="flex items-center justify-between w-full ">
              <span className="text-[#66706D] text-[12px]">End Date</span>
              <span className="text-[12px]">
                {formatDate(client.programEndDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* personal info */}
      <div className="p-4 w-full bg-white rounded-lg flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#0A4F48] font-bold text-[16px]">
            Personal Info
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 w-full">
          {profileInfo.map((items, i) => (
            <div className="flex items-start gap-4" key={i}>
              <div className="p-2.5 bg-[#EBF3F2] rounded-full">
                <img src={items.img} alt="" className="w-3.5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-[#66706D]">
                  {items.title}
                </span>
                <span className="text-[12px]">{items.data}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* third section */}
      <div className="flex flex-col gap-6 p-4 items-center bg-white rounded-lg w-full">
        {/* section 1 */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-between w-full py-[7px]">
            <h2 className="font-bold text-[16px] text-[#0A4F48]">Compliance</h2>
            <span className="text-[16px] font-bold">78%</span>
          </div>
          <div className="flex flex-col items-center w-full gap-4">
            <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
              <div className="absolute left-0 top-0 w-2 h-full bg-[#0A4F48] rounded-xs"></div>
              <div className="w-full flex items-center justify-between">
                <p className="text-[12px] ">Diet</p>
                <div className="flex items-center gap-1.5">
                  <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                    <p className="text-[10px]">
                      Missed Diet: <span>26</span>
                    </p>
                  </div>
                  <p className="text-[#0A4F48] text-[12px] font-bold">82%</p>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
              <div className="absolute left-0 top-0 w-2 h-full bg-[#F4DBC7] rounded-xs"></div>
              <div className="w-full flex items-center justify-between">
                <p className="text-[12px] ">Workout</p>
                <div className="flex items-center gap-1.5">
                  <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                    <p className="text-[10px]">
                      Missed Diet: <span>29</span>
                    </p>
                  </div>
                  <p className="text-[#0A4F48] text-[12px] font-bold">75%</p>
                </div>
              </div>
            </div>
            <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
              <div className="absolute left-0 top-0 w-2 h-full bg-[#EBF3F2] rounded-xs"></div>
              <div className="w-full flex items-center justify-between">
                <p className="text-[12px] ">Therapy</p>
                <div className="flex items-center gap-1.5">
                  <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                    <p className="text-[10px]">
                      Missed Diet: <span>16</span>
                    </p>
                  </div>
                  <p className="text-[#0A4F48] text-[12px] font-bold">68%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* section 2 */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-start w-full py-[7px]">
            <h2 className="font-bold text-[16px] text-[#0A4F48]">
              Assigned Experts
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 w-full">
            {assignedExperts.map((items, i) => (
              <div className="flex items-center justify-between w-full" key={i}>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#EBF3F2] rounded-full">
                    <img src={items.img} alt="" className="w-3.5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-[#66706D]">
                      {items.coach}
                    </span>
                    <span className="text-[12px]">{items.name}</span>
                  </div>
                </div>
                <img
                  src={assets.threeDotVector}
                  alt="dot menu"
                  className="w-3.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLeftSide;
