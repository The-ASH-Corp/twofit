import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormToggle from "./ToggleForm";
import FormSelect from "./FormSelect";
import MultipleSelectForm from "./MultipleSelectForm";
import FormCheckboxGroup from "./FormCheckboxGroup";
import FormTimeRange from "./FormTimeRange";
import FormFileInput from "./FormFileInput";
import { useNavigate } from "react-router-dom";

export default function BaseForm({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  // submitLabel,
  heading,
  enableReinitialize = false,
}) {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {(formik) => (
        <Form className="rounded-2xl grid grid-cols-[2.5fr_1fr] gap-4 h-[80vh]">
          {/* LEFT COLUMN */}
          <div className="overflow-y-auto no-scrollbar pr-2">
            {fields
              .filter((section) => section.position === "left")
              .map((section, index) => (
                <div
                  key={index}
                  className="space-y-4 bg-white p-5 rounded-xl mb-4"
                >
                  <h2 className="text-[16px] font-bold text-[#181E27]">
                    {section.section}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    {section.fields.map((field) => {
                      if (field.type === "radio") {
                        return (
                          <div key={field.name} className="col-span-2">
                            <FormRadio
                              label={field.label}
                              name={field.name}
                              options={field.options}
                            />
                          </div>
                        );
                      } else if (field.type == "select") {
                        return (
                          <div key={field.name}>
                            <FormSelect
                              key={field.name}
                              label={field.label ?? "just text"}
                              name={field.name}
                              options={field.options}
                              onChange={field.onChange}
                            />
                          </div>
                        );
                      } else if (field.type === "multiple") {
                        return (
                          <MultipleSelectForm
                            key={field._id}
                            label={field.label ?? "just text"}
                            name={field.name}
                            options={field.options}
                            allowCustom={field.allowCustom}
                          />
                        );
                      } else if (field.type === "file") {
                        return (
                          <FormFileInput
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            accept={field.accept}
                          />
                        );
                      }

                      return (
                        <FormInput
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          type={field.type || "text"}
                          onChange={field.onChange}
                          readOnly={field.readOnly}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="overflow-y-auto  no-scrollbar pl-2">
            {fields
              .filter((section) => section.position === "right")
              .map((section, index) => (
                <div
                  key={index}
                  className="space-y-4 bg-white p-5 rounded-xl mb-4"
                >
                  <h2 className="text-[16px] font-bold">{section.section}</h2>

                  <div className="space-y-2 text-[11px]">
                    {section.fields.map((field) => {
                      if (field.type === "radio") {
                        return (
                          <div key={field.name} className="col-span-2">
                            <FormRadio
                              label={field.label}
                              name={field.name}
                              options={field.options}
                            />
                          </div>
                        );
                      }
                      if (field.type === "toggle") {
                        return (
                          <div key={field.name} className="col-span-2">
                            <FormToggle name={field.name} label={field.label} />
                          </div>
                        );
                      } else if (field.type == "checkbox-group") {
                        return (
                          <FormCheckboxGroup
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            options={field.options}
                          />
                        );
                      } else if (field.type == "time-range") {
                        return (
                          <div key={field.startName}>
                            <FormTimeRange
                              label={field.label}
                              startName={field.startName}
                              endName={field.endName}
                            />
                          </div>
                        );
                      } else if (field.type == "select") {
                        return (
                          <div key={field.name}>
                            <FormSelect
                              key={field.name}
                              label={field.label ?? "just text"}
                              name={field.name}
                              options={field.options}
                              onChange={field.onChange}
                            />
                          </div>
                        );
                      } else if (field.type === "multiple") {
                        return (
                          <MultipleSelectForm
                            key={field._id}
                            label={field.label ?? "just text"}
                            name={field.name}
                            options={field.options}
                            allowCustom={field.allowCustom}
                          />
                        );
                      }

                      return (
                        <FormInput
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          type={field.type || "text"}
                          onChange={field.onChange}
                          readOnly={field.readOnly}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
          <div className="w-full col-span-2 flex flex-col items-center gap-3">
            <hr className="w-full text-gray-300" />
            <div className="flex justify-end items-center text-[12px] font-semibold  w-full">
              {/* <h2>Save as Draft</h2> */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="bg-[#EBF3F2]  rounded-md p-2  "
                >
                  Cancel
                </button>
                <button
                  className="bg-[#0A4F48] p-2 rounded-md text-white"
                  type="submit"
                >
                  Save & {heading ?? "Client"}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
