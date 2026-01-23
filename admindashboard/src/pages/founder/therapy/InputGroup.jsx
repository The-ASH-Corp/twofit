export const InputGroup = ({
  label,
  placeholder,
  bg = "transparent",
//   value,
//   onChange,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-[#011412]">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full p-3 ${
        bg === "white" ? "bg-white" : "bg-white"
      } border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0A4F48] transition-colors placeholder:text-gray-400`}
    //   value={value}
    //   onChange={onChange}
    />
  </div>
);
