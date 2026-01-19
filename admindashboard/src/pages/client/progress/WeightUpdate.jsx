import { selectUser } from "@/redux/features/auth/auth.selectores";
import { updateWeightOfClient } from "@/redux/features/client/client.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function WeightUpdate() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    console.log("Selected Client:", user);
  }, [user]);

  const handleSubmit = async () => {
    if (!weight) {
      alert("Please enter weight");
      return;
    }

    if (!user?._id) {
      alert("User not found");
      return;
    }

    try {
      const res = await dispatch(
        updateWeightOfClient({
          id: user._id,
        currentWeight:Number(weight),
        })
      ).unwrap();
      console.log("Updated client:", res);
      alert("Weight updated successfully ");
    } catch (err) {
      console.log(err);
      alert("Failed to update weight");
    }
  };
  return (
    <div className="space-y-4  flex flex-col h-full">
      <label>Current Weight</label>
      <input
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        type="number"
        placeholder="Enter Weight (kg)"
        className="w-full border border-gray-200 rounded-xl focus:outline-none  p-2"
      />
      <div className="mt-auto">
        <button
          onClick={handleSubmit}
          className="bg-[#0A4F48] w-full bottom-0   text-white px-4 py-2 rounded-xl"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
