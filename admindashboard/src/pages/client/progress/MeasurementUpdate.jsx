export default function MeasurementUpdate() {
  return (
    <div className="space-y-4 flex flex-col h-full">
        <label>Chest</label>
      <input placeholder="Add Chest (cm)" className="w-full border focus:outline-none border-gray-200 p-2 rounded-lg" />
      <label>Waist</label>
      <input placeholder="Add Waist (cm)" className="w-full border focus:outline-none border-gray-200  p-2 rounded-lg" />
      <label>Hip</label>
      <input placeholder="Add Hip (cm)" className="w-full border focus:outline-none border-gray-200  p-2 rounded-lg" />
      <button className="w-full mt-auto bg-[#0A4F48] text-white py-2 focus:outline-none border-gray-400  rounded-lg">
        Save
      </button>
    </div>
  );
}
