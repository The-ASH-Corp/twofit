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
import { FiSave, FiX } from "react-icons/fi";

export default function BaseForm({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  heading,
  submitButton,
  enableReinitialize = false,
}) {
  const navigate = useNavigate();

  const renderField = (field) => {
    switch (field.type) {
      case "radio":
        return (
          <div className="w-full">
            <FormRadio
              label={field.label}
              name={field.name}
              options={field.options}
            />
          </div>
        );
      case "select":
        return (
           <div className="w-full">
            <FormSelect
                label={field.label ?? "Select Option"}
                name={field.name}
                options={field.options}
                onChange={field.onChange}
            />
           </div>
        );
      case "multiple":
        return (
          <div className="w-full">
              <MultipleSelectForm
                label={field.label ?? "Select Multiple"}
                name={field.name}
                options={field.options}
                allowCustom={field.allowCustom || false}
              />
          </div>
        );
      case "file":
        return (
          <div className="w-full col-span-2">
            <FormFileInput
                label={field.label}
                name={field.name}
                accept={field.accept}
            />
          </div>
        );
      case "toggle":
        return (
          <div className="w-full">
            <FormToggle name={field.name} label={field.label} />
          </div>
        );
      case "checkbox-group":
        return (
          <div className="w-full col-span-2">
            <FormCheckboxGroup
              label={field.label}
              name={field.name}
              options={field.options}
            />
          </div>
        );
      case "time-range":
        return (
          <div className="w-full col-span-2">
            <FormTimeRange
              label={field.label}
              startName={field.startName}
              endName={field.endName}
            />
          </div>
        );
      default:
        // Default to text input (includes 'text', 'email', 'date', 'number', etc.)
        return (
           <div className="w-full">
            <FormInput
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              onChange={field.onChange}
              readOnly={field.readOnly}
            />
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen rounded-2xl bg-[#F0F4F8] pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#0A4F48] hover:border-[#0A4F48]/30 transition-all shadow-sm group"
            >
              <FiX
                size={20}
                className="group-hover:scale-90 transition-transform"
              />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                {heading || "Create Entry"}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Fill in the details 
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("base-form-submit")?.click()
              }
              className="px-6 py-2.5 rounded-xl bg-[#0A4F48] text-white font-bold text-sm hover:bg-[#083D38] transition-all shadow-md shadow-[#0A4F48]/20 hover:shadow-lg hover:shadow-[#0A4F48]/30 flex items-center gap-2 active:scale-95"
            >
              <FiSave size={18} />
              <span>{submitButton || "Save Changes"}</span>
            </button>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={enableReinitialize}
        >
          {() => (
            <Form className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start pb-28 sm:pb-0">
              {/* Left Column - Main Details */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                {fields
                  .filter((section) => section.position === "left")
                  .map((section, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-visible"
                    >
                      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="w-1 h-4 bg-[#0A4F48] rounded-full"></div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                          {section.section}
                        </h3>
                      </div>
                      <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          {section.fields.map((field, fIndex) => (
                            <div
                              key={field.name || fIndex}
                              className={
                                [
                                  "radio",
                                  "checkbox-group",
                                  "time-range",
                                  "file",
                                  "textarea",
                                  "description",
                                ].includes(field.type)
                                  ? "col-span-1 md:col-span-2"
                                  : "col-span-1"
                              }
                            >
                              {renderField(field)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Right Column - Secondary/Meta Details */}
              <div className="xl:col-span-1 flex flex-col gap-6">
                {/* Sticky wrapper for right column content */}
                <div className="flex flex-col gap-6 xl:sticky xl:top-6">
                  {fields
                    .filter((section) => section.position === "right")
                    .map((section, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-visible"
                      >
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            {section.section}
                          </h3>
                        </div>
                        <div className="p-5 flex flex-col gap-5">
                          {section.fields.map((field, fIndex) => (
                            <div key={field.name || fIndex} className="w-full">
                              {renderField(field)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Mobile Floating Action Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 sm:hidden z-50 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  id="base-form-submit"
                  type="submit"
                  className="flex-2 py-3 px-4 rounded-xl bg-[#0A4F48] text-white font-bold text-sm shadow-lg shadow-[#0A4F48]/20"
                >
                  Save
                </button>
              </div>

              {/* Hidden submit button for desktop proxy click */}
              <button id="base-form-submit" type="submit" className="hidden" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
