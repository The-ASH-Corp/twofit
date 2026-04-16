import { selectUser } from "@/redux/features/auth/auth.selectores";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";
import { updateWeightOfClient } from "@/redux/features/client/client.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function WeightUpdate({ onClose }) {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const [weight, setWeight] = useState("");
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [sidePhoto, setSidePhoto] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [sidePreview, setSidePreview] = useState(null);

  const handleFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontPhoto(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleSideChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSidePhoto(file);
      setSidePreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weight) {
      toast.info("Please enter weight");
      return;
    }

    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    const formData = new FormData();
    formData.append("currentWeight", Number(weight));

    if (frontPhoto) formData.append("frontPhoto", frontPhoto);
    if (sidePhoto) formData.append("sidePhoto", sidePhoto);

    try {
      await dispatch(
        updateWeightOfClient({
          id: user._id,
          data: formData,
        }),
      ).unwrap();

      await dispatch(
        refreshProfile({ id: user._id, role: user.role }),
      ).unwrap();

      console.log("hello")

      toast.success("Weight updated successfully");
      if (onClose) onClose();
    } catch (err) {
      toast.error(`Failed to update weight ${err}`);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-center">
          <div className="mb-3 flex flex-col items-center gap-1">
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              FRONT PHOTO
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                name="frontPhoto"
                accept="image/*"
                onChange={handleFrontChange}
                className="hidden"
              />

              <img
                src={frontPreview}
                className="w-24 h-24 object-fill rounded-xl border hover:opacity-80"
              />
            </label>

            <p className="text-xs text-gray-500">Click to add photo</p>
          </div>
          <div className="mb-3 flex flex-col items-center gap-1">
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              SIDE PHOTO
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                name="sidePhoto"
                accept="image/*"
                onChange={handleSideChange}
                className="hidden"
              />

              <img
                src={sidePreview}
                className="w-24 h-24 object-fill rounded-xl border hover:opacity-80"
              />
            </label>

            <p className="text-xs text-gray-500">Click to add photo</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[14px] font-medium text-gray-700">
            Current Weight
          </label>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            placeholder="Add weight (kg)"
            className="w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 p-3"
          />
        </div>
      </form>

      <div className="space-y-3 mt-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-[#0A4F48] text-white py-3 rounded-xl font-medium hover:bg-[#083d38] transition-colors"
        >
          Save & Update
        </button>
      </div>
    </div>
  );
}
