import { selectUser } from "@/redux/features/auth/auth.selectores";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";
import { updateWeightOfClient } from "@/redux/features/client/client.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { useEffect, useState } from "react";
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

  const isFirstTime = !user?.weightHistory || user.weightHistory.every(h => !h.frontPhoto && !h.sidePhoto);

  useEffect(() => {
    if (user?.currentWeight) {
      setWeight(user.currentWeight.toString());
    }
  }, [user?.currentWeight]);

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

    if (!weight && !isFirstTime) {
      toast.info("Please enter weight");
      return;
    }

    if (!frontPhoto && !sidePhoto) {
      toast.info("Please add at least one photo");
      return;
    }

    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    const formData = new FormData();
    if (weight) formData.append("currentWeight", Number(weight));

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

      toast.success("Progress updated successfully");
      if (onClose) onClose();
    } catch (err) {
      toast.error(`Failed to update progress: ${err}`);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4 items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              FRONT PHOTO
            </label>
            <label className="cursor-pointer relative group">
              <input
                type="file"
                name="frontPhoto"
                accept="image/*"
                onChange={handleFrontChange}
                className="hidden"
              />
              <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-[#0A4F48] transition-colors">
                {frontPreview ? (
                  <img
                    src={frontPreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300 flex flex-col items-center gap-1">
                    <span className="text-2xl">+</span>
                    <span className="text-[10px] font-bold">FRONT</span>
                  </div>
                )}
              </div>
            </label>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              SIDE PHOTO
            </label>
            <label className="cursor-pointer relative group">
              <input
                type="file"
                name="sidePhoto"
                accept="image/*"
                onChange={handleSideChange}
                className="hidden"
              />
              <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-[#0A4F48] transition-colors">
                {sidePreview ? (
                  <img
                    src={sidePreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300 flex flex-col items-center gap-1">
                    <span className="text-2xl">+</span>
                    <span className="text-[10px] font-bold">SIDE</span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {!isFirstTime && (
          <div className="space-y-2">
            <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest">
              Update Weight (KG)
            </label>
            <div className="relative">
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type="number"
                placeholder="e.g. 75"
                className="w-full border-2 border-gray-100 rounded-2xl focus:border-[#0A4F48] focus:outline-none p-4 font-bold text-lg transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">
                KG
              </span>
            </div>
          </div>
        )}
      </form>

      <div className="flex gap-3 mt-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex-[2] bg-[#0A4F48] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-[#083d38] transition-all shadow-lg shadow-[#0A4F48]/20"
        >
          {isFirstTime ? "Save Initial Progress" : "Update Progress"}
        </button>
      </div>
    </div>
  );
}
