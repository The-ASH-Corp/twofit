import { ErrorMessage, Field } from "formik";
import React from "react";

const CUSTOM_SELECT_VALUE = "__custom__";

const FormSelect = ({
  label,
  name,
  options,
  onChange,
  allowCustom = false,
  customOptionLabel = "Other",
  customPlaceholder,
  customInputWithoutOption = false,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className="font-medium">{label}</label>

      <Field name={name}>
        {({ field, form }) => (
          (() => {
            const normalizedOptions = options || [];
            const knownValues = new Set(
              normalizedOptions.map((opt) =>
                String(opt.value ?? opt?._id ?? ""),
              ),
            );
            const currentValue = field.value ?? "";
            const isCustomSelected =
              Boolean(currentValue) && !knownValues.has(String(currentValue));
            const selectValue = isCustomSelected
              ? customInputWithoutOption
                ? ""
                : CUSTOM_SELECT_VALUE
              : currentValue;

            return (
              <>
                <select
                  {...field}
                  value={selectValue}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A4F48]"
                  onChange={(e) => {
                    const selectedValue = e.target.value;

                    if (
                      !customInputWithoutOption &&
                      selectedValue === CUSTOM_SELECT_VALUE
                    ) {
                      const nextCustomValue = isCustomSelected ? currentValue : "";
                      form.setFieldValue(name, nextCustomValue);
                      form.setFieldTouched(name, true, false);
                      if (onChange) {
                        onChange(
                          {
                            ...e,
                            target: { ...e.target, value: nextCustomValue },
                          },
                          form,
                        );
                      }
                      return;
                    }

                    field.onChange(e);
                    if (onChange) onChange(e, form);
                  }}
                >
                  <option value="">Select {label}</option>

                  {normalizedOptions.map((opt) => (
                    <option key={opt.value ?? opt?._id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}

                  {allowCustom && !customInputWithoutOption && (
                    <option value={CUSTOM_SELECT_VALUE}>{customOptionLabel}</option>
                  )}
                </select>

                {allowCustom &&
                  (customInputWithoutOption ||
                    selectValue === CUSTOM_SELECT_VALUE) && (
                  <input
                    type="text"
                    value={isCustomSelected ? currentValue : ""}
                    onChange={(e) => {
                      form.setFieldValue(name, e.target.value);
                      form.setFieldTouched(name, true, false);
                    }}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A4F48]"
                    placeholder={customPlaceholder || `Enter ${label?.toLowerCase()}`}
                  />
                )}
              </>
            );
          })()
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

export default FormSelect;
