import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormToggle from "./ToggleForm";

export default function BaseForm({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  submitLabel,
  heading,
}) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
                      }

                      return (
                        <FormInput
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          type={field.type || "text"}
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
                      }

                      return (
                        <FormInput
                          key={field.name}
                          label={field.label}
                          name={field.name}
                          type={field.type || "text"}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
          <hr className="col-span-2 w-full text-gray-300" />
          <div className="col-span-2 flex justify-between items-center text-[12px] font-semibold  ">
            <h2>Save as Draft</h2>
            <div className="flex gap-2">
              <button className="bg-[#EBF3F2]  rounded-md p-2  ">Cancel</button>
              <button className="bg-[#0A4F48] p-2 rounded-md text-white" type="submit">
                Save & Add Client
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
