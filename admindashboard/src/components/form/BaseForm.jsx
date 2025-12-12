import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";

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
        <Form className="space-y-10  rounded-2xl">
          {fields.map((section, index) => (
            <div key={index} className="space-y-4 bg-white p-5 rounded-xl">
              <h2 className="text-[16px] font-bold">
                {section.section}
              </h2>

              <div className="grid grid-cols-2  gap-4 text-[11px]">
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

          {/* <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded-md"
  >
    {submitLabel}
  </button> */}
        </Form>
      )}
    </Formik>
  );
}
