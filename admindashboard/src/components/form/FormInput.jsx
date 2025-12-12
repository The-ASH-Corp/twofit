import { Field, ErrorMessage } from "formik";

export default function FormInput({ label, name, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>

      <Field
        name={name}
        type={type}
        className="border border-gray-300 p-2 rounded-md w-full"
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
