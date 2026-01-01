import { ErrorMessage, Field } from "formik";
import React, { useState, useRef, useEffect } from "react";

const MultipleSelectForm = ({ label, name, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col w-full" ref={ref}>
            <label className="font-medium">{label}</label>
            <Field name={name}>
                {({ field, form }) => (
                    <div className="relative">
                        <div
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            {field.value && field.value.length > 0
                                ? options
                                      .filter(opt => field.value.includes(opt.value))
                                      .map(opt => opt.label)
                                      .join(", ")
                                : "Select..."}
                        </div>
                        {open && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {options.map(opt => (
                                    <label
                                        key={opt.value}
                                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={field.value?.includes(opt.value) || false}
                                            onChange={e => {
                                                let newValue = field.value ? [...field.value] : [];
                                                if (e.target.checked) {
                                                    newValue.push(opt.value);
                                                } else {
                                                    newValue = newValue.filter(v => v !== opt.value);
                                                }
                                                form.setFieldValue(name, newValue);
                                            }}
                                            className="mr-2"
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Field>
            <ErrorMessage
                name={name}
                component="p"
                className="text-red-500 text-sm mt-1"
            />
        </div>
    );
};

export default MultipleSelectForm;
