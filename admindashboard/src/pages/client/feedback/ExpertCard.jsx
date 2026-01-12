import { assets } from "@/assets/asset";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";

export default function ExpertCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const user = useAppSelector(selectUser);
  const [experts, setExperts] = useState([]);

  const dispatch = useDispatch();
  const fetchExperts = async () => {
    try {
      const coaches = await dispatch(
        getAllCoachesByAdmin([user?.trainer, user?.therapist, user?.dietition])
      ).unwrap();

      setExperts(coaches.filter((coach)=>(coach!== null && coach!== undefined)));
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };
  useEffect(() => {
    fetchExperts();
  }, []);  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full ">
      {experts.map((expert, index) => (
        <div key={index} className="bg-white rounded-xl p-4  ">
          {/* Header */}
          <div className="flex gap-3 items-center">
            <img
              src={assets.profile}
              alt={expert.name}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-sm">{expert?.name}</h3>
              <div className="flex flex-row gap-2">
                <p className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-200 text-black">
                  {expert?.role}
                </p>
                <p className="text-xs px-3 py-1 rounded-full bg-[#45C4A2] text-white">
                  {expert?.status}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-3   bg-[#F8F8F8] p-3 rounded-lg text-xs space-y-3">
            <div className="space-y-2">
              <p className="text-gray-500">Experience</p>
              <p className="font-medium text-black">{expert?.experience}</p>
            </div>
            <hr className="text-gray-300"></hr>

            <div className="space-y-2">
              <p className="text-gray-500">Certification</p>
              <p className="font-medium">{expert?.qualification}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedExpert(expert);
              setIsOpen(!isOpen);
            }}
            className="text-white p-3 bg-[#0A4F48] rounded-xl  mt-4"
          >
            Rate & Review
          </button>
        </div>
      ))}

      {isOpen ? (
        <Modal expert={selectedExpert} onClose={() => setIsOpen(false)} />
      ) : (
        ""
      )}
    </div>
  );
}
