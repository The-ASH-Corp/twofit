import { ErrorMessage, Field } from "formik";
import React, { useEffect, useRef, useState } from "react";

const normalizeValue = (value) => String(value ?? "");

export default function SingleSelectForm({
  label,
  name,
  options,
  allowCustom = false,
  customPlaceholder = "Add other...",
}) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [customOptions, setCustomOptions] = useState([]);
  const ref = useRef(null);

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
        {({ field, form }) => {
          const baseOptions = options || [];
          const currentValue = normalizeValue(field.value);

          const map = new Map();

          baseOptions.forEach((opt) => {
            map.set(normalizeValue(opt.value), opt);
          });

          customOptions.forEach((opt) => {
            const key = normalizeValue(opt.value);
            if (!map.has(key)) {
              map.set(key, opt);
            }
          });

          if (currentValue && !map.has(currentValue)) {
            map.set(currentValue, { label: currentValue, value: currentValue });
          }

          const mergedOptions = Array.from(map.values());

          const selectedLabel =
            mergedOptions.find((opt) => normalizeValue(opt.value) === currentValue)
              ?.label || "";

          const handleAddCustom = () => {
            const trimmed = customValue.trim();
            if (!trimmed) return;

            const customOption = { label: trimmed, value: trimmed };

            setCustomOptions((prev) => {
              if (
                prev.some(
                  (opt) => normalizeValue(opt.value) === normalizeValue(trimmed),
                )
              ) {
                return prev;
              }
              return [...prev, customOption];
            });

            form.setFieldValue(name, trimmed);
            form.setFieldTouched(name, true, false);
            setCustomValue("");
            setOpen(false);
          };

          return (
            <div className="relative">
              <div
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer focus-within:ring-1 focus-within:ring-[#0A4F48]"
                onClick={() => setOpen((prev) => !prev)}
              >
                {selectedLabel || `Select ${label}`}
              </div>

              {open && (
                <div className="absolute z-60 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                  <div className="max-h-60 overflow-auto">
                    {mergedOptions.map((opt) => {
                      const optValue = normalizeValue(opt.value);
                      const checked = currentValue === optValue;

                      return (
                        <label
                          key={optValue}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`${name}-single`}
                            checked={checked}
                            onChange={() => {
                              form.setFieldValue(name, opt.value);
                              form.setFieldTouched(name, true, false);
                              setOpen(false);
                            }}
                            className="mr-2"
                          />
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>

                  {allowCustom && (
                    <div className="p-2 border-t border-gray-200 bg-gray-50 flex gap-2">
                      <input
                        type="text"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustom();
                          }
                        }}
                        className="flex-1 w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A4F48]"
                        placeholder={customPlaceholder}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustom}
                        className="bg-[#0A4F48] text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
      </Field>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
}
