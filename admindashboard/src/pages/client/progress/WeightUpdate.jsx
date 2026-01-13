export default function WeightUpdate() {
  return (
    <div className="space-y-4  flex flex-col h-full">
        <label>Current Weight</label>
      <input
        type="number"
        placeholder="Enter Weight (kg)"
        className="w-full border border-gray-200 rounded-xl focus:outline-none  p-2"
      />
      <div className="mt-auto">
        <button className="bg-[#0A4F48] w-full bottom-0   text-white px-4 py-2 rounded-xl">
          Submit
        </button>
      </div>
    </div>
  );
}
