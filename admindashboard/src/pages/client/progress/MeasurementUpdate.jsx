import { useDispatch } from "react-redux";
import { updateMeasurementOfClient } from "../../../redux/features/client/client.thunk";
import { useState } from "react";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";

export default function MeasurementUpdate() {
  const [chest,setChest]=useState("")
  const [waist,setWaist]=useState("")
  const [hip,setHip]=useState("")
  const user = useAppSelector(selectUser);
  
  const dispatch=useDispatch()
  const handleSubmit = async () => {
  if (!user?._id) {
    alert("User not found");
    return;
  }

  if (!chest || !waist || !hip) {
    alert("Please fill all fields");
    return;
  }

  try {
    await dispatch(
      updateMeasurementOfClient({
        id: user._id,
        chest: Number(chest),
        waist: Number(waist),
        hip: Number(hip),
      })
    ).unwrap();

    alert("Measurements updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update measurements");
  }
};

  return (
    <div className="space-y-4 flex flex-col h-full">
        <label>Chest</label>
      <input placeholder="Add Chest (cm)" className="w-full border focus:outline-none border-gray-200 p-2 rounded-lg" value={chest} onChange={(e)=>setChest(e.target.value)}/>
      <label>Waist</label>
      <input placeholder="Add Waist (cm)" className="w-full border focus:outline-none border-gray-200  p-2 rounded-lg" value={waist} onChange={(e)=>setWaist(e.target.value)}/>
      <label>Hip</label>
      <input placeholder="Add Hip (cm)" className="w-full border focus:outline-none border-gray-200  p-2 rounded-lg" value={hip} onChange={(e)=>setHip(e.target.value)}/>
      <button onClick={handleSubmit} className="w-full mt-auto bg-[#0A4F48] text-white py-2 focus:outline-none border-gray-400  rounded-lg">
        Save
      </button>
    </div>
  );
}
